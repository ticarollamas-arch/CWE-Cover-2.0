# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Base Security Agent Interface
"""

import time
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field


@dataclass
class AgentAuditRecord:
    timestamp: float = field(default_factory=time.time)
    action: str = ""
    status: str = "SUCCESS"
    details: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 1.0


class BaseSecurityAgent:
    """Classe base para todos os 18 agentes especializados."""

    def __init__(
        self,
        agent_id: str,
        name: str,
        role: str,
        input_schema: Dict[str, Any],
        output_schema: Dict[str, Any],
        allowed_operations: List[str],
        engine_access: List[str],
        decision_rules: List[str],
        confidence_model: str
    ):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.allowed_operations = allowed_operations
        self.engine_access = engine_access
        self.decision_rules = decision_rules
        self.confidence_model = confidence_model
        self.audit_trail: List[AgentAuditRecord] = []

    def log_action(self, action: str, status: str = "SUCCESS", details: Optional[Dict[str, Any]] = None, confidence: float = 1.0):
        self.audit_trail.append(AgentAuditRecord(
            action=action,
            status=status,
            details=details or {},
            confidence=confidence
        ))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "role": self.role,
            "input_schema": self.input_schema,
            "output_schema": self.output_schema,
            "allowed_operations": self.allowed_operations,
            "engine_access": self.engine_access,
            "decision_rules": self.decision_rules,
            "confidence_model": self.confidence_model,
            "audit_records_count": len(self.audit_trail)
        }
