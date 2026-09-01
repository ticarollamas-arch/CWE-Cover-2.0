"""
Data Models for CWE-Cover 2.0 • Evidence-First Architecture
Author: Carol Lamas (CyberHuntLab)
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import time


class FindingStatus(str, Enum):
    OBSERVATION = "OBSERVATION"
    HYPOTHESIS = "HYPOTHESIS"
    POTENTIAL = "POTENTIAL"
    CONFIRMED = "CONFIRMED"
    INCONCLUSIVE = "INCONCLUSIVE"
    FALSE_POSITIVE = "FALSE_POSITIVE"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    UNCERTAIN = "UNCERTAIN"


class ScopeMode(str, Enum):
    PASSIVE = "PASSIVE"
    SAFE = "SAFE"
    AUTHORIZED_ACTIVE = "AUTHORIZED_ACTIVE"
    LAB = "LAB"


@dataclass
class Evidence:
    source: str
    description: str
    raw: str
    timestamp: str = field(default_factory=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))
    url: str = ""
    method: str = "GET"
    status_code: Optional[int] = None
    origin: str = "passive_crawler"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source,
            "description": self.description,
            "raw": self.raw,
            "timestamp": self.timestamp,
            "url": self.url,
            "method": self.method,
            "status_code": self.status_code,
            "origin": self.origin,
        }


@dataclass
class ScopeConfig:
    target: str
    allowed_domains: List[str] = field(default_factory=list)
    authorization: bool = False
    allowed_methods: List[str] = field(default_factory=lambda: ["GET"])
    rate_limit_per_sec: float = 1.0
    exclusions: List[str] = field(default_factory=list)
    platform: Optional[str] = None
    program: Optional[str] = None
    mode: ScopeMode = ScopeMode.PASSIVE
    scope_unknown: bool = False

    def is_in_scope(self, url: str) -> bool:
        if not self.allowed_domains:
            return True
        from urllib.parse import urlparse
        netloc = urlparse(url).netloc.lower()
        for domain in self.allowed_domains:
            d = domain.lower().lstrip(".")
            if netloc == d or netloc.endswith("." + d):
                return True
        return False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "target": self.target,
            "allowed_domains": self.allowed_domains,
            "authorization": self.authorization,
            "allowed_methods": self.allowed_methods,
            "rate_limit_per_sec": self.rate_limit_per_sec,
            "exclusions": self.exclusions,
            "platform": self.platform,
            "program": self.program,
            "mode": self.mode.value if isinstance(self.mode, ScopeMode) else str(self.mode),
            "scope_unknown": self.scope_unknown,
        }


@dataclass
class AgentFinding:
    cwe_id: str
    title: str
    severity: str  # "HIGH", "MEDIUM", "LOW", "INFO"
    risk_score: float
    confidence: float
    status: FindingStatus = FindingStatus.HYPOTHESIS
    url: str = ""
    evidences: List[Evidence] = field(default_factory=list)
    contradictory_evidence: List[str] = field(default_factory=list)
    observed_behavior: str = ""
    reproducible: bool = True
    in_scope: bool = True
    false_positive_analysis: str = ""
    impact: str = ""
    remediation: str = ""
    confirmed: bool = False
    references: List[str] = field(default_factory=list)
    poc: str = "PoC: Not available — insufficient evidence for safe active reproduction."
    parameter: Optional[str] = None
    triggered_rule: str = ""
    detection_reason: str = ""
    what_was_proven: str = ""
    what_was_not_proven: str = ""
    poc_command: str = ""
    screenshots: List[str] = field(default_factory=list)
    headers_snapshot: Dict[str, str] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self) -> Dict[str, Any]:
        status_val = self.status.value if isinstance(self.status, FindingStatus) else str(self.status)
        return {
            "cwe": self.cwe_id,
            "cwe_id": self.cwe_id,
            "title": self.title,
            "severity": self.severity,
            "risk_score": self.risk_score,
            "confidence": self.confidence,
            "status": status_val,
            "url": self.url,
            "parameter": self.parameter,
            "triggered_rule": self.triggered_rule or self.cwe_id,
            "detection_reason": self.detection_reason or self.observed_behavior,
            "evidence": [e.to_dict() for e in self.evidences] if self.evidences else [{"raw": self.observed_behavior}],
            "evidences": [e.to_dict() for e in self.evidences],
            "contradictory_evidence": self.contradictory_evidence,
            "observed_behavior": self.observed_behavior,
            "reproducible": self.reproducible,
            "in_scope": self.in_scope,
            "false_positive_analysis": self.false_positive_analysis,
            "validation": {
                "status": status_val,
                "confidence": round(self.confidence, 2),
                "explanation": self.false_positive_analysis or self.observed_behavior,
                "what_was_proven": self.what_was_proven,
                "what_was_not_proven": self.what_was_not_proven,
            },
            "impact": self.impact,
            "remediation": self.remediation,
            "confirmed": self.confirmed,
            "references": self.references,
            "poc": self.poc,
            "poc_command": self.poc_command,
            "screenshots": self.screenshots,
            "headers_snapshot": self.headers_snapshot,
            "timestamp": self.timestamp,
        }


@dataclass
class ScanContext:
    target_url: str
    domain: str
    scope: ScopeConfig
    platform: Optional[str] = None
    visited_urls: List[str] = field(default_factory=list)
    headers_seen: Dict[str, Dict[str, str]] = field(default_factory=dict)
    raw_findings: List[Dict[str, Any]] = field(default_factory=list)
    start_time: str = field(default_factory=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))


@dataclass
class PipelineResult:
    target: str
    platform: Optional[str]
    mode: str
    total_urls: int
    findings: List[AgentFinding]
    summary_by_status: Dict[str, int] = field(default_factory=dict)
    generated_at: str = field(default_factory=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "target": self.target,
            "platform": self.platform,
            "mode": self.mode,
            "total_urls": self.total_urls,
            "generated_at": self.generated_at,
            "summary_by_status": self.summary_by_status,
            "findings": [f.to_dict() for f in self.findings],
        }
