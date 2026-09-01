#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
agents/report_agent.py — AGENT 9: REPORT AGENT

Responsibility (master prompt §5, §17):
    Produce a professional report with the mandated fields, clearly
    separating FACT / HYPOTHESIS / EVIDENCE / CONCLUSION, and never
    overstating impact (e.g. never "Critical RCE confirmed" without
    proof — see master prompt §17 example).
"""

from __future__ import annotations

import json
import time
from typing import Any, Dict, List

from .models import AgentFinding, Status

_STATUS_LABEL_PT = {
    Status.INFO: "INFO",
    Status.OBSERVATION: "OBSERVAÇÃO",
    Status.HYPOTHESIS: "HIPÓTESE",
    Status.POTENTIAL: "POTENCIAL",
    Status.CONFIRMED: "CONFIRMADO",
    Status.NOT_CONFIRMED: "NÃO CONFIRMADO",
    Status.FALSE_POSITIVE: "FALSO POSITIVO",
    Status.INSUFFICIENT_EVIDENCE: "EVIDÊNCIA INSUFICIENTE",
    Status.UNCERTAIN: "INCERTO",
}


def _severity_for(finding: AgentFinding) -> str:
    """Severity is only meaningful once a finding is CONFIRMED or POTENTIAL;
    otherwise we refuse to imply a severity that hasn't been earned."""
    if finding.status in (Status.CONFIRMED, Status.POTENTIAL):
        return "A avaliar conforme CWE_DATABASE (ver relatório legado) — apenas para achados CONFIRMED/POTENTIAL."
    return "N/A (não confirmado)"


def to_json(findings: List[AgentFinding], meta: Dict[str, Any], pipeline_log: List[str]) -> str:
    payload = {
        "meta": meta,
        "pipeline_log": pipeline_log,
        "principle": "Evidência primeiro. Classificação depois. Conclusão por último.",
        "findings": [f.to_dict() for f in findings],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False)


def _zero_findings_markdown(meta: Dict[str, Any], pipeline_log: List[str]) -> str:
    """Fixed-format report for the 0-findings case (master prompt, REGRA PARA ZERO ACHADOS).

    No hypothetical CWE, no invented severity — only the real audited-URL
    count and the mandatory disclaimer.
    """
    urls_audited = meta.get("surface", {}).get("urls_audited", 0)
    lines: List[str] = []
    lines.append("# Security Assessment Report\n")
    lines.append("## Target\n")
    lines.append(f"`{meta.get('target', '')}`\n")
    lines.append("## Result\n")
    lines.append("Nenhuma vulnerabilidade foi identificada pelo `cwe-discover` nesta execução.\n")
    lines.append("## Scan Summary\n")
    lines.append(f"- URLs auditadas: {urls_audited}")
    lines.append("- Achados: 0")
    lines.append("- High: 0")
    lines.append("- Critical: 0\n")
    lines.append("## Important Note\n")
    lines.append(
        "A ausência de achados nesta execução não significa que o alvo esteja livre de "
        "vulnerabilidades. Significa apenas que nenhuma vulnerabilidade compatível com os "
        "testes executados foi identificada.\n"
    )
    lines.append("## Pipeline de Agentes\n")
    for entry in pipeline_log:
        lines.append(f"- {entry}")
    return "\n".join(lines)


