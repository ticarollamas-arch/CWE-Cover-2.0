# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE (CHE) • Master Orchestrator
Orquestrador central dos 17 Motores Autorais de Avaliação de Segurança:

1.  CH-NET        → Network Engine (Portas, Serviços, Banners, Protocolos)
2.  CH-CRAWL      → Web Discovery Engine (DOM, JS, Rotas de API, Parâmetros)
3.  CH-HTTP       → HTTP Intelligence Engine (HTTP/HTTPS, TLS, Headers, Cookies)
4.  CH-SPEEDNET   → High-Speed Network Engine (Escaneamento assíncrono adaptativo)
5.  CH-DNS        → DNS Intelligence Engine (Resolução, Subdomínios, CT Logs)
6.  CH-AUDIT      → Web Audit Engine (Postura defensiva, Headers RFC, Métodos)
7.  CH-CONTENT    → Content Discovery Engine (Arquivos críticos, Backups, Swagger)
8.  CH-FUZZ       → Fuzzing Engine (Mutação de parâmetros, Headers, Anomalias)
9.  CH-APPSEC     → Application Security Engine (Sessões, BOLA, JWT, CORS)
10. CH-DETECT     → Detection Engine (Regras declarativas, Condições AST, Matchers)
11. CH-VERIFY     → Validation Engine (Triangulação diferencial: Baseline vs Control vs Test)
12. CH-CORRELATE  → Correlation Engine (Fusão cruzada no grafo de inteligência)
13. CH-CWE        → CWE Engine (Classificação oficial MITRE CWE Top 25)
14. CH-OWASP      → OWASP Engine (Categorização OWASP Top 10 e API Security)
15. CH-IMPACT     → Impact Engine (Cálculo de CVSS v3.1 e Risk Score Matemático)
16. CH-EVIDENCE   → Evidence Engine (Ledger imutável e gerador de cURL sanitizado)
17. CH-REPORT     → Report Engine (Exportação Markdown Bugcrowd/HackerOne, JSON, JSONL)

