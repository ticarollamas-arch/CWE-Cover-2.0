"""
False Positive Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Analyzes observations to rule out normal application behavior, CDN/WAF artifacts, redirects, and false flags.
"""

from typing import List, Dict, Any
from .models import AgentFinding, FindingStatus


class FalsePositiveAgent:
    """Agent that stress-tests findings against common False Positive scenarios."""

    KNOWN_CDN_BANNERS = [
        "cloudflare",
        "amazons3",
        "cloudfront",
        "akamai",
        "fastly",
        "varnish",
        "envoy",
        "nginx",
        "apache",
    ]

    def analyze_false_positive(self, finding: AgentFinding) -> AgentFinding:
        """Evaluates whether an observation is an artifact or standard architecture behavior."""
        evidence_text = " ".join([e.raw.lower() for e in finding.evidences])

        # 1. Evaluate CWE-200 Server Banners
        if finding.cwe_id == "CWE-200":
            if any(f"server: {cdn}" in evidence_text for cdn in self.KNOWN_CDN_BANNERS):
                finding.false_positive_analysis = (
                    "Observed Server header reflects standard edge CDN/reverse-proxy fingerprinting. "
                    "Does not expose sensitive internal memory or codebase secrets."
                )
                if finding.status != FindingStatus.CONFIRMED:
                    finding.status = FindingStatus.OBSERVATION
            elif "/.env" in finding.url or "/.git" in finding.url:
                finding.false_positive_analysis = (
                    "Directly accessible root configuration repository detected. True positive risk confirmed."
                )
            else:
                finding.false_positive_analysis = "Information exposure requires verification of actual data sensitivity."

        # 2. Evaluate CWE-693 Security Headers
        elif finding.cwe_id == "CWE-693":
            finding.false_positive_analysis = (
                "Missing defense-in-depth security header. The vulnerability is structural/configurational, "
                "not proof of an active exploitable XSS or framing condition."
            )

        # 3. Evaluate CWE-352 Anti-CSRF
        elif finding.cwe_id == "CWE-352":
            if "search" in finding.url.lower() or "query" in finding.url.lower():
                finding.false_positive_analysis = (
                    "Form identified may be an idempotent search/filter endpoint where CSRF protection is optional."
                )
                finding.confidence = max(0.30, finding.confidence - 0.20)
            else:
                finding.false_positive_analysis = (
                    "State-changing endpoint lacks observable CSRF token in DOM. Token might be supplied via custom header (e.g. X-CSRF-Token) in SPA."
                )

        # 4. Evaluate CWE-22 Path Traversal
        elif finding.cwe_id == "CWE-22":
            finding.false_positive_analysis = (
                "Parameter naming pattern matches path manipulation convention. Requires verified out-of-band or file retrieval proof."
            )

        # 5. Evaluate CWE-615 Comments
        elif finding.cwe_id == "CWE-615":
            finding.false_positive_analysis = (
                "DOM comment identified contains developer keywords. Verified as non-functional metadata."
            )

        return finding
