# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Task Scheduler & DAG Orchestration
Agendamento inteligente de tarefas com grafo direcionado acíclico (DAG) e rate limiter adaptativo.
"""

import time
import queue
import threading
from enum import Enum
from typing import Dict, List, Set, Callable, Any, Optional
from dataclasses import dataclass, field


class TaskStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


@dataclass
class Task:
    task_id: str
    name: str
    action: Callable[..., Any]
    args: tuple = field(default_factory=tuple)
    kwargs: dict = field(default_factory=dict)
    dependencies: Set[str] = field(default_factory=set)
    status: TaskStatus = TaskStatus.PENDING
    result: Any = None
    error: Optional[str] = None
    started_at: Optional[float] = None
    finished_at: Optional[float] = None


class RateLimiter:
    """Token Bucket rate limiter para controle seguro de taxa de pacotes/requisições."""

    def __init__(self, max_rate_rps: float = 10.0):
        self.max_rate = max(0.1, max_rate_rps)
        self.tokens = self.max_rate
        self.last_update = time.time()
        self._lock = threading.Lock()

    def acquire(self):
        """Bloqueia até que haja um token disponível de acordo com a taxa configurada."""
        with self._lock:
            now = time.time()
            elapsed = now - self.last_update
            self.tokens = min(self.max_rate, self.tokens + elapsed * self.max_rate)
            self.last_update = now

            if self.tokens < 1.0:
                needed = (1.0 - self.tokens) / self.max_rate
                time.sleep(needed)
                self.tokens = 0.0
                self.last_update = time.time()
            else:
                self.tokens -= 1.0


class DAGScheduler:
    """Agendador de tarefas em DAG (Directed Acyclic Graph) com resolução de dependências."""

    def __init__(self, max_concurrency: int = 4, rate_limiter: Optional[RateLimiter] = None):
        self.max_concurrency = max_concurrency
        self.rate_limiter = rate_limiter or RateLimiter(max_rate_rps=20.0)
        self.tasks: Dict[str, Task] = {}

    def add_task(
        self,
        task_id: str,
        name: str,
        action: Callable[..., Any],
        dependencies: Optional[List[str]] = None,
        *args,
        **kwargs
    ) -> str:
        deps = set(dependencies or [])
        self.tasks[task_id] = Task(
            task_id=task_id,
            name=name,
            action=action,
            args=args,
            kwargs=kwargs,
            dependencies=deps
        )
        return task_id

    def execute_all(self) -> Dict[str, Any]:
        """Executa todas as tarefas respeitando estritamente a ordem de dependências."""
        results: Dict[str, Any] = {}
        completed_ids: Set[str] = set()

        while len(completed_ids) < len(self.tasks):
            ready_tasks = [
                t for t in self.tasks.values()
                if t.status == TaskStatus.PENDING and t.dependencies.issubset(completed_ids)
            ]

            if not ready_tasks:
                # Se não há tarefas prontas mas faltam tarefas, pode haver ciclo ou falhas nas dependências
                unresolved = [t for t in self.tasks.values() if t.status == TaskStatus.PENDING]
                for t in unresolved:
                    t.status = TaskStatus.SKIPPED
                    t.error = "Dependência não resolvida ou falhou"
                    completed_ids.add(t.task_id)
                break

            for task in ready_tasks:
                self.rate_limiter.acquire()
                task.status = TaskStatus.RUNNING
                task.started_at = time.time()
                try:
                    res = task.action(*task.args, **task.kwargs)
                    task.result = res
                    task.status = TaskStatus.COMPLETED
                    results[task.task_id] = res
                except Exception as e:
                    task.error = str(e)
                    task.status = TaskStatus.FAILED
                    results[task.task_id] = None
                finally:
                    task.finished_at = time.time()
                    completed_ids.add(task.task_id)

        return results
