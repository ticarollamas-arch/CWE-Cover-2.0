# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Unified Data Models
Modelos de dados compartilhados entre todos os 12 Engines.

O sistema inteiro compartilha contexto:
Asset -> Observation -> Evidence -> Request -> Response -> Finding -> Confidence -> Severity -> Campaign
"""

import time
import uuid
from enum import Enum
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, field, asdict


class AssetType(str, Enum):
    DOMAIN = "DOMAIN"
    SUBDOMAIN = "SUBDOMAIN"
    IP = "IP"
    PORT = "PORT"
    SERVICE = "SERVICE"
    URL = "URL"
    ENDPOINT = "ENDPOINT"
    API_ROUTE = "API_ROUTE"
    PARAMETER = "PARAMETER"
    SECRET_CANDIDATE = "SECRET_CANDIDATE"


class SeverityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class ObservationType(str, Enum):
    DNS_RECORD = "DNS_RECORD"
    OPEN_PORT = "OPEN_PORT"
    SERVICE_BANNER = "SERVICE_BANNER"
    TLS_ANOMALY = "TLS_ANOMALY"
    MISSING_HEADER = "MISSING_HEADER"
    DISCLOSED_ENDPOINT = "DISCLOSED_ENDPOINT"
    TECHNOLOGY_DETECTED = "TECHNOLOGY_DETECTED"
    RULE_MATCH = "RULE_MATCH"
    SECRET_EXPOSURE = "SECRET_EXPOSURE"
    DIFFERENTIAL_ANOMALY = "DIFFERENTIAL_ANOMALY"


@dataclass
class RequestRecord:
    method: str
    url: str
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[str] = None
    timestamp: float = field(default_factory=time.time)

    def to_curl(self) -> str:
        headers_str = " ".join([f"-H '{k}: {v}'" for k, v in self.headers.items()])
        data_str = f" --data '{self.body}'" if self.body else ""
        return f"curl -s -i -X {self.method} '{self.url}' {headers_str}{data_str}".strip()


@dataclass
class ResponseRecord:
    status_code: int
    headers: Dict[str, str] = field(default_factory=dict)
    body_snippet: str = ""
    content_length: int = 0
    response_time_ms: float = 0.0
    timestamp: float = field(default_factory=time.time)


@dataclass
class EvidenceItem:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    description: str = ""
    request: Optional[RequestRecord] = None
    response: Optional[ResponseRecord] = None
    diff_proof: Optional[str] = None
    timestamp: float = field(default_factory=time.time)


@dataclass
class ChainOfEvidence:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    items: List[EvidenceItem] = field(default_factory=list)
    curl_reproduction: str = ""
    sanitized: bool = True

    def add(self, item: EvidenceItem):
        self.items.append(item)
        if item.request and not self.curl_reproduction:
            self.curl_reproduction = item.request.to_curl()


@dataclass
class Asset:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    asset_type: AssetType = AssetType.DOMAIN
    value: str = ""
    parent_asset_id: Optional[str] = None
    attributes: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)


@dataclass
class Observation:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    asset_id: str = ""
    source_engine: str = ""
    obs_type: ObservationType = ObservationType.RULE_MATCH
    data: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 1.0  # 0.0 to 1.0
    timestamp: float = field(default_factory=time.time)


@dataclass
class Finding:
    id: str = field(default_factory=lambda: f"CHF-{uuid.uuid4().hex[:6].upper()}")
    title: str = ""
    severity: SeverityLevel = SeverityLevel.MEDIUM
    confidence: float = 0.95  # 0.0 - 1.0
    cwe_id: str = "CWE-693"
    owasp_id: str = "A05:2021-Security Misconfiguration"
    vrt_id: str = "server_security_misconfiguration"
    target: str = ""
    description: str = ""
    impact: str = ""
    mitigation: str = ""
    cvss_score: float = 5.0
    cvss_vector: str = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N"
    risk_score: float = 4.75  # severity_score * confidence
    chain_of_evidence: Optional[ChainOfEvidence] = None
    validated: bool = True
    false_positive_risk: str = "Extremamente Baixo (Verificado via Differential Engine)"
    tags: List[str] = field(default_factory=list)
    timestamp: float = field(default_factory=time.time)


@dataclass
class Campaign:
    id: str = field(default_factory=lambda: f"CAMP-{uuid.uuid4().hex[:6].upper()}")
    name: str = "Default Cyber Hunter Campaign"
    target_root: str = ""
    scope_policy: str = "STRICT_PASSIVE"
    has_authorization: bool = False
    started_at: float = field(default_factory=time.time)
    ended_at: Optional[float] = None
    assets: Dict[str, Asset] = field(default_factory=dict)
    observations: List[Observation] = field(default_factory=list)
    findings: List[Finding] = field(default_factory=list)
    telemetry: Dict[str, Any] = field(default_factory=dict)

    def add_asset(self, asset: Asset) -> str:
        self.assets[asset.id] = asset
        return asset.id

    def add_observation(self, obs: Observation):
        self.observations.append(obs)

    def add_finding(self, finding: Finding):
        self.findings.append(finding)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "target_root": self.target_root,
            "scope_policy": self.scope_policy,
            "has_authorization": self.has_authorization,
            "started_at": self.started_at,
            "ended_at": self.ended_at,
            "asset_count": len(self.assets),
            "observation_count": len(self.observations),
            "finding_count": len(self.findings),
            "findings": [asdict(f) for f in self.findings],
            "telemetry": self.telemetry,
        }
