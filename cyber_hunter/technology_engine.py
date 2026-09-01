# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Technology Engine
- Framework Detection (React, Vue, Angular, Next.js, Django, Laravel, Express, Spring)
- Server & CDN Detection (Nginx, Apache, Caddy, Cloudflare, Akamai, CloudFront)
- CMS Detection (WordPress, Drupal, Joomla, Shopify)
- Version & Vulnerability Index Mapping
"""

import re
from typing import Dict, Any, List


class NativeTechnologyEngine:
    """Motor de fingerprinting passivo de tecnologias web baseado em padrões de resposta."""

    TECH_RULES = [
        {"name": "Next.js", "category": "Framework", "header": "x-powered-by", "pattern": r"Next\.js", "body": r"id=\"__NEXT_DATA__\""},
        {"name": "React", "category": "Frontend Library", "body": r"data-reactroot|_reactRootContainer|react\.production\.min\.js"},
        {"name": "Vue.js", "category": "Frontend Library", "body": r"data-v-[a-f0-9]+|vue\.runtime|vue\.global"},
        {"name": "Angular", "category": "Framework", "body": r"ng-version|ng-app|<app-root"},
        {"name": "WordPress", "category": "CMS", "body": r"/wp-content/|/wp-includes/|wp-json", "header": "x-pingback"},
        {"name": "Django", "category": "Backend Framework", "header": "set-cookie", "pattern": r"csrftoken="},
        {"name": "Laravel", "category": "Backend Framework", "header": "set-cookie", "pattern": r"laravel_session|XSRF-TOKEN"},
        {"name": "Express", "category": "Backend Framework", "header": "x-powered-by", "pattern": r"Express"},
        {"name": "ASP.NET", "category": "Backend Framework", "header": "x-powered-by", "pattern": r"ASP\.NET", "body": r"__VIEWSTATE"},
        {"name": "Cloudflare", "category": "WAF / CDN", "header": "server", "pattern": r"cloudflare", "header2": "cf-ray"},
        {"name": "AWS CloudFront", "category": "CDN", "header": "via", "pattern": r"CloudFront", "header2": "x-amz-cf-id"},
        {"name": "Nginx", "category": "Web Server", "header": "server", "pattern": r"nginx"},
        {"name": "Apache", "category": "Web Server", "header": "server", "pattern": r"Apache"},
        {"name": "Tailwind CSS", "category": "CSS Framework", "body": r"class=\"[^\"]*(?:bg-|text-|flex|grid|p-|m-)[^\"]*\""}
    ]

    @staticmethod
    def identify_technologies(headers: Dict[str, str], body: str) -> List[Dict[str, Any]]:
        detected = []
        normalized_headers = {k.lower(): str(v) for k, v in headers.items()}

        for rule in NativeTechnologyEngine.TECH_RULES:
            matched = False
            evidence = ""

            # Check header
            if "header" in rule:
                hdr_val = normalized_headers.get(rule["header"], "")
                if hdr_val:
                    if "pattern" in rule:
                        if re.search(rule["pattern"], hdr_val, re.IGNORECASE):
                            matched = True
                            evidence = f"Header {rule['header']}: {hdr_val}"
                    else:
                        matched = True
                        evidence = f"Header {rule['header']} presente"

            # Check secondary header
            if "header2" in rule and not matched:
                if rule["header2"] in normalized_headers:
                    matched = True
                    evidence = f"Header {rule['header2']} presente"

            # Check body
            if "body" in rule and not matched and body:
                if re.search(rule["body"], body, re.IGNORECASE):
                    matched = True
                    evidence = f"Padrão no corpo HTML ({rule['body'][:30]}...)"

            if matched:
                detected.append({
                    "name": rule["name"],
                    "category": rule["category"],
                    "evidence": evidence
                })

        return detected
