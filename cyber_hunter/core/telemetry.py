# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Observability & Telemetry Subsystem
Registra métricas estruturadas, tempos de execução, taxa de requisições e audit trails.
"""

import time
from typing import Dict, Any, List


class TelemetryCollector:
    """Coletor estruturado de eventos, medições de latência e contadores."""

    def __init__(self):
        self.start_time = time.time()
        self.engine_timings: Dict[str, float] = {}
        self.request_counts: Dict[str, int] = {}
        self.counters: Dict[str, int] = {}
        self.active_timers: Dict[str, float] = {}
        self.error_log: List[Dict[str, Any]] = []
        self.audit_trail: List[Dict[str, Any]] = []

    def start_timer(self, name: str):
        self.active_timers[name] = time.time()

    def stop_timer(self, name: str) -> float:
        start = self.active_timers.pop(name, self.start_time)
        duration = round(time.time() - start, 4)
        self.engine_timings[name] = duration
        return duration

    def increment(self, counter_name: str, amount: int = 1):
        self.counters[counter_name] = self.counters.get(counter_name, 0) + amount

    def record_engine_execution(self, engine_name: str, duration_sec: float, items_processed: int = 0):
        self.engine_timings[engine_name] = round(duration_sec, 4)
        self.audit_trail.append({
            "timestamp": time.time(),
            "event": "ENGINE_COMPLETED",
            "engine": engine_name,
            "duration_sec": round(duration_sec, 4),
            "items_processed": items_processed
        })

    def record_request(self, method: str, status_code: int):
        key = f"{method.upper()}_{status_code}"
        self.request_counts[key] = self.request_counts.get(key, 0) + 1

    def record_error(self, component: str, message: str, details: Any = None):
        self.error_log.append({
            "timestamp": time.time(),
            "component": component,
            "message": message,
            "details": details
        })

    def get_summary(self) -> Dict[str, Any]:
        total_duration = round(time.time() - self.start_time, 2)
        total_requests = sum(self.request_counts.values())
        return {
            "total_duration_sec": total_duration,
            "total_requests": total_requests,
            "durations_sec": self.engine_timings,
            "engine_timings": self.engine_timings,
            "counters": self.counters,
            "request_distribution": self.request_counts,
            "error_count": len(self.error_log),
            "audit_trail_events": len(self.audit_trail)
        }
