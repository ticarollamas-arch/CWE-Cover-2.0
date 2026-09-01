"""
Unit Tests for EvidencePackager and External Tools Manager • CWE-Cover 2.0
"""

import unittest
import os
import shutil
import tempfile
import zipfile
from engine.packager import EvidencePackager, check_external_tool, audit_external_tools


class TestEvidencePackager(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.packager = EvidencePackager("https://test-scope.example.com", base_reports_dir=self.test_dir)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_audit_external_tools(self):
        """Verifies external tools audit runs cleanly and returns a dict with status."""
        tools = audit_external_tools()
        self.assertIn("aquatone", tools)
        self.assertIn("subfinder", tools)
        self.assertIn("httpx", tools)
        self.assertIsInstance(tools["aquatone"]["available"], bool)

    def test_package_structure_and_zip_creation(self):
        """Verifies directory hierarchy, artifact population, and valid ZIP creation."""
        dummy_findings = [
            {
                "cwe_id": "CWE-693",
                "title": "Mecanismos de Proteção Ausentes",
                "severity": "MEDIUM",
                "risk_score": 4.5,
                "confidence": 0.90,
                "status": "OBSERVATION",
                "url": "https://test-scope.example.com",
                "detection_reason": "Headers ausentes: Content-Security-Policy",
                "evidences": [{"source": "http_analyst", "raw": "CSP missing"}],
                "poc_command": "curl -I -s \"https://test-scope.example.com\"",
                "poc": "Request: curl -I ...",
                "what_was_proven": "Headers ausentes na resposta HTTP.",
                "what_was_not_proven": "Sem exploração hostil.",
                "impact": "Exposição preventiva.",
                "remediation": "Adicionar CSP."
            }
        ]
        dummy_urls = ["https://test-scope.example.com", "https://test-scope.example.com/about"]
        dummy_logs = ["Log line 1", "Log line 2"]

        result = self.packager.finalize_package(dummy_urls, dummy_findings, dummy_logs)

        # 1. Check ZIP path existence
        self.assertTrue(os.path.isfile(result["zip_path"]))
        self.assertTrue(os.path.isabs(result["abs_zip_path"]))
        self.assertTrue(len(result["size_str"]) > 0)

        # 2. Check individual finding artifacts inside folder
        cwe_folder = os.path.join(result["findings_dir"], "CWE-693")
        self.assertTrue(os.path.isdir(cwe_folder))
        self.assertTrue(os.path.isfile(os.path.join(cwe_folder, "finding.md")))
        self.assertTrue(os.path.isfile(os.path.join(cwe_folder, "evidence", "raw_evidence.txt")))
        self.assertTrue(os.path.isfile(os.path.join(cwe_folder, "poc", "reproduce.sh")))

        # 3. Check logs and evidence
        self.assertTrue(os.path.isfile(os.path.join(result["evidence_dir"], "audited_urls.txt")))
        self.assertTrue(os.path.isfile(os.path.join(result["run_dir"], "logs", "execution.log")))
        self.assertTrue(os.path.isfile(os.path.join(result["run_dir"], "logs", "tools_status.txt")))

        # 4. Verify ZIP contents
        with zipfile.ZipFile(result["zip_path"], "r") as zf:
            namelist = zf.namelist()
            self.assertTrue(any("finding.md" in n for n in namelist))
            self.assertTrue(any("audited_urls.txt" in n for n in namelist))
            self.assertTrue(any("reproduce.sh" in n for n in namelist))


if __name__ == "__main__":
    unittest.main()