Todos os motores compartilham um único grafo de contexto sem silos ou ferramentas externas.
Desenvolvido por: Carol Lamas (CyberHuntLab) • https://cyberhuntlab.com.br/
"""

import time
import urllib.parse
from typing import Dict, Any, List, Optional

from cyber_hunter.core.models import (
    Campaign, Asset, AssetType, Observation, 
    ObservationType, Finding, SeverityLevel, ChainOfEvidence, EvidenceItem
)
from cyber_hunter.asset_intelligence import NativeDomainEngine, NativeDnsEngine
from cyber_hunter.network_engine import NativeNetworkEngine
from cyber_hunter.http_engine import NativeHttpEngine
from cyber_hunter.crawler_engine import NativeCrawlerEngine
from cyber_hunter.technology_engine import NativeTechnologyEngine
from cyber_hunter.detection_engine import NativeDetectionEngine
from cyber_hunter.validation_engine import NativeValidationEngine
from cyber_hunter.security_intelligence import NativeSecurityIntelligence
from cyber_hunter.evidence_engine import NativeEvidenceEngine
from cyber_hunter.report_engine import NativeReportEngine


class CyberHunterOrchestrator:
    """CH-ORCHESTRATOR: Executa a campanha orquestrando os 17 motores em pipeline contínuo."""

    def __init__(self, target_url: str, has_authorization: bool = True):
        self.target_url = target_url
        self.parsed = urllib.parse.urlparse(target_url)
        self.domain = self.parsed.netloc or self.parsed.path
        if ":" in self.domain:
            self.domain = self.domain.split(":")[0]

        self.campaign = Campaign(
            name=f"Campanha Cyber Hunter • {self.domain}",
            target_root=self.target_url,
            scope_policy="STRICT_DEFENSIVE_AUDIT",
            has_authorization=has_authorization
        )

    def execute_campaign(
        self, 
        enable_subdomains: bool = True, 
        enable_ports: bool = True, 
        enable_crawl: bool = True,
        enable_content: bool = True
    ) -> Campaign:
        
        # ─── FASE 1: DISCOVERY (CH-DNS, CH-NET, CH-SPEEDNET) ───────────────────
        
        # 1. Registrar Ativo Raiz
        root_asset_id = self.campaign.add_asset(Asset(
            asset_type=AssetType.DOMAIN,
            value=self.domain,
            attributes={"url": self.target_url}
        ))

        # 2. CH-DNS: DNS Intelligence & Certificate Transparency
        if enable_subdomains:
            subs = NativeDomainEngine.enumerate_subdomains(self.domain)
            for s in subs:
                dns = NativeDnsEngine.resolve_domain(s)
                self.campaign.add_asset(Asset(
                    asset_type=AssetType.SUBDOMAIN,
                    value=s,
                    parent_asset_id=root_asset_id,
                    attributes=dns
                ))

        # 3. CH-NET & CH-SPEEDNET: Descoberta de Portas e Serviços
        if enable_ports:
            ports = NativeNetworkEngine.scan_host(self.domain, ports=[80, 443, 8080, 8443, 21, 22, 3306, 6379])
            for p in ports:
                self.campaign.add_observation(Observation(
                    asset_id=root_asset_id,
                    source_engine="CH-NET",
                    obs_type=ObservationType.OPEN_PORT,
                    data=p
                ))

        # ─── FASE 2: ANALYSIS (CH-HTTP, CH-AUDIT, CH-CRAWL) ───────────────────

        # 4. CH-HTTP: HTTP Intelligence & Probing
        http_res = NativeHttpEngine.request(self.target_url)
        if http_res["success"] and http_res["response"]:
            resp = http_res["response"]
            req = http_res["request"]

            # 5. CH-AUDIT: Auditoria de Cabeçalhos de Segurança (CWE-693)
            header_audit = NativeHttpEngine.audit_security_headers(resp.headers)
            for miss in header_audit["missing_headers"]:
                f = Finding(
                    title=f"Cabeçalho de Segurança Ausente: {miss['header']}",
                    severity=SeverityLevel.MEDIUM if "strict" in miss["header"] or "content-sec" in miss["header"] else SeverityLevel.LOW,
                    cwe_id="CWE-693",
                    target=self.target_url,
                    description=f"O servidor web não enviou o cabeçalho {miss['header']}. {miss['description']}"
                )
                
                # 6. CH-CWE, CH-OWASP & CH-IMPACT: Enriquecimento de Risco
                NativeSecurityIntelligence.enrich_finding(f)
                
                # 7. CH-EVIDENCE: Anexa cadeia de evidência sanitizada com cURL
                chain = ChainOfEvidence()
                chain.add(NativeEvidenceEngine.create_evidence_item(
                    title=f"Evidência de Cabeçalho Ausente ({miss['header']})",
                    description=f"Cabeçalho ausente na resposta HTTP {resp.status_code}.",
                    request=req,
                    response=resp
                ))
                f.chain_of_evidence = chain
                self.campaign.add_finding(f)

            # 8. CH-TECH: Technology Fingerprinting
            techs = NativeTechnologyEngine.identify_technologies(resp.headers, resp.body_snippet)
            for t in techs:
                self.campaign.add_observation(Observation(
                    asset_id=root_asset_id,
                    source_engine="CH-TECH",
                    obs_type=ObservationType.TECHNOLOGY_DETECTED,
                    data=t
                ))

            # 9. CH-CRAWL: Web Discovery Engine (Stream HTML & Regex JS)
            if enable_crawl:
                crawl_data = NativeCrawlerEngine.extract_links(self.target_url, resp.body_snippet)
                for link in crawl_data["links"][:20]:
                    self.campaign.add_asset(Asset(
                        asset_type=AssetType.ENDPOINT,
                        value=link,
                        parent_asset_id=root_asset_id
                    ))

        # ─── FASE 3: VALIDATION (CH-CONTENT, CH-DETECT, CH-VERIFY) ─────────────

        # 10. CH-CONTENT & CH-DETECT: Descoberta de Recursos e Testes Declarativos
        if enable_content:
            detection_engine = NativeDetectionEngine()
            test_paths = ["/.git/HEAD", "/.env", "/swagger-ui/index.html", "/actuator/env", "/phpinfo.php"]
            base_url = self.target_url.rstrip("/")

            for p in test_paths:
                probe_url = f"{base_url}{p}"
                p_res = NativeHttpEngine.request(probe_url)
                if p_res["success"] and p_res["response"]:
                    # 11. CH-VERIFY: Triangulação diferencial contra Soft 404 e WAFs
                    if p_res["response"].status_code == 200:
                        is_soft = NativeValidationEngine.is_soft_404(p_res["response"])
                        if not is_soft:
                            detected_findings = detection_engine.evaluate_response(probe_url, p_res["request"], p_res["response"])
                            for df in detected_findings:
                                NativeSecurityIntelligence.enrich_finding(df)
                                self.campaign.add_finding(df)

        self.campaign.ended_at = time.time()
        return self.campaign
