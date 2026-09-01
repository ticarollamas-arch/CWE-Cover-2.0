# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • 18 Specialized Agents Catalog
Declaração formal dos 18 agentes que compõem o sistema autoral.
"""

from typing import List, Dict, Any
from cyber_hunter.agents.base import BaseSecurityAgent


class OrchestratorAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-ORCHESTRATOR",
            name="OrchestratorAgent",
            role="Cérebro operacional e coordenador do Task Graph e da esteira de campanhas",
            input_schema={"target_url": "str", "scope_policy": "ScopePolicy", "profile": "str"},
            output_schema={"campaign_object": "Campaign", "telemetry": "dict", "status": "str"},
            allowed_operations=["INIT_CAMPAIGN", "DISPATCH_TASK", "COLLECT_OBSERVATIONS", "CORRELATE", "FINALIZE"],
            engine_access=["ALL_17_ENGINES"],
            decision_rules=[
                "Verificar se o alvo está no escopo autorizado antes de qualquer despacho",
                "Executar tarefas em grafo DAG respeitando dependências de dados",
                "Controlar concorrência assíncrona limitada e tratamento de falhas"
            ],
            confidence_model="Meta-orquestração determinística baseada na convergência dos agentes subordinados"
        )


class ScopeAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-SCOPE",
            name="ScopeAgent",
            role="Guardião de escopo, permissões de auditoria, allowlist/denylist e rate limits",
            input_schema={"candidate_target": "str", "policy": "dict"},
            output_schema={"is_authorized": "bool", "reason": "str", "sanitized_target": "str"},
            allowed_operations=["VALIDATE_HOST", "CHECK_ALLOWLIST", "ENFORCE_RATE_LIMIT", "BLOCK_OUT_OF_SCOPE"],
            engine_access=["CH-SCOPE"],
            decision_rules=[
                "Rejeitar imediatamente alvos privados/loopback a menos que em modo LAB",
                "Exigir confirmação de autorização para qualquer teste ativo",
                "Interromper pipeline se o alvo divergir da política de domínio raiz"
            ],
            confidence_model="Validação estrita binária (1.0 = Autorizado, 0.0 = Bloqueado)"
        )


class AssetAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-ASSET",
            name="AssetAgent",
            role="Construtor e mantenedor do Grafo Unificado de Ativos e relacionamentos",
            input_schema={"raw_observations": "list", "parent_asset_id": "str"},
            output_schema={"asset_nodes": "list[Asset]", "relationships": "list[dict]"},
            allowed_operations=["CREATE_ASSET", "LINK_ASSETS", "MERGE_ALIASES", "UPDATE_CONFIDENCE"],
            engine_access=["CH-DNS", "CH-NET", "CH-HTTP"],
            decision_rules=[
                "De-duplicar nós pelo identificador canônico (IP, FQDN, URL normalizada)",
                "Preservar linhagem de descoberta (Parent -> Child)",
                "Calcular First Seen e Last Seen para cada ativo do grafo"
            ],
            confidence_model="Ponderação cumulativa de fontes de descoberta (0.5 a 1.0)"
        )


class DNSAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-DNS",
            name="DNSAgent",
            role="Especialista em resolução de nomes, topologia DNS e logs de Certificate Transparency",
            input_schema={"domain": "str", "nameservers": "list"},
            output_schema={"subdomains": "list[str]", "records": "dict", "dns_graph": "dict"},
            allowed_operations=["QUERY_CT_LOGS", "RESOLVE_RECORDS", "DETECT_WILDCARDS", "ANALYZE_CNAME_CHAINS"],
            engine_access=["CH-DNS"],
            decision_rules=[
                "Consultar logs de CT de forma passiva sem emitir tráfego intrusivo",
                "Descartar respostas de wildcard DNS para evitar falsos nós",
                "Rastrear CNAMEs órfãos para análise de takeover"
            ],
            confidence_model="Confirmação por resolução direta A/AAAA (Confiança: 0.95)"
        )


class NetworkAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-NETWORK",
            name="NetworkAgent",
            role="Mapeamento de portas, análise de protocolos e grabbing de banners em raw sockets",
            input_schema={"host": "str", "port_list": "list[int]", "timeout_ms": "int"},
            output_schema={"open_ports": "list[dict]", "banners": "list[str]", "latency_profile": "dict"},
            allowed_operations=["TCP_CONNECT_PROBE", "GRAB_BANNER", "DETECT_SERVICE", "CLASSIFY_PROTOCOL"],
            engine_access=["CH-NET", "CH-SPEEDNET"],
            decision_rules=[
                "Usar sockets assíncronos não-bloqueantes com controle de taxa adaptativo",
                "Extrair bytes de boas-vindas sem enviar payloads destrutivos",
                "Distinguir serviços TLS de serviços em texto claro"
            ],
            confidence_model="Confirmação por handshake TCP completo (Confiança: 0.98)"
        )


class HTTPAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-HTTP",
            name="HTTPAgent",
            role="Inspeção de transações HTTP/HTTPS, cifras TLS, cadeias de redirect e cabeçalhos",
            input_schema={"url": "str", "method": "str", "headers": "dict"},
            output_schema={"transaction": "HTTPTransaction", "tls_meta": "dict", "security_headers": "dict"},
            allowed_operations=["EXECUTE_REQUEST", "AUDIT_TLS_CERT", "TRACE_REDIRECTS", "AUDIT_COOKIES"],
            engine_access=["CH-HTTP", "CH-AUDIT"],
            decision_rules=[
                "Registrar Request e Response completos com tempo de resposta em milissegundos",
                "Preservar todas as etapas de redirecionamento HTTP",
                "Auditar flags de cookies (Secure, HttpOnly, SameSite)"
            ],
            confidence_model="Determinístico baseado em resposta RFC 7230 (Confiança: 1.0)"
        )


class CrawlerAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-CRAWLER",
            name="CrawlerAgent",
            role="Navegação em grafo DOM, tokenização HTML em stream e extração de formulários",
            input_schema={"base_url": "str", "html_body": "str", "max_depth": "int"},
            output_schema={"discovered_urls": "list[str]", "forms": "list[dict]", "inputs": "list[str]"},
            allowed_operations=["TOKENIZE_HTML", "EXTRACT_HREFS", "PARSE_FORMS", "ENQUEUE_URLS"],
            engine_access=["CH-CRAWL"],
            decision_rules=[
                "Normalizar URLs relativas conforme RFC 3986",
                "Descartar loops de paginação e rotas fora do domínio autorizado",
                "Identificar campos de formulário e query parameters para catalogação"
            ],
            confidence_model="Extração sintática em stream (Confiança: 0.95)"
        )


class FingerprintAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-FINGERPRINT",
            name="FingerprintAgent",
            role="Identificação de tecnologias, servidores, frameworks, CMS e CDNs baseada em evidências",
            input_schema={"headers": "dict", "body_snippet": "str", "cookies": "dict"},
            output_schema={"technologies": "list[dict]", "evidence_pointers": "list[str]"},
            allowed_operations=["MATCH_SIGNATURES", "ANALYZE_JS_LIBRARIES", "DETECT_FRAMEWORKS", "EXTRACT_VERSIONS"],
            engine_access=["CH-TECH", "CH-HTTP"],
            decision_rules=[
                "Nunca transformar uma pista isolada em certeza sem evidência de suporte",
                "Pontuar confiança de acordo com a especificidade da assinatura observada",
                "Registrar cabeçalhos como Server, X-Powered-By e caminhos específicos"
            ],
            confidence_model="Ponderação de evidências: Header exato = 0.9, HTML pattern = 0.7"
        )


class DiscoveryAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-DISCOVERY",
            name="DiscoveryAgent",
            role="Descoberta de caminhos críticos, consoles de administração, Swagger e backups",
            input_schema={"base_url": "str", "wordlist_profile": "str"},
            output_schema={"exposed_resources": "list[dict]", "admin_portals": "list[str]"},
            allowed_operations=["PROBE_PATH", "ANALYZE_STATUS", "DISCARD_SOFT_404", "LOG_EXPOSURE"],
            engine_access=["CH-CONTENT"],
            decision_rules=[
                "Validar se o status 200 é uma página real ou Soft 404 antes de catalogar",
                "Priorizar rotas de alta severidade (ex: /.git/HEAD, /.env, /actuator)",
                "Respeitar o limite de taxa de requisições configurado"
            ],
            confidence_model="Validação diferencial de integridade e tamanho de corpo (Confiança: 0.92)"
        )


class DetectionAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-DETECTION",
            name="DetectionAgent",
            role="Interpretador declarativo de regras de segurança com árvores booleanas e matchers",
            input_schema={"target_url": "str", "request": "RequestRecord", "response": "ResponseRecord"},
            output_schema={"candidate_findings": "list[Finding]", "rule_matches": "list[str]"},
            allowed_operations=["EVALUATE_RULE_AST", "MATCH_REGEX", "MATCH_STATUS", "CHAIN_STEPS"],
            engine_access=["CH-DETECT"],
            decision_rules=[
                "Executar condições em curto-circuito lógico para performance",
                "Verificar múltiplos pontos de correspondência (Status + Headers + Body)",
                "Emitir hipóteses estruturadas para o agente de validação"
            ],
            confidence_model="Correspondência exata de árvore de regras (Confiança: 0.90)"
        )


class ValidationAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-VALIDATION",
            name="ValidationAgent",
            role="Triangulação diferencial de hipóteses (Baseline vs Controle vs Teste) para eliminação de falso positivo",
            input_schema={"hypothesis": "dict", "candidate_finding": "Finding"},
            output_schema={"is_confirmed": "bool", "confidence_score": "float", "validation_delta": "dict"},
            allowed_operations=["COMPARE_BASELINE", "SEND_CONTROL_PROBE", "CALCULATE_DELTA", "CONFIRM_OR_REJECT"],
            engine_access=["CH-VERIFY"],
            decision_rules=[
                "Comparar resposta de teste com requisição de controle inerte",
                "Rejeitar hipóteses onde a resposta for idêntica ao controle inerte",
                "Calcular score de confiança matemático baseado na divergência comprovada"
            ],
            confidence_model="Triangulação comportamental diferencial (Confiança: 0.98)"
        )


class FalsePositiveAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-FP-REJECT",
            name="FalsePositiveAgent",
            role="Filtro determinístico de ruído, telas de desafio WAF e comportamentos dinâmicos aleatórios",
            input_schema={"response": "ResponseRecord", "probe_type": "str"},
            output_schema={"is_false_positive": "bool", "rejection_reason": "str"},
            allowed_operations=["CHECK_SOFT_404", "CHECK_WAF_BLOCK", "CHECK_DYNAMIC_REFLECT", "LOG_REJECTION"],
            engine_access=["CH-VERIFY"],
            decision_rules=[
                "Identificar páginas 200 OK com mensagens de 'Page Not Found' ou 'Error 404'",
                "Detectar bloqueios de Cloudflare/Akamai/ModSecurity e marcar como WAF_BLOCK",
                "Nunca apagar silenciosamente: registrar o motivo do descarte no audit trail"
            ],
            confidence_model="Heurística de rejeição semântica (Confiança: 0.99)"
        )


class CorrelationAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-CORRELATION",
            name="CorrelationAgent",
            role="Fusão de inteligência cross-engine e de-duplicação de achados no grafo unificado",
            input_schema={"campaign_observations": "list[Observation]", "raw_findings": "list[Finding]"},
            output_schema={"correlated_graph": "dict", "deduplicated_findings": "list[Finding]"},
            allowed_operations=["CROSS_CORRELATE", "DEDUPLICATE_BY_ROOT_CAUSE", "MERGE_OBSERVATIONS", "CLUSTER_ASSETS"],
            engine_access=["CH-CORRELATE"],
            decision_rules=[
                "Cruzar observações de DNS, Portas, HTTP e Tecnologias no mesmo ativo",
                "Agrupar achados semelhantes (ex: múltiplos headers ausentes no mesmo endpoint)",
                "Mapear a superfície de ataque consolidada sem duplicações"
            ],
            confidence_model="Correlação em grafo determinístico (Confiança: 0.97)"
        )


class CWEAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-CWE",
            name="CWEAgent",
            role="Classificação taxonômica oficial MITRE CWE Top 25 e hierarquia de fraquezas",
            input_schema={"finding": "Finding"},
            output_schema={"cwe_id": "str", "cwe_title": "str", "remediation_guide": "str"},
            allowed_operations=["CLASSIFY_CWE", "MAP_HIERARCHY", "ATTACH_REMEDIATION"],
            engine_access=["CH-CWE"],
            decision_rules=[
                "Atribuir identificador oficial MITRE mais específico possível",
                "Fornecer diretrizes de remediação seguras para engenharia de software",
                "Explicar a causa raiz técnica e a fraqueza estrutural"
            ],
            confidence_model="Mapeamento determinístico de taxonomia (Confiança: 1.0)"
        )


class OWASPAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-OWASP",
            name="OWASPAgent",
            role="Enquadramento regulatório em OWASP Top 10 (2021/2025) e OWASP API Security",
            input_schema={"cwe_id": "str", "finding_type": "str"},
            output_schema={"owasp_category": "str", "compliance_impact": "dict"},
            allowed_operations=["MAP_OWASP_TOP10", "MAP_OWASP_API", "CALCULATE_COMPLIANCE_GAP"],
            engine_access=["CH-OWASP"],
            decision_rules=[
                "Mapear bidirecionalmente CWE -> OWASP Top 10",
                "Avaliar impacto em normas ISO 27001, PCI-DSS e LGPD/GDPR",
                "Indicar o pilar de segurança afetado (Confidencialidade, Integridade, Disponibilidade)"
            ],
            confidence_model="Mapeamento padrão OWASP Foundation (Confiança: 1.0)"
        )


class ImpactAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-IMPACT",
            name="ImpactAgent",
            role="Cálculo matemático de severidade CVSS v3.1 e ponderação de risco real",
            input_schema={"finding": "Finding", "asset_exposure": "str", "confidence": "float"},
            output_schema={"cvss_score": "float", "cvss_vector": "str", "mathematical_risk": "float", "priority": "str"},
            allowed_operations=["COMPUTE_CVSS", "APPLY_CONFIDENCE_WEIGHT", "DETERMINE_PRIORITY"],
            engine_access=["CH-IMPACT"],
            decision_rules=[
                "Aplicar fórmula: Risk_Score = CVSS_Base × Confidence × Exposure_Factor",
                "Nunca classificar como CRITICAL sem vetor comprovado e alta confiança",
                "Definir prioridade de ação executiva (P1 Imediata, P2 Alta, P3 Média, P4 Informativa)"
            ],
            confidence_model="Cálculo matemático determinístico (Confiança: 1.0)"
        )


class EvidenceAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-EVIDENCE",
            name="EvidenceAgent",
            role="Construção do ledger imutável de provas de conceito e sanitização de credenciais",
            input_schema={"request": "RequestRecord", "response": "ResponseRecord", "diff": "str"},
            output_schema={"evidence_chain": "ChainOfEvidence", "sanitized_curl": "str"},
            allowed_operations=["CAPTURE_LEDGER", "REDACT_SECRETS", "GENERATE_CURL", "SIGN_EVIDENCE"],
            engine_access=["CH-EVIDENCE"],
            decision_rules=[
                "Redigir tokens Bearer, cookies de autenticação e senhas com [REDACTED_BY_CYBER_HUNTER]",
                "Gerar comando cURL reproduzível em 1 clique para plataformas de Bug Bounty",
                "Garantir a imutabilidade da linha do tempo da auditoria"
            ],
            confidence_model="Registro imutável de pacotes brutos sanitizados (Confiança: 1.0)"
        )


class ReportAgent(BaseSecurityAgent):
    def __init__(self):
        super().__init__(
            agent_id="AGT-REPORT",
            name="ReportAgent",
            role="Geração e exportação de relatórios profissionais em Markdown, JSON, JSONL e HTML",
            input_schema={"campaign": "Campaign", "output_format": "str"},
            output_schema={"report_content": "str", "summary_metrics": "dict"},
            allowed_operations=["RENDER_MARKDOWN", "RENDER_JSON", "RENDER_JSONL", "RENDER_HTML"],
            engine_access=["CH-REPORT"],
            decision_rules=[
                "Formatar Markdown no padrão aceito por HackerOne / Bugcrowd VRT",
                "Gerar JSON estruturado compatível com pipelines CI/CD DevSecOps",
                "Gerar JSONL streaming pronto para ingestão no Splunk / Elastic"
            ],
            confidence_model="Renderização determinística de schemas (Confiança: 1.0)"
        )


ALL_AGENTS = [
    OrchestratorAgent(),
    ScopeAgent(),
    AssetAgent(),
    DNSAgent(),
    NetworkAgent(),
    HTTPAgent(),
    CrawlerAgent(),
    FingerprintAgent(),
    DiscoveryAgent(),
    DetectionAgent(),
    ValidationAgent(),
    FalsePositiveAgent(),
    CorrelationAgent(),
    CWEAgent(),
    OWASPAgent(),
    ImpactAgent(),
    EvidenceAgent(),
    ReportAgent()
]
