#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cwe-discover • Declarative Rule & Template Engine (100% Native Nuclei Replacement)
Autor: Carol Lamas (CyberHuntLab)
Descrição: Motor de regras declarativas em Python/JSON/YAML sem dependência do binário Nuclei.
Suporta matchers por status, palavras-chave, regex, cabeçalhos e verificação de falsos positivos.
"""

import json
import re
import ssl
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

DEFAULT_NATIVE_RULES = [
    {
        "id": "cwe-200-env-exposure",
        "name": "Exposição de Arquivo .env / Credenciais",
        "cwe": "CWE-200",
        "severity": "HIGH",
        "severity_score": 8.0,
        "confidence": 0.95,
        "path": "/.env",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200]},
            {"type": "word", "part": "body", "words": ["DB_PASSWORD", "AWS_SECRET", "APP_KEY", "JWT_SECRET", "REDIS_HOST", "DATABASE_URL"], "condition": "or"},
            {"type": "word", "part": "header", "words": ["text/html"], "negative": True}
        ],
        "description": "Arquivo de configuração .env exposto publicamente contendo variáveis de ambiente e segredos de produção."
    },
    {
        "id": "cwe-200-git-config",
        "name": "Exposição de Repositório .git/config",
        "cwe": "CWE-200",
        "severity": "HIGH",
        "severity_score": 8.0,
        "confidence": 0.90,
        "path": "/.git/config",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200]},
            {"type": "word", "part": "body", "words": ["[core]", "repositoryformatversion"], "condition": "and"}
        ],
        "description": "Pasta .git exposta que permite clonagem do código-fonte completo da aplicação."
    },
    {
        "id": "cwe-200-phpinfo",
        "name": "Vazamento de PHPInfo Diagnóstico",
        "cwe": "CWE-200",
        "severity": "MEDIUM",
        "severity_score": 5.0,
        "confidence": 0.95,
        "path": "/phpinfo.php",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200]},
            {"type": "word", "part": "body", "words": ["PHP Version", "Configuration File (php.ini) Path"], "condition": "and"}
        ],
        "description": "Página de diagnóstico do PHP revelando configurações de ambiente, módulos e caminhos internos."
    },
    {
        "id": "cwe-651-swagger-api",
        "name": "Documentação Swagger / OpenAPI Exposta",
        "cwe": "CWE-651",
        "severity": "LOW",
        "severity_score": 3.0,
        "confidence": 0.85,
        "path": "/swagger-ui.html",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200]},
            {"type": "word", "part": "body", "words": ["swagger-ui", "Swagger UI", "openapi"], "condition": "or"}
        ],
        "description": "Interface Swagger pública expondo catálogo de rotas, esquemas de dados e parâmetros internos de APIs."
    },
    {
        "id": "cwe-200-backup-archive",
        "name": "Arquivo de Backup / Dump Comprimido",
        "cwe": "CWE-200",
        "severity": "HIGH",
        "severity_score": 8.0,
        "confidence": 0.80,
        "path": "/backup.zip",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200]},
            {"type": "word", "part": "header", "words": ["application/zip", "application/x-zip-compressed", "application/octet-stream"], "condition": "or"}
        ],
        "description": "Arquivo de backup do sistema acessível sem autenticação."
    },
    {
        "id": "cwe-693-missing-csp",
        "name": "Ausência de Content-Security-Policy",
        "cwe": "CWE-693",
        "severity": "MEDIUM",
        "severity_score": 5.0,
        "confidence": 0.95,
        "path": "/",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200, 301, 302]},
            {"type": "word", "part": "header", "words": ["content-security-policy"], "negative": True}
        ],
        "description": "Falta do cabeçalho defensivo CSP facilitando ataques de XSS e injeção de scripts."
    },
    {
        "id": "cwe-693-missing-hsts",
        "name": "Ausência de Strict-Transport-Security (HSTS)",
        "cwe": "CWE-693",
        "severity": "MEDIUM",
        "severity_score": 4.0,
        "confidence": 0.95,
        "path": "/",
        "method": "GET",
        "matchers_condition": "and",
        "matchers": [
            {"type": "status", "status": [200, 301, 302]},
            {"type": "word", "part": "header", "words": ["strict-transport-security"], "negative": True}
        ],
        "description": "Conexões HTTPS suscetíveis a ataques de SSL Strip e downgrade de protocolo em redes não confiáveis."
    }
]

class NativeRuleEngine:
    """Motor de execução e matching de regras declarativas (Substitui o Nuclei)."""
    
    def __init__(self, rules: Optional[List[Dict[str, Any]]] = None, timeout: float = 6.0, user_agent: str = "cwe-discover/2.0 (Native Rule Engine)"):
        self.rules = rules if rules is not None else DEFAULT_NATIVE_RULES
        self.timeout = timeout
        self.user_agent = user_agent
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def _execute_request(self, base_url: str, path: str, method: str = "GET") -> Optional[Dict[str, Any]]:
        """Dispara a requisição HTTP configurada na regra."""
        target_url = urllib.parse.urljoin(base_url, path)
        req = urllib.request.Request(
            target_url,
            method=method.upper(),
            headers={
                "User-Agent": self.user_agent,
                "Accept": "*/*"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                body_bytes = resp.read(128 * 1024)
                body_text = body_bytes.decode('utf-8', errors='ignore')
                headers_str = "\n".join([f"{k.lower()}: {v}" for k, v in resp.headers.items()])
                return {
                    "url": target_url,
                    "status_code": resp.status,
                    "headers": dict(resp.headers),
                    "headers_str": headers_str,
                    "body": body_text
                }
        except urllib.error.HTTPError as e:
            headers_str = "\n".join([f"{k.lower()}: {v}" for k, v in e.headers.items()])
            return {
                "url": target_url,
                "status_code": e.code,
                "headers": dict(e.headers),
                "headers_str": headers_str,
                "body": ""
            }
        except Exception:
            return None

    def _evaluate_matcher(self, matcher: Dict[str, Any], response: Dict[str, Any]) -> bool:
        """Avalia individualmente um matcher da regra."""
        m_type = matcher.get("type", "word")
        is_negative = matcher.get("negative", False)
        
        matched = False
        if m_type == "status":
            expected_statuses = matcher.get("status", [])
            matched = (response["status_code"] in expected_statuses)
            
        elif m_type == "word":
            part = matcher.get("part", "body")
            words = matcher.get("words", [])
            condition = matcher.get("condition", "or")
            
            target_text = ""
            if part == "body":
                target_text = response["body"].lower()
            elif part == "header":
                target_text = response["headers_str"].lower()
            else:
                target_text = (response["headers_str"] + "\n" + response["body"]).lower()
                
            if condition == "and":
                matched = all(w.lower() in target_text for w in words)
            else:
                matched = any(w.lower() in target_text for w in words)
                
        elif m_type == "regex":
            part = matcher.get("part", "body")
            regexes = matcher.get("regex", [])
            condition = matcher.get("condition", "or")
            
            target_text = response["body"] if part == "body" else response["headers_str"]
            if condition == "and":
                matched = all(re.search(r, target_text, re.IGNORECASE) for r in regexes)
            else:
                matched = any(re.search(r, target_text, re.IGNORECASE) for r in regexes)

        if is_negative:
            matched = not matched

        return matched

    def scan_target(self, base_url: str) -> List[Dict[str, Any]]:
        """Varre o alvo contra o catálogo completo de regras declarativas."""
        findings = []
        if not base_url.startswith("http://") and not base_url.startswith("https://"):
            base_url = f"https://{base_url}"

        for rule in self.rules:
            resp = self._execute_request(base_url, rule.get("path", "/"), rule.get("method", "GET"))
            if not resp:
                continue

            matchers = rule.get("matchers", [])
            cond = rule.get("matchers_condition", "and")
            
            results = [self._evaluate_matcher(m, resp) for m in matchers]
            is_match = all(results) if cond == "and" else any(results)

            if is_match:
                risk_score = round(rule.get("severity_score", 5.0) * rule.get("confidence", 0.9), 2)
                findings.append({
                    "rule_id": rule["id"],
                    "title": rule["name"],
                    "cwe": rule["cwe"],
                    "severity": rule["severity"],
                    "severity_score": rule.get("severity_score", 5.0),
                    "confidence": rule.get("confidence", 0.9),
                    "risk_score": risk_score,
                    "matched_url": resp["url"],
                    "status_code": resp["status_code"],
                    "description": rule["description"],
                    "poc_curl": f'curl -i -s -k "{resp["url"]}"'
                })

        return findings

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "https://cyberhuntlab.com.br"
    print(f"[*] Executando Native Rule Engine contra: {target}")
    engine = NativeRuleEngine()
    results = engine.scan_target(target)
    print(f"[+] Total de achados confirmados: {len(results)}")
    for f in results:
        print(f" -> [{f['severity']} | {f['cwe']}] {f['title']} (Risk: {f['risk_score']}) -> {f['matched_url']}")
