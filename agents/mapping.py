"""
CWE & OWASP Mapping Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Deterministically maps observations and technical signals into MITRE CWE and OWASP Top 10 classifications.
"""

from typing import Dict, Any, Optional

CWE_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "CWE-693": {
        "title": "Protection Mechanism Failure (Missing Security Headers)",
        "category": "Architecture and Design",
        "owasp": "A05:2021 - Security Misconfiguration",
        "base_severity": "MEDIUM",
        "base_weight": 5.0,
        "description": "The application does not enforce browser-level security policies (HSTS, CSP, X-Frame-Options).",
        "impact": "Increases susceptibility to framing, MIME-sniffing, and injection attacks in vulnerable contexts.",
        "remediation": "Configure HSTS with preload, Content-Security-Policy, X-Frame-Options: DENY/SAMEORIGIN, and X-Content-Type-Options: nosniff.",
        "references": [
            "https://cwe.mitre.org/data/definitions/693.html",
            "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/"
        ]
    },
    "CWE-200": {
        "title": "Exposure of Sensitive Information to an Unauthorized Actor",
        "category": "Information Exposure",
        "owasp": "A01:2021 - Broken Access Control",
        "base_severity": "LOW",
        "base_weight": 3.0,
        "description": "The application exposes sensitive metadata, internal paths, credential keys, or specific component versions.",
        "impact": "Facilitates targeted reconnaissance and attack crafting against exact software versions.",
        "remediation": "Strip informational headers (Server, X-Powered-By) and restrict access to configuration (.env, .git) files.",
        "references": [
            "https://cwe.mitre.org/data/definitions/200.html",
            "https://owasp.org/Top10/A01_2021-Broken_Access_Control/"
        ]
    },
    "CWE-22": {
        "title": "Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')",
        "category": "Input Validation",
        "owasp": "A01:2021 - Broken Access Control",
        "base_severity": "HIGH",
        "base_weight": 7.5,
        "description": "URL parameters accept relative pathname patterns (file=, path=, doc=) that could lead to unauthorized file reads.",
        "impact": "Potential arbitrary file read if input is unsanitized and passed directly to filesystem APIs.",
        "remediation": "Use an explicit whitelist of allowed files and avoid passing client-controlled parameters to filesystem functions.",
        "references": [
            "https://cwe.mitre.org/data/definitions/22.html",
            "https://owasp.org/Top10/A01_2021-Broken_Access_Control/"
        ]
    },
    "CWE-352": {
        "title": "Cross-Site Request Forgery (CSRF)",
        "category": "Authentication and Access Control",
        "owasp": "A01:2021 - Broken Access Control",
        "base_severity": "MEDIUM",
        "base_weight": 6.0,
        "description": "State-changing POST forms lack observable anti-CSRF challenge tokens or SameSite cookie protections.",
        "impact": "Attackers may trick authenticated users into executing unwanted actions via cross-origin requests.",
        "remediation": "Implement cryptographically strong, synchronizer anti-CSRF tokens and SameSite=Lax/Strict cookie attributes.",
        "references": [
            "https://cwe.mitre.org/data/definitions/352.html",
            "https://owasp.org/Top10/A01_2021-Broken_Access_Control/"
        ]
    },
    "CWE-615": {
        "title": "Inclusion of Sensitive Information in Source Code Comments",
        "category": "Information Exposure",
        "owasp": "A05:2021 - Security Misconfiguration",
        "base_severity": "LOW",
        "base_weight": 2.5,
        "description": "HTML or script comments in the DOM contain development notes, route references, or internal comments.",
        "impact": "Assists adversary reconnaissance by detailing internal mechanics, undocumented endpoints, or logic notes.",
        "remediation": "Strip all development and debug comments from frontend build pipelines before deployment.",
        "references": [
            "https://cwe.mitre.org/data/definitions/615.html"
        ]
    }
}


class MappingAgent:
    """Maps observations to MITRE CWE and OWASP taxonomy."""

    def __init__(self):
        self.taxonomy = CWE_TAXONOMY

    def get_cwe_details(self, cwe_id: str) -> Dict[str, Any]:
        return self.taxonomy.get(cwe_id, {
            "title": "Security Anomaly or Misconfiguration",
            "category": "General Security",
            "owasp": "A05:2021 - Security Misconfiguration",
            "base_severity": "LOW",
            "base_weight": 2.0,
            "description": "Potential security observation identified during passive analysis.",
            "impact": "Potential attack surface expansion.",
            "remediation": "Adhere to MITRE CWE security best practices.",
            "references": ["https://cwe.mitre.org"]
        })
