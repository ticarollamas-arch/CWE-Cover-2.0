# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Comprehensive Test Suite
Validação de todos os 17 motores autorais, 18 agentes especializados, persistência e pipeline.
Zero dependências de scanners externos.
"""

import os
import unittest
import tempfile
import time

from cyber_hunter.core.models import (
    Campaign, Asset, AssetType, Observation, ObservationType,
    Finding, SeverityLevel, RequestRecord, ResponseRecord,
    ChainOfEvidence, EvidenceItem
)
from cyber_hunter.core.scope import ScopePolicy, AuthorizationMode
from cyber_hunter.core.telemetry import TelemetryCollector
from cyber_hunter.core.events import EventBus, Event, EventType
from cyber_hunter.core.scheduler import DAGScheduler, RateLimiter, TaskStatus
from cyber_hunter.core.storage import CampaignStorage
from cyber_hunter.core.errors import ScopeViolationError

from cyber_hunter.asset_intelligence import NativeDnsEngine, NativeDomainEngine
from cyber_hunter.network_engine import NativeNetworkEngine
from cyber_hunter.http_engine import NativeHttpEngine
from cyber_hunter.crawler_engine import NativeCrawlerEngine
from cyber_hunter.technology_engine import NativeTechnologyEngine
from cyber_hunter.detection_engine import NativeDetectionEngine
from cyber_hunter.validation_engine import NativeValidationEngine
from cyber_hunter.security_intelligence import NativeSecurityIntelligence
from cyber_hunter.evidence_engine import NativeEvidenceEngine
from cyber_hunter.report_engine import NativeReportEngine
from cyber_hunter.agents.catalog import ALL_AGENTS
from cyber_hunter.orchestrator import CyberHunterOrchestrator


class TestCyberHunterCore(unittest.TestCase):

    def test_scope_policy_validation(self):
        """Valida que a política de escopo aceita alvos autorizados e bloqueia desautorizados."""
        policy = ScopePolicy(
            allowed_roots=["example.com", "target.corp"],
            denied_targets=["admin.example.com"],
            mode=AuthorizationMode.STRICT_AUTHORIZED
        )
        self.assertTrue(policy.is_allowed("api.example.com"))
        self.assertTrue(policy.is_allowed("https://target.corp/login"))
        self.assertFalse(policy.is_allowed("evil.com"))
        self.assertFalse(policy.is_allowed("admin.example.com"))

    def test_scope_policy_blocks_private_by_default(self):
        """Garante que IPs privados são rejeitados a menos que modo LAB esteja ativo."""
        policy = ScopePolicy(mode=AuthorizationMode.STRICT_AUTHORIZED)
        self.assertFalse(policy.is_allowed("127.0.0.1"))
        self.assertFalse(policy.is_allowed("192.168.1.100"))
        self.assertFalse(policy.is_allowed("10.0.0.1"))

    def test_telemetry_collector(self):
        """Testa o coletor de métricas e rastreamento de tempo de execução."""
        telemetry = TelemetryCollector()
        telemetry.start_timer("dns_engine")
        time.sleep(0.01)
        telemetry.stop_timer("dns_engine")
        telemetry.increment("requests_total", 5)
        
        summary = telemetry.get_summary()
        self.assertIn("dns_engine", summary["durations_sec"])
        self.assertEqual(summary["counters"]["requests_total"], 5)

    def test_event_bus(self):
        """Testa o barramento de eventos PubSub."""
        bus = EventBus()
        received = []

        def handler(evt: Event):
            received.append(evt)

        bus.subscribe(EventType.ASSET_DISCOVERED, handler)
        bus.publish(Event(
            event_type=EventType.ASSET_DISCOVERED,
            source="TestRunner",
            data={"asset": "api.test.com"}
        ))

        self.assertEqual(len(received), 1)
        self.assertEqual(received[0].data["asset"], "api.test.com")

    def test_dag_scheduler(self):
        """Testa a orquestração em DAG com resolução estrita de dependências."""
        scheduler = DAGScheduler(rate_limiter=RateLimiter(max_rate_rps=100.0))
        execution_log = []

        def step_a():
            execution_log.append("A")
            return "RESULT_A"

        def step_b():
            execution_log.append("B")
            return "RESULT_B"

        def step_c():
            execution_log.append("C")
            return "RESULT_C"

        scheduler.add_task("task_a", "Discovery", step_a)
        scheduler.add_task("task_b", "PortScan", step_b, dependencies=["task_a"])
        scheduler.add_task("task_c", "Report", step_c, dependencies=["task_b"])

        results = scheduler.execute_all()
        self.assertEqual(execution_log, ["A", "B", "C"])
        self.assertEqual(results["task_c"], "RESULT_C")

    def test_persistent_storage(self):
        """Testa a persistência SQLite e recuperação de campanhas completas."""
        with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
            db_path = tmp.name

        try:
            storage = CampaignStorage(db_path=db_path)
            camp = Campaign(
                id="CAMP-TEST-001",
                name="Test Storage Campaign",
                target_root="https://test.example.com",
                has_authorization=True
            )
            a_id = camp.add_asset(Asset(asset_type=AssetType.DOMAIN, value="test.example.com"))
            camp.add_observation(Observation(
                asset_id=a_id,
                source_engine="CH-DNS",
                obs_type=ObservationType.DNS_RECORD,
                data={"ip": "1.2.3.4"}
            ))
            f = Finding(
                title="Missing CSP",
                severity=SeverityLevel.MEDIUM,
                cwe_id="CWE-693",
                target="https://test.example.com"
            )
            camp.add_finding(f)

            storage.save_campaign(camp)

            campaigns_list = storage.list_campaigns()
            self.assertEqual(len(campaigns_list), 1)
            self.assertEqual(campaigns_list[0]["id"], "CAMP-TEST-001")

            loaded = storage.load_campaign("CAMP-TEST-001")
            self.assertIsNotNone(loaded)
            self.assertEqual(len(loaded.assets), 1)
            self.assertEqual(len(loaded.observations), 1)
            self.assertEqual(len(loaded.findings), 1)
            self.assertEqual(loaded.findings[0].cwe_id, "CWE-693")
        finally:
            if os.path.exists(db_path):
                os.remove(db_path)


class TestCyberHunterEngines(unittest.TestCase):

    def test_dns_and_domain_engines(self):
        """Testa resolução e sanitização de domínio."""
        res = NativeDnsEngine.resolve_domain("localhost")
        self.assertIn("status", res)
        self.assertIn("ipv4", res)

        subs = NativeDomainEngine.enumerate_subdomains("localhost", timeout=0.1)
        self.assertIn("localhost", subs)

    def test_http_engine_security_headers_audit(self):
        """Testa a auditoria de cabeçalhos de segurança defensivos."""
        insecure_headers = {
            "server": "Apache/2.4.41",
            "content-type": "text/html"
        }
        audit = NativeHttpEngine.audit_security_headers(insecure_headers)
        self.assertFalse(audit["is_hardened"])
        missing_names = [m["header"] for m in audit["missing_headers"]]
        self.assertIn("strict-transport-security", missing_names)
        self.assertIn("content-security-policy", missing_names)

        hardened_headers = {
            "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
            "content-security-policy": "default-src 'self'",
            "x-frame-options": "DENY",
            "x-content-type-options": "nosniff",
            "referrer-policy": "no-referrer",
            "permissions-policy": "geolocation=()"
        }
        audit_hardened = NativeHttpEngine.audit_security_headers(hardened_headers)
        self.assertTrue(audit_hardened["is_hardened"])
        self.assertEqual(len(audit_hardened["missing_headers"]), 0)

    def test_crawler_engine_tokenization(self):
        """Testa a extração de links, scripts, formulários e parâmetros de HTML sem BS4."""
        html = """
        <html>
            <head>
                <script src="/static/app.bundle.js"></script>
            </head>
            <body>
                <a href="/dashboard?tab=security&user=admin">Admin Panel</a>
                <form action="/login" method="POST">
                    <input type="text" name="username">
                    <input type="password" name="password">
                </form>
            </body>
        </html>
        """
        extracted = NativeCrawlerEngine.extract_links("https://app.example.com", html)
        self.assertIn("https://app.example.com/static/app.bundle.js", extracted["scripts"])
        self.assertIn("https://app.example.com/dashboard?tab=security&user=admin", extracted["links"])
        self.assertIn("tab", extracted["discovered_parameters"])
        self.assertIn("user", extracted["discovered_parameters"])
        self.assertIn("username", extracted["discovered_parameters"])
        self.assertEqual(len(extracted["forms"]), 1)
        self.assertEqual(extracted["forms"][0]["action"], "https://app.example.com/login")

    def test_crawler_javascript_secret_discovery(self):
        """Testa a identificação de rotas de API e chaves em arquivos JS."""
        js_code = """
        const endpoint = "/api/v1/auth/login";
        const internal = "/internal/v2/metrics";
        const apiKey = "AKIAIOSFODNN7EXAMPLE";
        """
        analysis = NativeCrawlerEngine.analyze_javascript_content(js_code)
        self.assertIn("/api/v1/auth/login", analysis["discovered_api_routes"])
        self.assertIn("/internal/v2/metrics", analysis["discovered_api_routes"])
        self.assertGreaterEqual(len(analysis["potential_secrets"]), 1)
        self.assertTrue(any(s["type"] == "AWS_KEY" for s in analysis["potential_secrets"]))

    def test_technology_engine_fingerprint(self):
        """Testa o reconhecimento de tecnologias via headers e corpo."""
        headers = {
            "server": "cloudflare",
            "x-powered-by": "Next.js"
        }
        body = '<div id="__NEXT_DATA__">{}</div>'
        techs = NativeTechnologyEngine.identify_technologies(headers, body)
        names = [t["name"] for t in techs]
        self.assertIn("Next.js", names)
        self.assertIn("Cloudflare", names)

    def test_detection_engine_evaluates_git_exposure(self):
        """Testa a regra determinística para vazamento de .git."""
        det_engine = NativeDetectionEngine()
        req = RequestRecord(method="GET", url="https://target.com/.git/HEAD")
        resp = ResponseRecord(
            status_code=200,
            headers={"content-type": "text/plain"},
            body_snippet="ref: refs/heads/master\n",
            content_length=22
        )
        findings = det_engine.evaluate_response("https://target.com/.git/HEAD", req, resp)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].severity, SeverityLevel.CRITICAL)
        self.assertEqual(findings[0].cwe_id, "CWE-200")
        self.assertIsNotNone(findings[0].chain_of_evidence)

    def test_validation_engine_differential_and_soft404(self):
        """Testa a rejeição de falsos positivos por Soft 404 e triangulação diferencial."""
        soft_404_resp = ResponseRecord(
            status_code=200,
            body_snippet="<h1>404 Not Found - Oops, page not found</h1>",
            content_length=120
        )
        self.assertTrue(NativeValidationEngine.is_soft_404(soft_404_resp))

        baseline = ResponseRecord(status_code=200, body_snippet="Normal Page", content_length=500)
        control = ResponseRecord(status_code=200, body_snippet="Control Inert", content_length=505)
        test_identical = ResponseRecord(status_code=200, body_snippet="Control Inert", content_length=505)

        diff = NativeValidationEngine.validate_differential(baseline, control, test_identical)
        self.assertFalse(diff["is_valid"])

    def test_security_intelligence_enrichment(self):
        """Testa enriquecimento com CWE Top 25, OWASP e cálculo de CVSS."""
        finding = Finding(
            title="Exposição de .env",
            cwe_id="CWE-200",
            confidence=0.95
        )
        enriched = NativeSecurityIntelligence.enrich_finding(finding)
        self.assertEqual(enriched.owasp_id, "A01:2021-Broken Access Control")
        self.assertEqual(enriched.cvss_score, 7.5)
        self.assertEqual(enriched.risk_score, 7.12)  # 7.5 * 0.95 = 7.125 -> 7.12

    def test_evidence_sanitizer_and_curl(self):
        """Testa a sanitização de cookies/chaves e geração de cURL reproduzível."""
        req = RequestRecord(
            method="POST",
            url="https://api.test.com/v1/auth",
            headers={"Authorization": "Bearer supersecretjwt12345", "User-Agent": "CyberHunter"},
            body='{"user":"admin"}'
        )
        resp = ResponseRecord(status_code=200, headers={"Set-Cookie": "session=secretcookie"}, body_snippet="OK")
        
        evidence = NativeEvidenceEngine.create_evidence_item("Auth Probe", "Test Desc", req, resp)
        self.assertEqual(evidence.request.headers["Authorization"], "[REDACTED_BY_CYBER_HUNTER]")
        self.assertEqual(evidence.response.headers["Set-Cookie"], "[REDACTED_BY_CYBER_HUNTER]")

        curl = req.to_curl()
        self.assertIn("curl -s -i -X POST", curl)
        self.assertIn("https://api.test.com/v1/auth", curl)

    def test_report_engine_formats(self):
        """Testa geração de relatórios em Markdown, JSON e JSONL."""
        camp = Campaign(
            id="CAMP-REPORT-001",
            name="Report Validation Campaign",
            target_root="https://demo.target.corp",
            has_authorization=True
        )
        f = Finding(
            title="Missing Security Headers",
            severity=SeverityLevel.MEDIUM,
            cwe_id="CWE-693",
            target="https://demo.target.corp"
        )
        camp.add_finding(f)

        md = NativeReportEngine.to_markdown(camp)
        self.assertIn("# 🛡️ Relatório Executivo de Triagem", md)
        self.assertIn("Missing Security Headers", md)

        json_out = NativeReportEngine.to_json(camp)
        self.assertIn("CAMP-REPORT-001", json_out)

        jsonl_out = NativeReportEngine.to_jsonl(camp)
        self.assertIn("Missing Security Headers", jsonl_out)

    def test_all_18_agents_catalog(self):
        """Valida que todos os 18 agentes possuem identificadores únicos, schemas e regras."""
        self.assertEqual(len(ALL_AGENTS), 18)
        agent_ids = [a.agent_id for a in ALL_AGENTS]
        self.assertEqual(len(agent_ids), len(set(agent_ids)), "Identificadores de agentes devem ser únicos")
        
        for a in ALL_AGENTS:
            self.assertTrue(len(a.name) > 0)
            self.assertTrue(len(a.role) > 0)
            self.assertTrue(len(a.allowed_operations) > 0)
            self.assertTrue(len(a.decision_rules) > 0)


if __name__ == "__main__":
    unittest.main()
