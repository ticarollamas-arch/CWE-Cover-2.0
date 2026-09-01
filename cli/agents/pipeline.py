"""
Agent Pipeline Coordinator • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)
"""

from typing import List, Dict, Any, Optional
from .models import ScanContext, ScopeConfig, PipelineResult
from .orchestrator import OrchestratorAgent
from .report_agent import ReportAgent


class AgentPipeline:
    """Entry point for executing the multi-agent pipeline from CLI or external frameworks."""

    def __init__(self, target_url: str, scope: ScopeConfig, platform: Optional[str] = None):
        self.context = ScanContext(
            target_url=target_url,
            domain=target_url.split("//")[-1].split("/")[0],
            scope=scope,
            platform=platform
        )
        self.orchestrator = OrchestratorAgent(self.context)

    def process(self, raw_findings: List[Dict[str, Any]], visited_urls: Optional[List[str]] = None) -> PipelineResult:
        if visited_urls:
            self.context.visited_urls = visited_urls
        return self.orchestrator.run_pipeline(raw_findings)

    def generate_report(self, result: PipelineResult, output_path: str, format_type: str = "json") -> None:
        reporter = ReportAgent(result)
        if format_type == "json":
            reporter.export_json(output_path)
        elif format_type == "hackerone":
            reporter.export_hackerone(output_path)
        else:
            reporter.export_markdown(output_path)
