"""
Report Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Generates platform-tailored triage reports across HackerOne, Bugcrowd, Markdown, JSON, HTML, and CSV.
Follows the Evidence-First and Finding Validation / PoC Explainer requirements.
"""

import json
import csv
import time
from typing import Dict, Any, List
from .models import PipelineResult, AgentFinding, FindingStatus


class ReportAgent:
    """Agent that synthesizes triage findings into structured reports for security programs."""

    def __init__(self, result: PipelineResult):
        self.result = result

    def export_json(self, file_path: str) -> None:
        """Exports full structured JSON."""
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(self.result.to_dict(), f, indent=2, ensure_ascii=False)

    def export_markdown(self, file_path: str) -> None:
        """Generates comprehensive executive Markdown report."""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# 🛡️ CWE-Cover 2.0 • Evidence-First Triage Report\n\n")
            f.write(f"- **Target:** `{self.result.target}`\n")
            f.write(f"- **Platform Context:** `{self.result.platform or 'Custom / Private Program'}`\n")
            f.write(f"- **Operation Mode:** `{self.result.mode}`\n")
            f.write(f"- **Audited URLs:** `{self.result.total_urls}`\n")
            f.write(f"- **Generated At:** `{self.result.generated_at}`\n\n")

            f.write("### Status Breakdown\n\n")
            for st, count in self.result.summary_by_status.items():
                f.write(f"- **{st}:** {count}\n")
            f.write("\n---\n\n")

            f.write("## Detailed Findings\n\n")
            if not self.result.findings:
                f.write("*No findings detected under passive constraints.*\n")

            for idx, finding in enumerate(self.result.findings, 1):
                status_str = finding.status.value if hasattr(finding.status, 'value') else str(finding.status)
                f.write(f"### {idx}. [{finding.severity}] {finding.cwe_id} — {finding.title}\n\n")
                f.write(f"- **Target URL:** `{finding.url}`\n")
                f.write(f"- **Triggered Rule:** `{finding.triggered_rule or finding.cwe_id}`\n")
                if finding.parameter:
                    f.write(f"- **Parameter:** `{finding.parameter}`\n")
                f.write(f"- **Status:** `{status_str}`\n")
                f.write(f"- **Confidence:** `{int(finding.confidence * 100)}%` | **Risk Score:** `{finding.risk_score}/10`\n\n")

                f.write(f"#### 🔍 Motivo da Detecção\n")
                f.write(f"{finding.detection_reason or finding.observed_behavior}\n\n")

                f.write(f"#### 📦 Evidência Observada\n")
                if finding.evidences:
                    for ev in finding.evidences:
                        f.write(f"- **[{ev.source}]** `{ev.raw}`\n")
                else:
                    f.write(f"- `{finding.observed_behavior}`\n")
                f.write("\n")

                f.write(f"#### 🧪 Validação da POC (Execução Segura / Não Invasiva)\n")
                if finding.poc_command:
                    f.write(f"```bash\n{finding.poc_command}\n```\n\n")
                f.write(f"```text\n{finding.poc}\n```\n\n")

                f.write(f"#### ⚖️ Análise Técnica dos Agentes\n")
                f.write(f"- **O que foi comprovado:** {finding.what_was_proven or 'Presença do sinal técnico observado.'}\n")
                f.write(f"- **O que NÃO foi comprovado:** {finding.what_was_not_proven or 'Exploração ativa não realizada (modo passivo/seguro).'}\n")
                f.write(f"- **Análise de Falso Positivo:** {finding.false_positive_analysis or 'N/A'}\n\n")

                if finding.contradictory_evidence:
                    f.write(f"- **Sinais Contraditórios:** `{', '.join(finding.contradictory_evidence)}`\n\n")

                f.write(f"#### 💥 Impacto & Remediação\n")
                f.write(f"- **Impacto:** {finding.impact}\n")
                f.write(f"- **Remediação:** {finding.remediation}\n\n")
                f.write("---\n\n")

    def export_bugcrowd(self, file_path: str) -> None:
        """Generates Bug Bounty Triage report optimized for Bugcrowd submission."""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# Bugcrowd Vulnerability Triage Report\n\n")
            f.write(f"- **Target Asset:** `{self.result.target}`\n")
            f.write(f"- **Audited Endpoints:** `{self.result.total_urls}`\n")
            f.write(f"- **Assessment Mode:** `Passive Non-Destructive Reconnaissance`\n")
            f.write(f"- **Generated At:** `{self.result.generated_at}`\n\n")

            f.write("## Executive Summary\n\n")
            f.write(
                "This report details findings identified by CWE-Cover 2.0 (CyberHuntLab). "
                "Each item is audited under strict evidence-first standards, distinguishing empirical facts from unverified hypotheses.\n\n"
            )

            for idx, finding in enumerate(self.result.findings, 1):
                status_str = finding.status.value if hasattr(finding.status, 'value') else str(finding.status)
                f.write(f"### Finding #{idx}: [{finding.severity}] {finding.cwe_id} — {finding.title}\n\n")
                f.write(f"- **Vulnerability Class:** `{finding.cwe_id}`\n")
                f.write(f"- **Affected URL:** `{finding.url}`\n")
                f.write(f"- **Validation Status:** `{status_str}` ({int(finding.confidence * 100)}% Confidence)\n\n")

                f.write(f"#### 1. Why Was This Detected?\n")
                f.write(f"{finding.detection_reason or finding.observed_behavior}\n\n")

                f.write(f"#### 2. Observed Technical Evidence\n")
                if finding.evidences:
                    for ev in finding.evidences:
                        f.write(f"```text\n{ev.raw}\n```\n")
                else:
                    f.write(f"```text\n{finding.observed_behavior}\n```\n")
                f.write("\n")

                f.write(f"#### 3. Proof of Concept (PoC) / Reproduction Steps\n")
                if finding.poc_command:
                    f.write(f"**Safe CLI Command:**\n```bash\n{finding.poc_command}\n```\n\n")
                f.write(f"**PoC Trace:**\n```text\n{finding.poc}\n```\n\n")

                f.write(f"#### 4. Evidence Breakdown & Scope Verification\n")
                f.write(f"- **Empirically Proven:** {finding.what_was_proven or 'Technical signal observed directly in HTTP exchange.'}\n")
                f.write(f"- **Not Proven / Unverified:** {finding.what_was_not_proven or 'Destructive exploit payload delivery.'}\n")
                f.write(f"- **In Scope:** `{'Yes' if finding.in_scope else 'No'}`\n")
                f.write(f"- **False Positive Evaluation:** {finding.false_positive_analysis or 'N/A'}\n\n")

                f.write(f"#### 5. Impact & Mitigation\n")
                f.write(f"- **Impact Assessment:** {finding.impact}\n")
                f.write(f"- **Remediation Recommendation:** {finding.remediation}\n\n")
                f.write("---\n\n")

    def export_hackerone(self, file_path: str) -> None:
        """Generates Bug Bounty report optimized for HackerOne."""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# Security Advisory Report — {self.result.target}\n\n")
            f.write(f"**Program Context:** {self.result.platform or 'HackerOne'}\n\n")
            f.write(f"## Summary\n")
            f.write(
                f"Automated evidence-first passive triage was conducted on `{self.result.target}` using "
                f"**CWE-Cover 2.0** by Carol Lamas (CyberHuntLab). A total of {len(self.result.findings)} observation(s) were analyzed.\n\n"
            )

            f.write(f"## Steps To Reproduce\n")
            for idx, item in enumerate(self.result.findings[:5], 1):
                f.write(f"{idx}. Inspect the endpoint `{item.url}`.\n")
                f.write(f"   - **Observed Behavior:** {item.observed_behavior}\n")
                f.write(f"   - **Taxonomy:** {item.cwe_id} ({item.title})\n")
                f.write(f"   - **Status:** `{item.status.value if hasattr(item.status, 'value') else item.status}`\n")
                if item.poc_command:
                    f.write(f"   - **Reproduction:** `{item.poc_command}`\n")
                f.write("\n")

            f.write(f"## Impact Analysis\n")
            f.write(
                "Suboptimal defense-in-depth headers or informational exposure expand adversary reconnaissance vectors. "
                "No destructive payloads were delivered during this assessment.\n\n"
            )

            f.write(f"## Remediation Guidance\n")
            f.write("Align web responses with OWASP Top 10 and MITRE CWE mitigation recommendations.\n")

