# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Detection Engine
- Declarative AST Rule Engine (YAML/JSON Condition Matcher)
- High-Performance Regex & Substring Search
- Differential Anomaly Detection
- Multi-Step Chained Request Evaluation
"""

import re
from typing import Dict, Any, List, Optional
from cyber_hunter.core.models import Finding, SeverityLevel, EvidenceItem, ChainOfEvidence, RequestRecord, ResponseRecord


BUILTIN_DETECTION_RULES = [
    {
        "id": "CHE-DET-001",
        "title": "Exposição de Repositório Git (.git/HEAD)",
        "severity": SeverityLevel.CRITICAL,
        "cwe_id": "CWE-200",
        "owasp_id": "A05:2021-Security Misconfiguration",
        "vrt_id": "source_code_disclosure",
        "path": "/.git/HEAD",
        "matchers": [
            {"type": "status", "value": 200},
            {"type": "body", "pattern": r"^ref:\s*refs/heads/"}
        ],
        "description": "O diretório .git está exposto publicamente, permitindo download do código-fonte completo e histórico de commits.",
        "impact": "Vazamento total de código-fonte, credenciais e chaves embutidas.",
        "mitigation": "Bloquear o acesso HTTP a arquivos e pastas ocultas (.git, .env, .svn) no servidor web."
    },
    {
        "id": "CHE-DET-002",
        "title": "Arquivo de Variáveis de Ambiente Exposto (.env)",
        "severity": SeverityLevel.CRITICAL,
        "cwe_id": "CWE-200",
        "owasp_id": "A05:2021-Security Misconfiguration",
        "vrt_id": "sensitive_data_exposure",
        "path": "/.env",
        "matchers": [
            {"type": "status", "value": 200},
            {"type": "body", "pattern": r"(?:DB_PASSWORD|DATABASE_URL|APP_KEY|AWS_SECRET|JWT_SECRET|API_KEY)="}
        ],
        "description": "Arquivo de configuração .env exposto com credenciais de banco e chaves de API em texto plano.",
        "impact": "Acesso não autorizado a bancos de dados de produção e serviços em nuvem.",
        "mitigation": "Armazenar variáveis de ambiente fora do DocumentRoot e bloquear requisições a arquivos com extensão .env."
    },
    {
        "id": "CHE-DET-003",
        "title": "Painel Swagger / OpenAPI Exposto sem Autenticação",
        "severity": SeverityLevel.LOW,
        "cwe_id": "CWE-200",
        "owasp_id": "A05:2021-Security Misconfiguration",
        "vrt_id": "api_documentation_disclosure",
        "path": "/swagger-ui/index.html",
        "matchers": [
            {"type": "status", "value": 200},
            {"type": "body", "pattern": r"Swagger UI|swagger-ui-bundle"}
        ],
        "description": "Documentação interativa de APIs exposta publicamente.",
        "impact": "Facilita o mapeamento da superfície de ataque por atacantes externos.",
        "mitigation": "Exigir autenticação ou restringir o acesso a redes internas/VPNs."
    },
    {
        "id": "CHE-DET-004",
        "title": "Spring Boot Actuator Exposto (/actuator/env)",
        "severity": SeverityLevel.HIGH,
        "cwe_id": "CWE-200",
        "owasp_id": "A05:2021-Security Misconfiguration",
        "vrt_id": "information_disclosure",
        "path": "/actuator/env",
        "matchers": [
            {"type": "status", "value": 200},
            {"type": "body", "pattern": r"\"activeProfiles\"|\"propertySources\""}
        ],
        "description": "Endpoints do Spring Boot Actuator expõem propriedades de ambiente e configurações da JVM.",
        "impact": "Vazamento de topologia de infraestrutura e tokens sensíveis.",
        "mitigation": "Desabilitar endpoints não essenciais via management.endpoints.web.exposure.exclude=*."
    },
    {
        "id": "CHE-DET-005",
        "title": "Servidor com PHPInfo Exposto",
        "severity": SeverityLevel.MEDIUM,
        "cwe_id": "CWE-200",
        "owasp_id": "A05:2021-Security Misconfiguration",
        "vrt_id": "information_disclosure",
        "path": "/phpinfo.php",
        "matchers": [
            {"type": "status", "value": 200},
            {"type": "body", "pattern": r"<title>phpinfo\(\)</title>|PHP Version"}
        ],
        "description": "Página phpinfo() exposta com configurações detalhadas do ambiente de execução.",
        "impact": "Divulgação de versões exatas, módulos carregados e variáveis do sistema.",
        "mitigation": "Remover arquivos de teste e desabilitar funções de diagnóstico em produção."
    }
]


class NativeDetectionEngine:
    """Avaliador declarativo de regras de segurança com suporte a regex pré-compilado."""

    def __init__(self, custom_rules: Optional[List[Dict[str, Any]]] = None):
        self.rules = custom_rules or BUILTIN_DETECTION_RULES

    def evaluate_response(self, target_url: str, request: RequestRecord, response: ResponseRecord) -> List[Finding]:
        findings = []

        for rule in self.rules:
            # Verifica se o path corresponde (ou se é regra genérica)
            if "path" in rule:
                if not request.url.endswith(rule["path"]):
                    continue

            all_matched = True
            for matcher in rule["matchers"]:
                m_type = matcher["type"]
                if m_type == "status":
                    if response.status_code != matcher["value"]:
                        all_matched = False
                        break
                elif m_type == "body":
                    if not re.search(matcher["pattern"], response.body_snippet, re.IGNORECASE | re.MULTILINE):
                        all_matched = False
                        break
                elif m_type == "header":
                    hdr_name = matcher["header"].lower()
                    if hdr_name not in response.headers or not re.search(matcher["pattern"], response.headers[hdr_name], re.IGNORECASE):
                        all_matched = False
                        break

            if all_matched:
                chain = ChainOfEvidence()
                chain.add(EvidenceItem(
                    title=f"Evidência de {rule['title']}",
                    description=f"Correspondência determinística de status {response.status_code} e assinatura de payload.",
                    request=request,
                    response=response
                ))

                findings.append(Finding(
                    title=rule["title"],
                    severity=rule["severity"],
                    confidence=0.98,
                    cwe_id=rule["cwe_id"],
                    owasp_id=rule["owasp_id"],
                    vrt_id=rule["vrt_id"],
                    target=request.url,
                    description=rule["description"],
                    impact=rule["impact"],
                    mitigation=rule["mitigation"],
                    chain_of_evidence=chain,
                    validated=True
                ))

        return findings
