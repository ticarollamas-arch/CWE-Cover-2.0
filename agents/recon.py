"""
Recon Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Performs passive reconnaissance, extracts links and forms, and registers initial target context.
"""

from typing import List, Dict, Any
from urllib.parse import urlparse, urljoin
from .models import ScanContext, Evidence, AgentFinding, FindingStatus


class ReconAgent:
    """Agent responsible for passive attack surface discovery and URL queue management."""

    def __init__(self, context: ScanContext):
        self.context = context

    def process_url_discovery(self, raw_urls: List[str]) -> List[str]:
        """Filters and validates in-scope URLs without aggressive requests."""
        valid_urls = []
        for u in raw_urls:
            parsed = urlparse(u)
            clean_url = parsed._replace(fragment="").geturl()
            if self.context.scope.is_in_scope(clean_url):
                valid_urls.append(clean_url)
        return valid_urls

    def extract_evidence(self, url: str, source: str, description: str, raw_snippet: str) -> Evidence:
        """Constructs a traceable Evidence object."""
        return Evidence(
            source=source,
            description=description,
            raw=raw_snippet,
            url=url,
            method="GET",
            status_code=200,
            origin="recon_agent"
        )
