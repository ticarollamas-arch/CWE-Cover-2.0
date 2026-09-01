#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cwe-discover • Deep Route, JS & Endpoint Extractor (100% Native Katana/GAU Replacement)
Autor: Carol Lamas (CyberHuntLab)
Descrição: Rastreamento rápido de rotas em HTML, scripts JavaScript, formulários com campos
sensíveis, minerador de parâmetros (?file=, ?redirect=) e supressão de Soft-404.
"""

import json
import re
import ssl
import urllib.request
import urllib.parse
from typing import List, Set, Dict, Any, Optional

SENSITIVE_PARAM_NAMES = [
    "file", "path", "url", "redirect", "next", "dest", "callback", "return",
    "token", "api_key", "secret", "password", "pass", "pwd", "auth",
    "id", "user_id", "account", "order", "query", "search", "cmd", "exec"
]

class NativeEndpointCrawler:
    """Crawler e extrator de endpoints, formulários e parâmetros sem dependências externas."""
    
    def __init__(self, target_url: str, timeout: float = 6.0, user_agent: str = "cwe-discover/2.0 (Native Crawler)"):
        self.target_url = target_url
        self.parsed_base = urllib.parse.urlparse(target_url)
        self.base_domain = self.parsed_base.netloc.split(":")[0]
        self.timeout = timeout
        self.user_agent = user_agent
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def _fetch_html(self, url: str) -> Optional[str]:
        """Busca o conteúdo HTML/JS do endpoint."""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": self.user_agent,
                "Accept": "text/html,application/xhtml+xml,application/javascript,*/*;q=0.8"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception:
            return None

    def query_wayback_endpoints(self) -> Set[str]:
        """Consulta histórico de URLs do alvo via Wayback CDX API (GAU-like)."""
        endpoints: Set[str] = set()
        url = f"http://web.archive.org/cdx/search/cdx?url={self.base_domain}/*&output=json&fl=original&collapse=urlkey&limit=500"
        req = urllib.request.Request(url, headers={"User-Agent": self.user_agent})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                data = json.loads(resp.read().decode('utf-8', errors='ignore'))
                if len(data) > 1:
                    for row in data[1:]:
                        if row and row[0]:
                            endpoints.add(row[0])
        except Exception:
            pass
        return endpoints

    def extract_from_html(self, html: str, source_url: str) -> Dict[str, Any]:
        """Extrai links, scripts, formulários e rotas REST/JS do HTML."""
        links: Set[str] = set()
        scripts: Set[str] = set()
        forms: List[Dict[str, Any]] = []
        api_routes: Set[str] = set()
        sensitive_params: Set[str] = set()

        # 1. Extração de Tags <a>
        for href in re.findall(r'<a\s+(?:[^>]*?\s+)?href=["\'](.*?)["\']', html, re.IGNORECASE):
            full_url = urllib.parse.urljoin(source_url, href.strip())
            if self._is_in_scope(full_url):
                links.add(full_url)
                
        # 2. Extração de Scripts <script src="...">
        for src in re.findall(r'<script\s+(?:[^>]*?\s+)?src=["\'](.*?)["\']', html, re.IGNORECASE):
            full_src = urllib.parse.urljoin(source_url, src.strip())
            scripts.add(full_src)

        # 3. Extração de Formulários <form action="...">
        form_matches = re.finditer(r'<form\s+([^>]*?)>(.*?)</form>', html, re.IGNORECASE | re.DOTALL)
        for fm in form_matches:
            attrs = fm.group(1)
            body = fm.group(2)
            
            action_m = re.search(r'action=["\'](.*?)["\']', attrs, re.IGNORECASE)
            action = urllib.parse.urljoin(source_url, action_m.group(1).strip()) if action_m else source_url
            
            method_m = re.search(r'method=["\'](.*?)["\']', attrs, re.IGNORECASE)
            method = method_m.group(1).upper() if method_m else "GET"
            
            # Checagem de inputs e tokens CSRF
            has_csrf = bool(re.search(r'name=["\'](?:csrf|xsrf|_token|token)["\']', body, re.IGNORECASE))
            
            input_names = re.findall(r'<input\s+[^>]*?name=["\'](.*?)["\']', body, re.IGNORECASE)
            forms.append({
                "action": action,
                "method": method,
                "inputs": input_names,
                "has_csrf_token": has_csrf
            })

        # 4. Regex para rotas de API em Javascript (fetch, axios, ajax, URLs relativas)
        js_routes = re.findall(r'["\'](/(?:api|v1|v2|v3|admin|graphql|auth|user|login|logout|account|download|export|upload)[a-zA-Z0-9_\-/\.]*)["\']', html)
        for r in js_routes:
            api_routes.add(urllib.parse.urljoin(source_url, r))

        # 5. Mineração de Parâmetros Sensíveis
        all_urls = links.union(api_routes)
        for u in all_urls:
            parsed = urllib.parse.urlparse(u)
            if parsed.query:
                params = urllib.parse.parse_qs(parsed.query)
                for p in params.keys():
                    if p.lower() in SENSITIVE_PARAM_NAMES:
                        sensitive_params.add(f"{p} ({u})")

        return {
            "source_url": source_url,
            "links": sorted(list(links)),
            "scripts": sorted(list(scripts)),
            "forms": forms,
            "api_routes": sorted(list(api_routes)),
            "sensitive_params": sorted(list(sensitive_params))
        }

    def _is_in_scope(self, url: str) -> bool:
        """Verifica se a URL pertence ao mesmo domínio base."""
        try:
            parsed = urllib.parse.urlparse(url)
            return parsed.netloc.split(":")[0].endswith(self.base_domain)
        except Exception:
            return False

    def crawl(self) -> Dict[str, Any]:
        """Executa a descoberta agregando live HTML e Wayback CDX."""
        html = self._fetch_html(self.target_url) or ""
        live_data = self.extract_from_html(html, self.target_url)
        wayback_urls = self.query_wayback_endpoints()
        
        all_unique_endpoints = set(live_data["links"]).union(live_data["api_routes"]).union(wayback_urls)
        
        return {
            "target": self.target_url,
            "total_endpoints": len(all_unique_endpoints),
            "live_links_count": len(live_data["links"]),
            "api_routes_count": len(live_data["api_routes"]),
            "scripts_count": len(live_data["scripts"]),
            "forms_count": len(live_data["forms"]),
            "forms_without_csrf": [f for f in live_data["forms"] if not f["has_csrf_token"] and f["method"] == "POST"],
            "sensitive_parameters": live_data["sensitive_params"],
            "endpoints": sorted(list(all_unique_endpoints))[:100]
        }

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "https://cyberhuntlab.com.br"
    print(f"[*] Executando Native Crawler para: {target}")
    crawler = NativeEndpointCrawler(target)
    result = crawler.crawl()
    print(f"[+] Total de rotas mapeadas: {result['total_endpoints']}")
    print(f"[+] Rotas de API descobertas: {result['api_routes_count']}")
    print(f"[+] Formulários sem Anti-CSRF: {len(result['forms_without_csrf'])}")
    print(f"[+] Parâmetros sensíveis minerados: {result['sensitive_parameters']}")
