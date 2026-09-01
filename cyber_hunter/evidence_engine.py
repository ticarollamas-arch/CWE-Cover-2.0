# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Evidence Engine
- Immutable Chronological Evidence Ledger
- Sensitive PII / Token / Cookie Sanitizer
- Deterministic cURL Reproduction Generator
"""

import re
from typing import Dict, Any, List
from cyber_hunter.core.models import RequestRecord, ResponseRecord, EvidenceItem, ChainOfEvidence


class NativeEvidenceEngine:
    """Motor de coleta, higienização e geração de provas de conceito (PoC)."""

    SENSITIVE_HEADERS = [
        "authorization", "cookie", "set-cookie", "x-api-key", 
        "x-auth-token", "proxy-authorization", "x-csrf-token"
    ]

    @staticmethod
    def sanitize_headers(headers: Dict[str, str]) -> Dict[str, str]:
        sanitized = {}
        for k, v in headers.items():
            k_lower = k.lower()
            if any(sens in k_lower for sens in NativeEvidenceEngine.SENSITIVE_HEADERS):
                sanitized[k] = "[REDACTED_BY_CYBER_HUNTER]"
            else:
                sanitized[k] = v
        return sanitized

    @staticmethod
    def create_evidence_item(
        title: str,
        description: str,
        request: RequestRecord,
        response: ResponseRecord,
        diff_proof: str = ""
    ) -> EvidenceItem:
        # Higieniza headers antes de anexar à evidência oficial
        clean_req_headers = NativeEvidenceEngine.sanitize_headers(request.headers)
        clean_resp_headers = NativeEvidenceEngine.sanitize_headers(response.headers)

        clean_req = RequestRecord(
            method=request.method,
            url=request.url,
            headers=clean_req_headers,
            body=request.body,
            timestamp=request.timestamp
        )

        clean_resp = ResponseRecord(
            status_code=response.status_code,
            headers=clean_resp_headers,
            body_snippet=response.body_snippet[:4000],  # Recorte seguro de até 4000 caracteres
            content_length=response.content_length,
            response_time_ms=response.response_time_ms,
            timestamp=response.timestamp
        )

        return EvidenceItem(
            title=title,
            description=description,
            request=clean_req,
            response=clean_resp,
            diff_proof=diff_proof
        )
