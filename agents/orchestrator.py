"""
Orchestrator Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Coordinates multi-agent workflow, reconciles cross-phase findings, checks consistency, and generates PipelineResult.
"""

from typing import List, Dict, Any, Optional
from .models import (
    ScanContext,
    ScopeConfig,
    AgentFinding,
    Evidence,
    FindingStatus,
    PipelineResult,
)
from .recon import ReconAgent
from .http_analyst import HTTPAnalystAgent
from .mapping import MappingAgent
from .validation import ValidationAgent
from .false_positive import FalsePositiveAgent
from .impact import ImpactAgent


class OrchestratorAgent:
    """Master orchestrator executing the full multi-agent evidence-first pipeline."""

    def __init__(self, context: ScanContext):
        self.context = context
        self.recon = ReconAgent(context)
        self.http_analyst = HTTPAnalystAgent(context)
        self.mapping = MappingAgent()
        self.validation = ValidationAgent(context.scope)
        self.false_positive = FalsePositiveAgent()
        self.impact = ImpactAgent()

    def run_pipeline(self, raw_findings: List[Dict[str, Any]]) -> PipelineResult:
        """Executes the sequential Evidence-First triage pipeline."""
        processed_findings: List[AgentFinding] = []

        # 1. First Pass: Detect contradictions across findings (e.g. conflicting Server headers)
        server_headers = set()
        for rf in raw_findings:
            if "server:" in rf.get("evidence", "").lower():
                server_headers.add(rf.get("evidence", "").lower())

        is_contradictory_server = len(server_headers) > 1

        # 2. Process each raw observation
        for raw in raw_findings:
            cwe_id = raw.get("cwe_id", "CWE-693")
            meta = self.mapping.get_cwe_details(cwe_id)

            # Build initial Evidence object
            evidence = Evidence(
                source="cwe_discover_engine",
                description=meta.get("description", "Observed pattern"),
                raw=raw.get("evidence", ""),
                url=raw.get("url", self.context.target_url),
                method="GET",
                status_code=200,
                origin="passive_crawler"
            )

            # Contradictory evidence list
            contradictions = []
            if is_contradictory_server and cwe_id == "CWE-200" and "server:" in raw.get("evidence", "").lower():
                contradictions.extend(list(server_headers))

            finding = AgentFinding(
                cwe_id=cwe_id,
                title=meta.get("title", raw.get("title", "Security Anomaly")),
                severity=meta.get("base_severity", raw.get("severity", "LOW")),
                risk_score=raw.get("risk_score", 3.0),
                confidence=raw.get("confidence", 0.70),
                status=FindingStatus.HYPOTHESIS,
                url=raw.get("url", self.context.target_url),
                evidences=[evidence],
                contradictory_evidence=contradictions,
                observed_behavior=raw.get("evidence", ""),
                reproducible=True,
                in_scope=self.context.scope.is_in_scope(raw.get("url", self.context.target_url)),
                references=meta.get("references", []),
                poc="PoC: Not available — insufficient evidence for safe active reproduction."
            )

            # Validation Gate
            finding = self.validation.validate_finding(finding)

            # False Positive Gate
            finding = self.false_positive.analyze_false_positive(finding)

            # Impact Calculation
            finding = self.impact.calculate_impact(finding)

            processed_findings.append(finding)

        # Sort by risk score descending
        processed_findings.sort(key=lambda x: x.risk_score, reverse=True)

        # Aggregate summary statistics
        summary = {}
        for f in processed_findings:
            st = f.status.value if isinstance(f.status, FindingStatus) else str(f.status)
            summary[st] = summary.get(st, 0) + 1

        return PipelineResult(
            target=self.context.target_url,
            platform=self.context.platform,
            mode=self.context.scope.mode.value if hasattr(self.context.scope.mode, "value") else str(self.context.scope.mode),
            total_urls=len(self.context.visited_urls),
            findings=processed_findings,
            summary_by_status=summary
        )
