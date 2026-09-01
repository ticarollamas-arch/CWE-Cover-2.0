# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Event Bus & PubSub System
Canal de comunicação desacoplado e streaming de eventos entre motores e agentes.
"""

import time
from enum import Enum
from typing import Dict, List, Callable, Any
from dataclasses import dataclass, field


class EventType(str, Enum):
    CAMPAIGN_STARTED = "CAMPAIGN_STARTED"
    CAMPAIGN_COMPLETED = "CAMPAIGN_COMPLETED"
    CAMPAIGN_FAILED = "CAMPAIGN_FAILED"
    ASSET_DISCOVERED = "ASSET_DISCOVERED"
    OBSERVATION_RECORDED = "OBSERVATION_RECORDED"
    HYPOTHESIS_GENERATED = "HYPOTHESIS_GENERATED"
    FINDING_VALIDATED = "FINDING_VALIDATED"
    FINDING_REJECTED = "FINDING_REJECTED"
    EVIDENCE_ATTACHED = "EVIDENCE_ATTACHED"
    TELEMETRY_SAMPLE = "TELEMETRY_SAMPLE"
    ENGINE_STARTED = "ENGINE_STARTED"
    ENGINE_COMPLETED = "ENGINE_COMPLETED"


@dataclass
class Event:
    event_type: EventType
    source: str
    data: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


class EventBus:
    """Barramento de eventos com suporte a múltiplos ouvintes síncronos e callbacks."""

    def __init__(self):
        self._subscribers: Dict[EventType, List[Callable[[Event], None]]] = {
            t: [] for t in EventType
        }
        self._history: List[Event] = []

    def subscribe(self, event_type: EventType, handler: Callable[[Event], None]):
        """Registra um callback para um tipo específico de evento."""
        self._subscribers[event_type].append(handler)

    def subscribe_all(self, handler: Callable[[Event], None]):
        """Registra um callback para todos os eventos disparados."""
        for event_type in EventType:
            self._subscribers[event_type].append(handler)

    def publish(self, event: Event):
        """Publica um evento para todos os ouvintes registrados e guarda no histórico."""
        self._history.append(event)
        for handler in self._subscribers.get(event.event_type, []):
            try:
                handler(event)
            except Exception as e:
                # Isolamento de falha nos ouvintes para não quebrar a esteira
                pass

    def get_history(self, event_type: EventType = None) -> List[Event]:
        """Recupera o histórico completo ou filtrado por tipo."""
        if event_type:
            return [e for e in self._history if e.event_type == event_type]
        return list(self._history)

    def clear(self):
        """Limpa o histórico e reinicia o barramento."""
        self._history.clear()
