# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Crawler Engine
- In-Memory URL Frontier with Scoping & Priority Queuing
- Native HTML & DOM Tokenizer (Links, Forms, Iframes, Scripts)
- JavaScript AST / Regex Route Analyzer (API endpoints, secrets, tokens)
- Parameter Discovery (Query Strings, Form Inputs, JSON fields)
"""

import re
from urllib.parse import urljoin, urlparse, parse_qs
from typing import Set, List, Dict, Any, Optional
from collections import deque


class NativeCrawlerEngine:
    """Crawler assíncrono e analisador de código-fonte estático e dinâmico."""

    # Regex para extração de rotas em arquivos JavaScript e HTML
    API_ROUTE_REGEX = re.compile(
        r"""(?:"|')((?:/api/|/v1/|/v2/|/v3/|/graphql|/rest/|/auth/|/user/|/admin/|/internal/)[a-zA-Z0-9_\-\./]+)(?:"|')""",
        re.IGNORECASE
    )

    # Regex para tokens e segredos comuns
    SECRET_REGEX = {
        "JWT": re.compile(r'eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}'),
        "AWS_KEY": re.compile(r'AKIA[0-9A-Z]{16}'),
        "GENERIC_SECRET": re.compile(r'(?:api_key|apiKey|secret_key|private_key|token|auth_token)\s*[:=]\s*["\']([a-zA-Z0-9_\-]{16,64})["\']', re.IGNORECASE)
    }

    @staticmethod
    def extract_links(base_url: str, html_content: str) -> Dict[str, Any]:
        """Tokenização nativa de tags HTML sem depender de bibliotecas externas pesadas."""
        links: Set[str] = set()
        scripts: Set[str] = set()
        forms: List[Dict[str, Any]] = []
        parameters: Set[str] = set()

        base_parsed = urlparse(base_url)
        base_domain = base_parsed.netloc

        # 1. Extração de links <a> e <link>
        for match in re.finditer(r'<(?:a|link)[^>]+href=["\']([^"\']+)["\']', html_content, re.IGNORECASE):
            raw_url = match.group(1).strip()
            if raw_url and not raw_url.startswith(("javascript:", "mailto:", "tel:", "#")):
                full_url = urljoin(base_url, raw_url)
                if urlparse(full_url).netloc == base_domain:
                    links.add(full_url)

        # 2. Extração de scripts <script src="...">
        for match in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\']', html_content, re.IGNORECASE):
            raw_src = match.group(1).strip()
            full_src = urljoin(base_url, raw_src)
            scripts.add(full_src)

        # 3. Extração de formulários <form action="..." method="...">
        for form_match in re.finditer(r'<form\b([^>]*)>(.*?)</form>', html_content, re.IGNORECASE | re.DOTALL):
            form_attrs = form_match.group(1)
            form_body = form_match.group(2)

            action_match = re.search(r'action=["\']([^"\']*)["\']', form_attrs, re.IGNORECASE)
            method_match = re.search(r'method=["\']([^"\']*)["\']', form_attrs, re.IGNORECASE)

            action = urljoin(base_url, action_match.group(1) if action_match else base_url)
            method = (method_match.group(1) if method_match else "GET").upper()

            # Extração de inputs
            inputs = []
            for inp_match in re.finditer(r'<input\b([^>]*)>', form_body, re.IGNORECASE):
                inp_attrs = inp_match.group(1)
                name_match = re.search(r'name=["\']([^"\']+)["\']', inp_attrs, re.IGNORECASE)
                type_match = re.search(r'type=["\']([^"\']+)["\']', inp_attrs, re.IGNORECASE)
                if name_match:
                    name = name_match.group(1)
                    inputs.append({"name": name, "type": type_match.group(1) if type_match else "text"})
                    parameters.add(name)

            forms.append({
                "action": action,
                "method": method,
                "inputs": inputs
            })

        # 4. Parâmetros de URL
        for link in links:
            query = urlparse(link).query
            if query:
                for param in parse_qs(query).keys():
                    parameters.add(param)

        return {
            "links": list(links),
            "scripts": list(scripts),
            "forms": forms,
            "discovered_parameters": list(parameters)
        }

    @staticmethod
    def analyze_javascript_content(js_code: str) -> Dict[str, Any]:
        """Identifica rotas de API e potenciais segredos embutidos em arquivos JavaScript."""
        routes = set(NativeCrawlerEngine.API_ROUTE_REGEX.findall(js_code))
        secrets = []

        for sec_type, regex in NativeCrawlerEngine.SECRET_REGEX.items():
            for m in regex.finditer(js_code):
                val = m.group(0)
                # Mascaramento seguro
                masked = val[:4] + "*" * (len(val) - 8) + val[-4:] if len(val) > 10 else "***"
                secrets.append({
                    "type": sec_type,
                    "preview": masked
                })

        return {
            "discovered_api_routes": list(routes),
            "potential_secrets": secrets
        }
