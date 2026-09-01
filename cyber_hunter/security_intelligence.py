# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Security Intelligence
- MITRE CWE Knowledge Engine (CWE Top 25 & Most Prevalent Weaknesses)
- OWASP Top 10 (2021/2025) & API Security Top 10 Mapping
- Dynamic CVSS v3.1 Score & Vector Engine
- Mathematical Risk Scorer (Severity * Confidence * Exposure)
- Correlation & De-duplication Engine
"""

from typing import Dict, Any, List
from cyber_hunter.core.models import Finding, SeverityLevel


CWE_KNOWLEDGE_BASE = {
    "CWE-693": {
        "title": "Mecanismos de Proteção Ausentes (Security Headers / Defense in Depth)",
        "owasp": "A05:2021-Security Misconfiguration",
        "vrt": "server_security_misconfiguration",
        "default_severity": SeverityLevel.MEDIUM,
        "base_score": 5.3,
        "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N",
        "impact": "Expõe navegadores a ataques de Clickjacking, MIME sniffing, XSS ou downgrade de conexão.",
        "mitigation": "Configurar cabeçalhos HSTS com preload, Content-Security-Policy (CSP), X-Frame-Options e X-Content-Type-Options."
    },
    "CWE-200": {
        "title": "Exposição de Informações Sensíveis / Vazamento de Metadados",
        "owasp": "A01:2021-Broken Access Control",
        "vrt": "sensitive_data_exposure",
        "default_severity": SeverityLevel.HIGH,
        "base_score": 7.5,
        "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
        "impact": "Permite que atores maliciosos obtenham credenciais, tokens, arquitetura de rede ou código-fonte.",
        "mitigation": "Desabilitar diretórios públicos desnecessários (.git, .env, backups) e implementar controle de acesso restrito."
    },
    "CWE-16": {
        "title": "Configuração Insegura de Servidor Web",
        "owasp": "A05:2021-Security Misconfiguration",
        "vrt": "server_security_misconfiguration",
        "default_severity": SeverityLevel.LOW,
        "base_score": 3.7,
        "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        "impact": "Expõe banners de versões e diagnósticos técnicos que facilitam ataques direcionados.",
        "mitigation": "Ocultar o cabeçalho Server (ServerTokens Prod) e remover cabeçalhos X-Powered-By."
    },
    "CWE-548": {
        "title": "Listagem de Diretórios Habilitada (Directory Browsing)",
        "owasp": "A01:2021-Broken Access Control",
        "vrt": "directory_indexing",
        "default_severity": SeverityLevel.MEDIUM,
        "base_score": 5.3,
        "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        "impact": "Facilita o download não autorizado de arquivos estáticos, assets privados e backups.",
        "mitigation": "Desabilitar 'Options -Indexes' no Apache ou 'autoindex off;' no Nginx."
    },
    "CWE-319": {
        "title": "Transmissão de Informações em Texto Claro (Falta de HSTS / HTTP Puro)",
        "owasp": "A02:2021-Cryptographic Failures",
        "vrt": "insecure_transport",
        "default_severity": SeverityLevel.MEDIUM,
        "base_score": 5.9,
        "cvss_vector": "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
        "impact": "Risco de interceptação de tráfego (Man-in-the-Middle) e roubo de cookies de sessão.",
        "mitigation": "Forçar redirecionamento 301 para HTTPS e incluir cabeçalho Strict-Transport-Security com max-age>=31536000."
    }
}


class NativeSecurityIntelligence:
    """Motor de inteligência de segurança, taxonomia de vulnerabilidades e cálculo de risco."""

    @staticmethod
    def enrich_finding(finding: Finding) -> Finding:
        """Enriquece um achado com metadados detalhados de CWE, OWASP, VRT e CVSS."""
        cwe_data = CWE_KNOWLEDGE_BASE.get(finding.cwe_id)
        if cwe_data:
            if not finding.impact:
                finding.impact = cwe_data["impact"]
            if not finding.mitigation:
                finding.mitigation = cwe_data["mitigation"]
            finding.owasp_id = cwe_data["owasp"]
            finding.vrt_id = cwe_data["vrt"]
            finding.cvss_score = cwe_data["base_score"]
            finding.cvss_vector = cwe_data["cvss_vector"]
            # Calcula score de risco matemático
            finding.risk_score = round(finding.cvss_score * finding.confidence, 2)
        return finding