def to_markdown(findings: List[AgentFinding], meta: Dict[str, Any], pipeline_log: List[str]) -> str:
    if not findings:
        return _zero_findings_markdown(meta, pipeline_log)

    lines: List[str] = []
    lines.append(f"# Relatório de Análise Multiagente — {meta.get('domain', '')}\n")
    lines.append(f"- **Alvo:** `{meta.get('target', '')}`")
    lines.append(f"- **Modo de Operação:** `{meta.get('mode', '')}`")
    lines.append(f"- **Escopo:** `{'DESCONHECIDO (SCOPE_UNKNOWN)' if meta.get('scope_unknown') else 'Definido'}`")
    lines.append(f"- **Data:** `{time.strftime('%Y-%m-%d %H:%M:%S')}`")
    lines.append(f"- **Total de hipóteses analisadas:** `{len(findings)}`\n")
    lines.append("> Princípio: **Evidência primeiro. Classificação depois. Conclusão por último.**\n")
    lines.append("---\n")

    lines.append("## Pipeline de Agentes\n")
    for entry in pipeline_log:
        lines.append(f"- {entry}")
    lines.append("")

    confirmed = [f for f in findings if f.status == Status.CONFIRMED]
    others = [f for f in findings if f.status != Status.CONFIRMED]

    lines.append(f"## Achados Confirmados ({len(confirmed)})\n")
    if not confirmed:
        lines.append("_Nenhum achado sobreviveu à validação e à checagem de falso positivo como CONFIRMADO._\n")
    for idx, f in enumerate(confirmed, 1):
        lines.extend(_render_finding(idx, f))

    lines.append(f"\n## Hipóteses / Achados Não Confirmados ({len(others)})\n")
    lines.append("_Estes itens exigem validação manual adicional antes de qualquer submissão. "
                  "Não representam vulnerabilidades confirmadas._\n")
    for idx, f in enumerate(others, 1):
        lines.extend(_render_finding(idx, f))

    return "\n".join(lines)


def _render_finding(idx: int, f: AgentFinding) -> List[str]:
    lines = []
    status_label = _STATUS_LABEL_PT.get(f.status, f.status.value)
    lines.append(f"### {idx}. [{status_label}] {f.cwe_id} — {f.title}")
    lines.append(f"- **Severity:** {_severity_for(f)}")
    lines.append(f"- **CWE:** {f.cwe_id}")
    lines.append(f"- **OWASP Category:** {f.owasp_category or 'Não mapeado'}")
    lines.append(f"- **Affected Asset:** `{f.url}`")
    lines.append(f"- **Affected Endpoint:** `{f.url}`")
    lines.append(f"- **Confidence:** {int(f.confidence * 100)}%")
    lines.append(f"- **Confirmed:** `{f.confirmed}`")
    lines.append(f"- **In Scope:** `{f.in_scope}`")
    lines.append(f"- **Reproducible:** `{f.reproducible}`")
    lines.append("")
    lines.append("**FACT (observed behavior):**")
    lines.append(f"> {f.observed_behavior or 'Não especificado.'}")
    lines.append("")
    lines.append("**EVIDENCE:**")
    if f.evidence:
        for e in f.evidence:
            raw = f" (`{e.raw}`)" if e.raw else ""
            lines.append(f"- [{e.source}] {e.description}{raw}")
    else:
        lines.append("- Nenhuma evidência registrada.")
    lines.append("")
    lines.append("**HYPOTHESIS / Technical Explanation:**")
    lines.append(f"> {f.technical_explanation or 'N/A'}")
    lines.append("")
    lines.append(f"**Reproduction Information:** {f.reproduction_info or 'N/A'}")
    lines.append(f"**False Positive Analysis:** {f.false_positive_analysis or 'N/A'}")
    lines.append(f"**Impact:** {f.impact}")
    lines.append(f"**Remediation:** {f.remediation or 'N/A'}")
    if f.learning_notes:
        lines.append("")
        lines.append("**Learning Notes (aprendizagem, não certeza):**")
        for k, v in f.learning_notes.items():
            lines.append(f"- *{k}*: {v}")
    lines.append("")
    lines.append("**CONCLUSION:**")
    if f.status == Status.CONFIRMED:
        lines.append("> Fato observado confirmado por evidência reproduzível dentro do escopo. "
                      "Isto NÃO implica automaticamente exploração completa ou impacto de negócio demonstrado.")
    else:
        lines.append(f"> Não foi possível confirmar. Status atual: {status_label}.")
    if f.references:
        lines.append("")
        lines.append(f"**References:** " + ", ".join(f.references))
    lines.append("\n---\n")
    return lines
