# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • HTTP Engine
- Native HTTP/HTTPS Client with redirects, timeout & custom headers
- TLS & Certificate Handshake Analysis (Ciphers, Validity, SANs)
- Security Header Auditing (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Response Analysis & Anomaly Detection
"""

import ssl
import socket
import urllib.request
import urllib.parse
import time
from typing import Dict, Any, Optional, List
from cyber_hunter.core.models import (
    Asset, AssetType, Observation, ObservationType, 
    RequestRecord, ResponseRecord, Campaign
)


class NativeHttpEngine:
    """Cliente e analisador HTTP/TLS assíncrono nativo."""

    @staticmethod
    def audit_tls(hostname: str, port: int = 443, timeout: float = 3.0) -> Dict[str, Any]:
        context = ssl.create_default_context()
        tls_info = {
            "has_tls": False,
            "version": None,
            "cipher": None,
            "san_entries": [],
            "issuer": None,
            "anomaly": None
        }
        try:
            with socket.create_connection((hostname, port), timeout=timeout) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    tls_info["has_tls"] = True
                    tls_info["version"] = ssock.version()
                    tls_info["cipher"] = ssock.cipher()[0] if ssock.cipher() else None
                    if cert:
                        # Extrai SANs
                        for field_name, value in cert.get("subjectAltName", []):
                            if field_name == "DNS":
                                tls_info["san_entries"].append(value)
                        # Extrai Issuer
                        issuer = cert.get("issuer", ())
                        for item in issuer:
                            for k, v in item:
                                if k == "organizationName":
                                    tls_info["issuer"] = v
        except Exception as e:
            tls_info["anomaly"] = str(e)
            
        return tls_info

    @staticmethod
    def request(url: str, method: str = "GET", headers: Optional[Dict[str, str]] = None, timeout: float = 5.0) -> Dict[str, Any]:
        parsed = urllib.parse.urlparse(url)
        default_headers = {
            "User-Agent": "CyberHunter/2.0 (Security Triage; MITRE CWE-Cover)",
            "Accept": "*/*",
            "Connection": "close"
        }
        if headers:
            default_headers.update(headers)

        req_record = RequestRecord(
            method=method,
            url=url,
            headers=default_headers
        )

        req = urllib.request.Request(url, headers=default_headers, method=method)
        start_time = time.time()
        
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                elapsed_ms = (time.time() - start_time) * 1000
                resp_headers = {k.lower(): v for k, v in resp.headers.items()}
                body_bytes = resp.read(65536)  # Leitura segura de até 64KB
                body_snippet = body_bytes.decode('utf-8', errors='ignore')
                
                resp_record = ResponseRecord(
                    status_code=resp.status,
                    headers=resp_headers,
                    body_snippet=body_snippet,
                    content_length=len(body_bytes),
                    response_time_ms=round(elapsed_ms, 2)
                )
                return {
                    "success": True,
                    "request": req_record,
                    "response": resp_record,
                    "error": None
                }
        except urllib.error.HTTPError as e:
            elapsed_ms = (time.time() - start_time) * 1000
            resp_headers = {k.lower(): v for k, v in e.headers.items()}
            body_bytes = e.read(16384)
            resp_record = ResponseRecord(
                status_code=e.code,
                headers=resp_headers,
                body_snippet=body_bytes.decode('utf-8', errors='ignore'),
                content_length=len(body_bytes),
                response_time_ms=round(elapsed_ms, 2)
            )
            return {
                "success": True,
                "request": req_record,
                "response": resp_record,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "request": req_record,
                "response": None,
                "error": str(e)
            }

    @staticmethod
    def audit_security_headers(headers: Dict[str, str]) -> Dict[str, Any]:
        """Avalia cabeçalhos defensivos conforme RFCs e diretrizes OWASP."""
        missing = []
        present = {}

        checks = {
            "strict-transport-security": "HSTS ausente (CWE-319 / CWE-693)",
            "content-security-policy": "CSP ausente (CWE-693 / XSS Mitigation)",
            "x-frame-options": "X-Frame-Options ausente (CWE-693 / Clickjacking)",
            "x-content-type-options": "X-Content-Type-Options ausente (CWE-693 / MIME Sniffing)",
            "referrer-policy": "Referrer-Policy ausente (CWE-200 / Information Leak)",
            "permissions-policy": "Permissions-Policy ausente (CWE-693 / Browser Features)"
        }

        for header, description in checks.items():
            if header in headers:
                present[header] = headers[header]
            else:
                missing.append({
                    "header": header,
                    "description": description
                })

        return {
            "missing_headers": missing,
            "present_headers": present,
            "is_hardened": len(missing) == 0
        }
