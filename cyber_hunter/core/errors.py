# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Core Error Hierarchy
Definição de exceções estruturadas para todos os subsistemas.
"""

class CyberHunterError(Exception):
    """Exceção base do Cyber Hunter Engine."""
    def __init__(self, message: str, code: str = "CHE_ERROR", details: dict = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}


class ScopeViolationError(CyberHunterError):
    """Lançada quando uma operação tenta violar a política de escopo autorizado."""
    def __init__(self, target: str, reason: str):
        super().__init__(
            f"Alvo '{target}' fora do escopo autorizado: {reason}",
            code="SCOPE_VIOLATION",
            details={"target": target, "reason": reason}
        )


class RateLimitExceededError(CyberHunterError):
    """Lançada quando a taxa de requisições configurada é ultrapassada."""
    def __init__(self, current_rps: float, max_rps: float):
        super().__init__(
            f"Taxa de requisições excedida ({current_rps:.1f} rps > {max_rps:.1f} rps)",
            code="RATE_LIMIT_EXCEEDED",
            details={"current_rps": current_rps, "max_rps": max_rps}
        )


class EngineExecutionError(CyberHunterError):
    """Lançada quando um engine falha durante a execução de uma tarefa."""
    def __init__(self, engine_name: str, message: str, original_exception: Exception = None):
        super().__init__(
            f"Falha no engine '{engine_name}': {message}",
            code="ENGINE_EXEC_ERROR",
            details={"engine": engine_name, "original": str(original_exception)}
        )


class StorageError(CyberHunterError):
    """Lançada quando ocorre falha de persistência ou restauração de campanha."""
    def __init__(self, operation: str, message: str):
        super().__init__(
            f"Erro de armazenamento ({operation}): {message}",
            code="STORAGE_ERROR",
            details={"operation": operation}
        )


class ValidationDifferentialError(CyberHunterError):
    """Lançada quando a triangulação de validação não atinge requisitos mínimos."""
    def __init__(self, finding_id: str, reason: str):
        super().__init__(
            f"Validação diferencial inconclusiva para {finding_id}: {reason}",
            code="VALIDATION_FAILED",
            details={"finding_id": finding_id, "reason": reason}
        )
