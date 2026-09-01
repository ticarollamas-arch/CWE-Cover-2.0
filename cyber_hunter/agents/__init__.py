# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Autonomous Specialized Agents System
18 Agentes com identidades, regras de decisão, esquemas de entrada/saída e modelos de confiança.
"""

from cyber_hunter.agents.base import BaseSecurityAgent
from cyber_hunter.agents.catalog import (
    OrchestratorAgent,
    ScopeAgent,
    AssetAgent,
    DNSAgent,
    NetworkAgent,
    HTTPAgent,
    CrawlerAgent,
    FingerprintAgent,
    DiscoveryAgent,
    DetectionAgent,
    ValidationAgent,
    FalsePositiveAgent,
    CorrelationAgent,
    CWEAgent,
    OWASPAgent,
    ImpactAgent,
    EvidenceAgent,
    ReportAgent,
    ALL_AGENTS
)

__all__ = [
    "BaseSecurityAgent",
    "OrchestratorAgent",
    "ScopeAgent",
    "AssetAgent",
    "DNSAgent",
    "NetworkAgent",
    "HTTPAgent",
    "CrawlerAgent",
    "FingerprintAgent",
    "DiscoveryAgent",
    "DetectionAgent",
    "ValidationAgent",
    "FalsePositiveAgent",
    "CorrelationAgent",
    "CWEAgent",
    "OWASPAgent",
    "ImpactAgent",
    "EvidenceAgent",
    "ReportAgent",
    "ALL_AGENTS"
]
