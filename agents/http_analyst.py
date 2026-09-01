"""
HTTP Analyst Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Analyzes HTTP response headers, status codes, technology fingerprints, and TLS/security flags.
"""

from typing import Dict, Any, List, Optional
from .models import ScanContext, Evidence, AgentFinding, FindingStatus


class HTTPAnalystAgent:
    """Agent specialized in protocol analysis and security header evaluation."""

    REQUIRED_SECURITY_HEADERS = [
        "Strict-Transport-Security",
        "Content-Security-Policy",
        "X-Frame-Options",
        "X-Content-Type-Options",
    ]

    INFORMATIONAL_BANNERS = [
        "Server",
        "X-Powered-By",
        "X-AspNet-Version",
        "X-Generator",
        "Via",
    ]

    def __init__(self, context: ScanContext):
        self.context = context

    def analyze_headers(self, url: str, headers: Dict[str, str], status_code: int = 200) -> List[Dict[str, Any]]:
        """
        Inspects headers strictly based on direct facts.
        Does NOT promote generic Server headers into confirmed high-severity leaks.
        """
        observations = []

        # 1. Missing Security Headers
        missing = [h for h in self.REQUIRED_SECURITY_HEADERS if h not in headers]
        if missing:
            observations.append({
                "type": "MISSING_HEADERS",
                "cwe_id": "CWE-693",
                "missing": missing,
                "url": url,
                "evidence_raw": f"Missing headers: {', '.join(missing)}",
                "status_code": status_code
            })

        # 2. Technology Banner Fingerprints
        exposed_banners = {}
        for b in self.INFORMATIONAL_BANNERS:
            if b in headers:
                exposed_banners[b] = headers[b]

        if exposed_banners:
            observations.append({
                "type": "BANNER_FINGERPRINT",
                "cwe_id": "CWE-200",
                "exposed": exposed_banners,
                "url": url,
                "evidence_raw": "; ".join([f"{k}: {v}" for k, v in exposed_banners.items()]),
                "status_code": status_code
            })

        return observations
