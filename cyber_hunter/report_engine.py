# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Report Engine
- Bugcrowd VRT & HackerOne Compliant Markdown Exporter
- SIEM / Elasticsearch Streaming JSONL Exporter
- Standalone HTML Executive Dashboard Exporter
- JSON Standard Object Exporter
"""

import json
import time
from dataclasses import asdict
from typing import Dict, Any, List
from cyber_hunter.core.models import Campaign, Finding


class NativeReportEngine:
    """Gerador de relatórios executivos e técnicos em múltiplos formatos."""

    @staticmethod
    def to_json(campaign: Campaign) -> str:
        return json.dumps(campaign.to_dict(), indent=2, ensure_ascii=False)

    @staticmethod
    def to_jsonl(campaign: Campaign) -> str:
        lines = []
        for finding in campaign.findings:
            lines.append(json.dumps(asdict(finding), ensure_ascii=False))
        return "\n".join(lines)

    @staticmethod
    def to_markdown(campaign: Campaign) -> str:
        lines = [
            f"# 🛡️ Relatório Executivo de Triagem • CYBER HUNTER ENGINE",
            f"**Alvo:** `{campaign.target_root}`  ",
            f"**Data da Campanha:** {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(campaign.started_at))}  ",
            f"**Política de Escopo:** `{campaign.scope_policy}`  ",
            f"**Autor:** Carol Lamas (CyberHuntLab) • https://cyberhuntlab.com.br/  ",
            "",
            "---",
            "",
            "## 📊 Sumário Executivo de Riscos",
            f"- **Total de Ativos Identificados:** {len(campaign.assets)}",
            f"- **Observações Coletadas:** {len(campaign.observations)}",
            f"- **Achados Validados (Vulnerabilidades):** {len(campaign.findings)}",
            "",
            "| ID | Severidade | Vulnerabilidade | CWE / VRT | CVSS v3.1 | Confiança |",
            "| :--- | :---: | :--- | :--- | :---: | :---: |"
        ]

        for f in campaign.findings:
            lines.append(f"| `{f.id}` | **{f.severity.value}** | {f.title} | `{f.cwe_id}` / `{f.vrt_id}` | `{f.cvss_score}` | {int(f.confidence*100)}% |")

        lines.extend([
            "",
            "---",
            "",
            "## 🔬 Detalhamento Técnico & Cadeia de Evidências",
            ""
        ])

        for f in campaign.findings:
            lines.extend([
                f"### [{f.severity.value}] {f.title} (`{f.id}`)",
                f"- **Alvo Afetado:** `{f.target}`",
                f"- **Classificação:** `{f.cwe_id}` | `{f.owasp_id}` | `{f.vrt_id}`",
                f"- **Vetor CVSS v3.1:** `{f.cvss_vector}` (Score: {f.cvss_score})",
                f"- **Índice de Risco Matemático:** `{f.risk_score}` / 10.0",
                "",
                "#### 📝 Descrição",
                f"{f.description}",
                "",
                "#### 💥 Impacto no Negócio",
                f"{f.impact}",
                "",
                "#### 🛠️ Recomendação de Mitigação",
                f"{f.mitigation}",
                ""
            ])

            if f.chain_of_evidence and f.chain_of_evidence.curl_reproduction:
                lines.extend([
                    "#### 🚀 Passo de Reprodução (cURL)",
                    "```bash",
                    f"{f.chain_of_evidence.curl_reproduction}",
                    "```",
                    ""
                ])

            lines.append("---\n")

        lines.append("\n*Relatório gerado de forma 100% autoral pela suíte Cyber Hunter Engine (CyberHuntLab).*")
        return "\n".join(lines)
