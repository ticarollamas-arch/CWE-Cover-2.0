#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cwe-discover • HTTP Prober & Fingerprint Engine (100% Native & Autonomous)
Autor: Carol Lamas (CyberHuntLab)
Descrição: Probing HTTP/HTTPS rápido, extração de títulos, cabeçalhos de segurança,
redirecionamentos e identificação de tecnologias (Wappalyzer-like) sem dependências externas.
"""

import re
import socket
import ssl
import time
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

TECH_SIGNATURES = [
    {"name": "Nginx", "category": "Web Server", "header": "server", "regex": r"nginx(?:/([0-9.]+))?"},
    {"name": "Apache", "category": "Web Server", "header": "server", "regex": r"Apache(?:/([0-9.]+))?"},
    {"name": "Cloudflare", "category": "CDN / WAF", "header": "server", "regex": r"cloudflare"},
    {"name": "LiteSpeed", "category": "Web Server", "header": "server", "regex": r"LiteSpeed"},
    {"name": "Microsoft IIS", "category": "Web Server", "header": "server", "regex": r"Microsoft-IIS(?:/([0-9.]+))?"},
    {"name": "PHP", "category": "Language", "header": "x-powered-by", "regex": r"PHP(?:/([0-9.]+))?"},
    {"name": "ASP.NET", "category": "Framework", "header": "x-powered-by", "regex": r"ASP\.NET"},
    {"name": "Express.js", "category": "Framework", "header": "x-powered-by", "regex": r"Express"},
    {"name": "Next.js", "category": "Framework", "header": "x-powered-by", "regex": r"Next\.js"},
    {"name": "WordPress", "category": "CMS", "body": r"wp-content|wp-includes|generator[^>]+WordPress"},
    {"name": "Laravel", "category": "Framework", "cookie": r"laravel_session|XSRF-TOKEN"},
    {"name": "Django", "category": "Framework", "cookie": r"csrftoken"},
    {"name": "Spring Boot", "category": "Framework", "body": r"Whitelabel Error Page"},
    {"name": "React", "category": "Frontend", "body": r"data-reactroot|__REACT_DEVTOOLS_GLOBAL_HOOK__|react\.production\.min\.js"},
    {"name": "Vue.js", "category": "Frontend", "body": r"data-v-[a-f0-9]+|vue\.runtime\.min\.js"},
    {"name": "Tailwind CSS", "category": "CSS", "body": r"tailwindcss"},
]

SECURITY_HEADERS = [
    {"name": "Content-Security-Policy", "cwe": "CWE-693", "critical": True},
    {"name": "Strict-Transport-Security", "cwe": "CWE-693", "critical": True},
    {"name": "X-Frame-Options", "cwe": "CWE-693", "critical": True},
    {"name": "X-Content-Type-Options", "cwe": "CWE-693", "critical": False},
    {"name": "Referrer-Policy", "cwe": "CWE-693", "critical": False},
    {"name": "Permissions-Policy", "cwe": "CWE-693", "critical": False},
]

class NativeHttpProber:
    """Prober HTTP de alta performance com fingerprinting e auditoria de cabeçalhos."""
    
    def __init__(self, timeout: float = 6.0, user_agent: str = "cwe-discover/2.0 (Native Prober)"):
        self.timeout = timeout
        self.user_agent = user_agent
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def probe(self, url: str) -> Dict[str, Any]:
        """Executa probe completo em uma URL alvo."""
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"
            
        start_time = time.time()
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": self.user_agent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            }
        )
        
        result: Dict[str, Any] = {
            "url": url,
            "alive": False,
            "status_code": 0,
            "title": "",
            "content_length": 0,
            "response_time_ms": 0,
            "server": "",
            "technologies": [],
            "missing_security_headers": [],
            "present_security_headers": {},
            "headers": {},
            "redirect_location": None,
            "error": None
        }
        
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                elapsed = int((time.time() - start_time) * 1000)
                body_bytes = resp.read(256 * 1024) # Lê até 256KB para performance
                body_text = body_bytes.decode('utf-8', errors='ignore')
                
                result["alive"] = True
                result["status_code"] = resp.status
                result["response_time_ms"] = elapsed
                result["content_length"] = len(body_bytes)
                
                # Headers normatizados
                headers = {k.lower(): v for k, v in resp.headers.items()}
                result["headers"] = dict(resp.headers)
                result["server"] = headers.get("server", "")
                
                # Extração de Título
                title_match = re.search(r"<title[^>]*>(.*?)</title>", body_text, re.IGNORECASE | re.DOTALL)
                if title_match:
                    result["title"] = " ".join(title_match.group(1).split())[:120]
                    
                # Checagem de Cabeçalhos de Segurança
                for sec in SECURITY_HEADERS:
                    h_lower = sec["name"].lower()
                    if h_lower in headers:
                        result["present_security_headers"][sec["name"]] = headers[h_lower]
                    else:
                        result["missing_security_headers"].append(sec)
                        
                # Fingerprint de Tecnologias
                detected_techs = []
                for sig in TECH_SIGNATURES:
                    # Checagem por Header
                    if "header" in sig:
                        h_val = headers.get(sig["header"], "")
                        if h_val and re.search(sig["regex"], h_val, re.IGNORECASE):
                            detected_techs.append(sig["name"])
                            continue
                            
                    # Checagem por Cookie
                    if "cookie" in sig:
                        cookie_val = headers.get("set-cookie", "")
                        if cookie_val and re.search(sig["cookie"], cookie_val, re.IGNORECASE):
                            detected_techs.append(sig["name"])
                            continue
                            
                    # Checagem por Body
                    if "body" in sig:
                        if re.search(sig["body"], body_text, re.IGNORECASE):
                            detected_techs.append(sig["name"])
                            continue
                            
                result["technologies"] = list(set(detected_techs))
                
        except urllib.error.HTTPError as e:
            result["alive"] = True
            result["status_code"] = e.code
            result["response_time_ms"] = int((time.time() - start_time) * 1000)
            headers = {k.lower(): v for k, v in e.headers.items()}
            result["headers"] = dict(e.headers)
            result["server"] = headers.get("server", "")
            if "location" in headers:
                result["redirect_location"] = headers["location"]
        except Exception as ex:
            result["alive"] = False
            result["error"] = str(ex)
            
        return result

    def probe_many(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Executa probe sequencial/concorrente em lote."""
        results = []
        for u in urls:
            results.append(self.probe(u))
        return results

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "https://cyberhuntlab.com.br"
    print(f"[*] Executando HTTP Probe nativo para: {target}")
    prober = NativeHttpProber()
    res = prober.probe(target)
    print(f"Status: {res['status_code']} | Title: '{res['title']}' | Server: {res['server']}")
    print(f"Tecnologias: {res['technologies']}")
    print(f"Headers Faltantes: {[h['name'] for h in res['missing_security_headers']]}")
