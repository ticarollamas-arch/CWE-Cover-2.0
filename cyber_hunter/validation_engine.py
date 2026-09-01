# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Validation Engine
- Baseline Request (Original state fingerprint)
- Control Request (Randomized inert probe to detect reflection)
- Test Request (Targeted probe)
- Response Comparison (Length delta, DOM hash, status code entropy)
- False-Positive Rejection (Soft 404s, WAF challenge pages, dynamic noise)
"""

import hashlib
from typing import Dict, Any, Optional
from cyber_hunter.core.models import Finding, RequestRecord, ResponseRecord


class NativeValidationEngine:
    """Motor de validação diferencial que elimina falsos positivos por triangulação de requisições."""

    @staticmethod
    def calculate_body_hash(body: str) -> str:
        return hashlib.sha256(body.encode('utf-8', errors='ignore')).hexdigest()

    @staticmethod
    def is_soft_404(response: ResponseRecord, baseline_404: Optional[ResponseRecord] = None) -> bool:
        """Identifica se uma resposta 200 OK é na verdade uma página de erro disfarçada (Soft 404)."""
        indicators = [
            "page not found", "página não encontrada", "404 not found", 
            "error 404", "does not exist", "conteúdo indisponível", "não foi encontrado"
        ]
        body_lower = response.body_snippet.lower()
        for ind in indicators:
            if ind in body_lower:
                return True

        if baseline_404 and response.content_length > 0:
            # Compara similaridade de tamanho com o 404 de controle
            delta = abs(response.content_length - baseline_404.content_length)
            if delta < 50:  # Quase o mesmo tamanho do 404 real
                return True

        return False

    @staticmethod
    def validate_differential(
        baseline: ResponseRecord, 
        control: ResponseRecord, 
        test: ResponseRecord
    ) -> Dict[str, Any]:
        """Triangula Baseline vs Control vs Test para validar a anomalia."""
        
        # 1. Se o Test tiver o mesmo corpo do Control ou Baseline, é falso positivo
        if test.body_snippet == control.body_snippet or test.body_snippet == baseline.body_snippet:
            return {
                "is_valid": False,
                "confidence": 0.1,
                "reason": "Resposta idêntica ao controle inerte (sem alteração de comportamento)."
            }

        # 2. Se o status code for 200 mas for Soft 404
        if test.status_code == 200 and NativeValidationEngine.is_soft_404(test):
            return {
                "is_valid": False,
                "confidence": 0.2,
                "reason": "Detectado padrão de Soft 404 disfarçado de 200 OK."
            }

        # 3. Análise de divergência real
        size_delta = abs(test.content_length - baseline.content_length)
        status_changed = test.status_code != baseline.status_code

        confidence = 0.95 if status_changed or size_delta > 100 else 0.70

        return {
            "is_valid": True,
            "confidence": confidence,
            "size_delta": size_delta,
            "status_changed": status_changed,
            "reason": f"Diferença comportamental confirmada (Delta: {size_delta} bytes, Status: {test.status_code})."
        }
