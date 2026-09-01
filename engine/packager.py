"""
Evidence Packager & External Tool Integrator • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Manages evidence structuring, external tool discovery (Aquatone, etc.),
and ZIP packaging of all execution artifacts.
"""

import os
import sys
import shutil
import zipfile
import json
import time
import subprocess
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse


def check_external_tool(tool_name: str) -> Optional[str]:
    """Verifies if an external tool is installed in the system PATH without bundling."""
    return shutil.which(tool_name)


def audit_external_tools() -> Dict[str, Dict[str, Any]]:
    """Audits the availability of common recon and triage external tools."""
    tools = ["aquatone", "subfinder", "httpx", "katana", "nuclei", "gau", "amass", "chromium"]
    status_map = {}
    for tool in tools:
        path = check_external_tool(tool)
        status_map[tool] = {
            "available": path is not None,
            "path": path or "NOT AVAILABLE"
        }
    return status_map


class EvidencePackager:
    """Orchestrates creation of the complete evidence tree and final ZIP archive."""

    def __init__(self, target_url: str, base_reports_dir: str = "reports"):
        self.target_url = target_url
        self.parsed = urlparse(target_url)
        self.target_domain = self.parsed.netloc or self.parsed.path.split("/")[0] or "target"
        # Clean domain for filesystem safety
        self.clean_domain = "".join(c if c.isalnum() or c in ".-_" else "_" for c in self.target_domain)
        self.timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")
        self.base_reports_dir = base_reports_dir
        
        # Structure: reports/<clean_domain>/<timestamp>/
        self.run_dir = os.path.join(self.base_reports_dir, self.clean_domain, self.timestamp)
        self.findings_dir = os.path.join(self.run_dir, "findings")
        self.screenshots_dir = os.path.join(self.run_dir, "screenshots", self.clean_domain)
        self.evidence_dir = os.path.join(self.run_dir, "evidence")
        self.logs_dir = os.path.join(self.run_dir, "logs")
        self.tools_dir = os.path.join(self.run_dir, "tools")

    def setup_directories(self) -> None:
        """Creates the full structured directory hierarchy."""
        for d in [self.run_dir, self.findings_dir, self.screenshots_dir, self.evidence_dir, self.logs_dir, self.tools_dir]:
            os.makedirs(d, exist_ok=True)

    def run_aquatone(self, urls: List[str]) -> Optional[str]:
        """Runs Aquatone if available on the system to capture visual evidence."""
        aquatone_bin = check_external_tool("aquatone")
        if not aquatone_bin:
            print(f"  \033[0;90m[!] Aquatone: NOT AVAILABLE (ignorando etapa visual externa)\033[0m")
            return None

        aquatone_out = os.path.join(self.tools_dir, "aquatone")
        os.makedirs(aquatone_out, exist_ok=True)

        try:
            print(f"  \033[1;36m[+] Executando Aquatone para evidência visual em {len(urls)} URLs...\033[0m")
            input_data = "\n".join(urls).encode("utf-8")
            subprocess.run(
                [aquatone_bin, "-out", aquatone_out, "-scan-timeout", "3000", "-silent"],
                input=input_data,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=45,
                check=False
            )

            # Copy screenshots into main screenshots directory
            aq_screens = os.path.join(aquatone_out, "screenshots")
            if os.path.isdir(aq_screens):
                for screen_file in os.listdir(aq_screens):
                    src = os.path.join(aq_screens, screen_file)
                    dst = os.path.join(self.screenshots_dir, screen_file)
                    shutil.copy2(src, dst)
            return aquatone_out
        except Exception as e:
            print(f"  \033[0;90m[!] Aquatone error: {e}\033[0m")
            return None

    def populate_finding_artifacts(self, finding: Dict[str, Any]) -> None:
        """Populates individual finding folder with evidence, PoC, and markdown explanation."""
        cwe_id = finding.get("cwe_id") or finding.get("cwe") or "CWE-MISC"
        cwe_folder = os.path.join(self.findings_dir, cwe_id)
        
        ev_dir = os.path.join(cwe_folder, "evidence")
        sc_dir = os.path.join(cwe_folder, "screenshots")
        poc_dir = os.path.join(cwe_folder, "poc")
        
        os.makedirs(ev_dir, exist_ok=True)
        os.makedirs(sc_dir, exist_ok=True)
        os.makedirs(poc_dir, exist_ok=True)

        # 1. Write Evidence
        ev_file = os.path.join(ev_dir, "raw_evidence.txt")
        with open(ev_file, "w", encoding="utf-8") as f:
            f.write(f"CWE: {cwe_id}\n")
            f.write(f"URL: {finding.get('url', '')}\n")
            f.write(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("=== OBSERVED EVIDENCE ===\n")
            ev_list = finding.get("evidences", []) or finding.get("evidence", [])
            for ev in ev_list:
                if isinstance(ev, dict):
                    f.write(f"[{ev.get('source', 'engine')}] {ev.get('raw', '')}\n")
                else:
                    f.write(f"{ev}\n")
            if not ev_list:
                f.write(f"{finding.get('observed_behavior', '')}\n")

        # 2. Write PoC / Reproduction script
        poc_sh = os.path.join(poc_dir, "reproduce.sh")
        with open(poc_sh, "w", encoding="utf-8") as f:
            f.write("#!/usr/bin/env bash\n")
            f.write(f"# Safe reproduction script for {cwe_id} on {finding.get('url', '')}\n")
            poc_cmd = finding.get("poc_command") or f"curl -I -s \"{finding.get('url', '')}\""
            f.write(f"{poc_cmd}\n")
        try:
            os.chmod(poc_sh, 0o755)
        except Exception:
            pass

        poc_txt = os.path.join(poc_dir, "poc_details.txt")
        with open(poc_txt, "w", encoding="utf-8") as f:
            f.write(f"Proof of Concept / Technical Trace — {cwe_id}\n\n")
            f.write(f"{finding.get('poc', 'N/A')}\n\n")
            f.write(f"Command: {finding.get('poc_command', 'N/A')}\n")

        # 3. Write individual finding.md
        finding_md = os.path.join(cwe_folder, "finding.md")
        with open(finding_md, "w", encoding="utf-8") as f:
            f.write(f"# Finding {cwe_id} — {finding.get('title', '')}\n\n")
            f.write(f"- **URL:** `{finding.get('url', '')}`\n")
            f.write(f"- **Severity:** `{finding.get('severity', 'LOW')}`\n")
            f.write(f"- **Status:** `{finding.get('status', 'HYPOTHESIS')}`\n")
            f.write(f"- **Confidence:** `{int(float(finding.get('confidence', 0.5)) * 100)}%`\n\n")
            
            f.write("## 🔍 Motivo da Detecção\n")
            f.write(f"{finding.get('detection_reason') or finding.get('observed_behavior', '')}\n\n")

            f.write("## ⚖️ Análise Técnica dos Agentes\n")
            val = finding.get("validation", {})
            f.write(f"- **O que foi comprovado:** {val.get('what_was_proven') or finding.get('what_was_proven', '')}\n")
            f.write(f"- **O que NÃO foi comprovado:** {val.get('what_was_not_proven') or finding.get('what_was_not_proven', '')}\n")
            f.write(f"- **Análise de Falso Positivo:** {finding.get('false_positive_analysis', 'N/A')}\n\n")

            f.write("## 💥 Impacto & Remediação\n")
            f.write(f"- **Impacto:** {finding.get('impact', '')}\n")
            f.write(f"- **Remediação:** {finding.get('remediation', '')}\n")

    def finalize_package(
        self,
        urls: List[str],
        findings: List[Dict[str, Any]],
        execution_logs: List[str]
    ) -> Dict[str, Any]:
        """Completes package population and generates the final ZIP archive."""
        self.setup_directories()

        # Check external tools status and write log
        tools_status = audit_external_tools()
        with open(os.path.join(self.logs_dir, "tools_status.txt"), "w", encoding="utf-8") as f:
            f.write("=== EXTERNAL TOOLS AUDIT ===\n")
            for t, s in tools_status.items():
                f.write(f"{t}: {s['path']}\n")

        # Write visited URLs
        with open(os.path.join(self.evidence_dir, "audited_urls.txt"), "w", encoding="utf-8") as f:
            for u in urls:
                f.write(f"{u}\n")

        # Write execution logs
        with open(os.path.join(self.logs_dir, "execution.log"), "w", encoding="utf-8") as f:
            f.write(f"Target: {self.target_url}\n")
            f.write(f"Timestamp: {self.timestamp}\n\n")
            for line in execution_logs:
                f.write(f"{line}\n")

        # Populate findings directories
        for f in findings:
            self.populate_finding_artifacts(f)

        # Run Aquatone if available
        self.run_aquatone(urls)

        # Zip the complete run directory
        zip_filename = f"{self.timestamp}.zip"
        zip_path = os.path.join(self.base_reports_dir, self.clean_domain, zip_filename)
        
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_f:
            for root, dirs, files in os.walk(self.run_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start=self.run_dir)
                    zip_f.write(file_path, arcname)

        # Confirm ZIP file existence and compute absolute path and size
        if not os.path.isfile(zip_path):
            raise RuntimeError(f"Failed to generate evidence package ZIP at {zip_path}")

        abs_zip_path = os.path.abspath(zip_path)
        size_bytes = os.path.getsize(abs_zip_path)
        if size_bytes >= 1024 * 1024:
            size_str = f"{size_bytes / (1024 * 1024):.2f} MB"
        else:
            size_str = f"{size_bytes / 1024:.2f} KB"

        return {
            "zip_path": zip_path,
            "abs_zip_path": abs_zip_path,
            "size_str": size_str,
            "run_dir": self.run_dir,
            "abs_run_dir": os.path.abspath(self.run_dir),
            "bugcrowd_report": os.path.join(self.run_dir, "bugcrowd_triage.md"),
            "scan_agents_json": os.path.join(self.run_dir, "scan_agents.json"),
            "screenshots_dir": self.screenshots_dir,
            "evidence_dir": self.evidence_dir,
            "findings_dir": self.findings_dir,
        }
