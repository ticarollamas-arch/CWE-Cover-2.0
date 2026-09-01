"""
Unit Tests for CWE-Cover 2.0 • Evidence-First Multi-Agent Architecture
Author: Carol Lamas (CyberHuntLab)
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents.models import ScopeConfig, ScopeMode, FindingStatus, Evidence, AgentFinding
from agents.validation import ValidationAgent
from agents.false_positive import FalsePositiveAgent
from agents.impact import ImpactAgent
from agents.pipeline import AgentPipeline


class TestEvidenceFirstPipeline(unittest.TestCase):

    def setUp(self):
        self.scope = ScopeConfig(
            target="https://alvo-autorizado.example",
            allowed_domains=["alvo-autorizado.example"],
            authorization=True,
            mode=ScopeMode.PASSIVE
        )
        self.validator = ValidationAgent(self.scope)
        self.fp_agent = FalsePositiveAgent()
        self.impact_agent = ImpactAgent()

    def test_generic_server_banner_not_confirmed_cwe200(self):
        """Teste 1: Header 'Server' comum (Cloudflare/AmazonS3) não vira automaticamente CWE-200 confirmado."""
        finding = AgentFinding(
            cwe_id="CWE-200",
            title="Exposure of Sensitive Information",
            severity="LOW",
            risk_score=3.0,
            confidence=0.90,
            status=FindingStatus.HYPOTHESIS,
            url="https://alvo-autorizado.example",
            evidences=[
                Evidence(source="header_crawler", description="Server Banner", raw="Server: cloudflare", url="https://alvo-autorizado.example")
            ]
        )

        finding = self.validator.validate_finding(finding)
        finding = self.fp_agent.analyze_false_positive(finding)
        finding = self.impact_agent.calculate_impact(finding)

        self.assertNotEqual(finding.status, FindingStatus.CONFIRMED)
        self.assertEqual(finding.status, FindingStatus.OBSERVATION)
        self.assertFalse(finding.confirmed)
        self.assertLessEqual(finding.confidence, 0.50)

    def test_missing_csp_not_confirmed_xss(self):
        """Teste 2: Ausência de CSP não vira automaticamente XSS confirmado."""
        finding = AgentFinding(
            cwe_id="CWE-693",
            title="Protection Mechanism Failure",
            severity="MEDIUM",
            risk_score=5.0,
            confidence=0.90,
            status=FindingStatus.HYPOTHESIS,
            url="https://alvo-autorizado.example",
            evidences=[
                Evidence(source="header_crawler", description="Missing Header", raw="Missing headers: Content-Security-Policy", url="https://alvo-autorizado.example")
            ]
        )

        finding = self.validator.validate_finding(finding)
        finding = self.fp_agent.analyze_false_positive(finding)
        finding = self.impact_agent.calculate_impact(finding)

        self.assertFalse(finding.confirmed)
        self.assertEqual(finding.status, FindingStatus.OBSERVATION)

    def test_contradictory_evidence_reduces_confidence(self):
        """Teste 3: Evidências contraditórias reduzem a confiança e marcam como UNCERTAIN."""
        finding = AgentFinding(
            cwe_id="CWE-200",
            title="Exposure of Sensitive Information",
            severity="LOW",
            risk_score=3.0,
            confidence=0.80,
            status=FindingStatus.HYPOTHESIS,
            url="https://alvo-autorizado.example",
            evidences=[
                Evidence(source="pass_1", description="Observation 1", raw="Server: cloudflare", url="https://alvo-autorizado.example")
            ],
            contradictory_evidence=["Server: cloudflare", "Server: AmazonS3"]
        )

        finding = self.validator.validate_finding(finding)
        self.assertEqual(finding.status, FindingStatus.UNCERTAIN)
        self.assertLess(finding.confidence, 0.50)
        self.assertFalse(finding.confirmed)

    def test_insufficient_evidence_remains_unconfirmed(self):
        """Teste 4: Finding sem evidência técnica suficiente permanece INSUFFICIENT_EVIDENCE."""
        finding = AgentFinding(
            cwe_id="CWE-22",
            title="Path Traversal",
            severity="HIGH",
            risk_score=7.5,
            confidence=0.80,
            status=FindingStatus.HYPOTHESIS,
            url="https://alvo-autorizado.example",
            evidences=[]
        )

        finding = self.validator.validate_finding(finding)
        self.assertEqual(finding.status, FindingStatus.INSUFFICIENT_EVIDENCE)
        self.assertFalse(finding.confirmed)

    def test_critical_env_file_confirmed(self):
        """Teste 5: Exposição real de arquivo .env com credenciais é classificada como CONFIRMED."""
        finding = AgentFinding(
            cwe_id="CWE-200",
            title="Exposure of Sensitive Information",
            severity="HIGH",
            risk_score=9.0,
            confidence=0.99,
            status=FindingStatus.HYPOTHESIS,
            url="https://alvo-autorizado.example/.env",
            evidences=[
                Evidence(source="crawler", description="Public .env", raw="DB_PASSWORD=secret_value", url="https://alvo-autorizado.example/.env")
            ]
        )

        finding = self.validator.validate_finding(finding)
        finding = self.fp_agent.analyze_false_positive(finding)
        finding = self.impact_agent.calculate_impact(finding)

        self.assertEqual(finding.status, FindingStatus.CONFIRMED)
        self.assertTrue(finding.confirmed)

    def test_full_pipeline_execution(self):
        """Teste 6: Execução completa do pipeline com dados mockados."""
        pipeline = AgentPipeline("https://alvo-autorizado.example", self.scope, platform="hackerone")
        raw_data = [
            {"cwe_id": "CWE-693", "title": "Missing Headers", "severity": "MEDIUM", "confidence": 0.9, "risk_score": 4.5, "url": "https://alvo-autorizado.example", "evidence": "Missing headers: Content-Security-Policy"},
            {"cwe_id": "CWE-200", "title": "Server Banner", "severity": "LOW", "confidence": 0.45, "risk_score": 1.35, "url": "https://alvo-autorizado.example", "evidence": "Server: cloudflare"}
        ]
        result = pipeline.process(raw_data, ["https://alvo-autorizado.example"])
        self.assertEqual(result.total_urls, 1)
        self.assertEqual(len(result.findings), 2)
        self.assertEqual(result.platform, "hackerone")


if __name__ == "__main__":
    unittest.main()
