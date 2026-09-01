"""
Validation Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Enforces the Evidence-First validation pipeline.
Verifies URL association, evidence origin, CWE compatibility, reproducibility, and scope containment.
Implements the Finding Validation / PoC Explainer architecture:
DETECTION → OPEN FINDING → COLLECT EVIDENCE → VALIDATE RULE → GENERATE SAFE POC → AGENT ANALYSIS → CLASSIFY → FINAL REPORT
"""

from typing import List, Dict, Any, Tuple
from urllib.parse import urlparse, parse_qs
from .models import AgentFinding, FindingStatus, Evidence, ScopeConfig


class ValidationAgent:
    """Agent that audits, filters, and validates observations against strict evidence standards."""

    def __init__(self, scope: ScopeConfig):
        self.scope = scope

    def validate_finding(self, finding: AgentFinding) -> AgentFinding:
        """
        Applies validation gates to the raw finding:
        1. Checks if evidence exists and has traceable content.
        2. Checks if the URL is within the authorized scope.
        3. Analyzes evidence consistency (detects contradictory signals).
        4. Calculates realistic confidence based on empirical evidence.
        5. Populates structured explanation: detection_reason, what_was_proven, what_was_not_proven, safe PoC.
        """
        raw_evidence_text = " ".join([e.raw for e in finding.evidences if e.raw]).strip()
        if not raw_evidence_text and finding.observed_behavior:
            raw_evidence_text = finding.observed_behavior

        # Extract parameter if applicable
        parsed_url = urlparse(finding.url)
        query_params = parse_qs(parsed_url.query)
        if query_params:
            finding.parameter = list(query_params.keys())[0]

        # Rule 1: No evidence = INSUFFICIENT_EVIDENCE
        if not finding.evidences or all(len(e.raw.strip()) == 0 for e in finding.evidences):
            finding.status = FindingStatus.INSUFFICIENT_EVIDENCE
            finding.confidence = 0.10
            finding.confirmed = False
            finding.detection_reason = "Anomalia reportada sem evidência técnica comprovatória."
            finding.what_was_proven = "Nenhum sinal técnico empírico registrado."
            finding.what_was_not_proven = "Não foi possível reproduzir ou validar a condição reportada."
            finding.false_positive_analysis = "Insufficient technical evidence provided for evaluation."
            finding.poc_command = f"curl -I -s \"{finding.url}\""
            finding.poc = f"Request: GET {finding.url} → Response: Insufficient Evidence"
            return finding

        # Rule 2: Scope containment check
        if not self.scope.is_in_scope(finding.url):
            finding.in_scope = False
            finding.status = FindingStatus.FALSE_POSITIVE
            finding.confidence = 0.0
            finding.confirmed = False
            finding.detection_reason = f"Alvo fora do escopo de teste autorizado: {finding.url}"
            finding.what_was_proven = "A URL inspecionada pertence a um domínio externo não autorizado."
            finding.what_was_not_proven = "Achado descartado antes de análise de vulnerabilidade por restrição ética."
            finding.false_positive_analysis = f"URL {finding.url} falls outside authorized domain scope."
            return finding

        # Rule 3: Contradictory evidence check
        if finding.contradictory_evidence:
            finding.status = FindingStatus.UNCERTAIN
            finding.confidence = max(0.20, finding.confidence * 0.5)
            finding.confirmed = False
            finding.detection_reason = f"Conflito de sinais técnicos observado entre fases de varredura."
            finding.what_was_proven = "Respostas divergentes recebidas em diferentes requisições."
            finding.what_was_not_proven = "Incerteza sobre a persistência da anomalia de segurança."
            return finding

        # Rule 4: Detailed Breakdown per CWE Classification
        if finding.cwe_id == "CWE-693":
            # Missing Security Headers
            finding.status = FindingStatus.OBSERVATION
            finding.confidence = min(0.90, finding.confidence)
            finding.confirmed = False
            finding.triggered_rule = "MISSING_HTTP_SECURITY_HEADERS"
            
            # Extract missing header list if present
            missing_text = raw_evidence_text.replace("Headers ausentes:", "").strip()
            finding.detection_reason = (
                f"Os seguintes mecanismos de proteção foram observados como ausentes na resposta HTTP:\n"
                f"- {missing_text if missing_text else 'Content-Security-Policy, X-Frame-Options, X-Content-Type-Options'}"
            )
            finding.what_was_proven = (
                "Foi comprovada empiricamente a ausência dos cabeçalhos defensivos recomendados na resposta HTTP do servidor."
            )
            finding.what_was_not_proven = (
                "Não foi executado clique-sequestro (clickjacking), MIME-sniffing nem injeção de scripts hostis (a vulnerabilidade é estritamente de configuração preventiva)."
            )
            finding.poc_command = f"curl -I -s \"{finding.url}\""
            finding.poc = (
                f"Request: curl -I -s \"{finding.url}\"\n"
                f"Response Headers: Cabeçalhos HSTS/CSP/X-Frame-Options não retornados pelo servidor.\n"
                f"Evidência: {raw_evidence_text}\n"
                f"Regra CWE: CWE-693 (Defense-in-Depth Configuration Failure)\n"
                f"Análise: Ausência de camadas de segurança de borda para mitigação em profundidade."
            )

        elif finding.cwe_id == "CWE-200":
            is_critical_file = any("/.env" in e.url or "/.git" in e.url for e in finding.evidences)
            if is_critical_file:
                finding.status = FindingStatus.CONFIRMED
                finding.confidence = 0.99
                finding.confirmed = True
                finding.triggered_rule = "EXPOSED_CONFIG_FILE_OR_REPOSITORY"
                finding.detection_reason = f"Arquivo sensível ou repositório de configuração acessível diretamente via HTTP 200: {finding.url}"
                finding.what_was_proven = "Acesso público irrestrito ao recurso com conteúdo sensível verificado."
                finding.what_was_not_proven = "Credenciais ou dados não foram utilizados contra sistemas de produção."
                finding.poc_command = f"curl -s -i \"{finding.url}\""
                finding.poc = (
                    f"Request: curl -s -i \"{finding.url}\"\n"
                    f"Response: HTTP/1.1 200 OK contendo assinaturas de configuração.\n"
                    f"Evidência: {raw_evidence_text}\n"
                    f"Regra CWE: CWE-200 (Sensitive Information Exposure)\n"
                    f"Análise: Exposição direta de segredos de infraestrutura ou histórico de desenvolvimento."
                )
            else:
                # Banner expositivo
                finding.status = FindingStatus.OBSERVATION
                finding.confidence = min(0.50, finding.confidence)
                finding.confirmed = False
                finding.triggered_rule = "EXPOSED_SERVER_OR_FRAMEWORK_BANNER"
                finding.detection_reason = f"Exposição de cabeçalho informativo de software/servidor: {raw_evidence_text}"
                finding.what_was_proven = "Presença de cabeçalhos informativos (Server/X-Powered-By) na resposta HTTP."
                finding.what_was_not_proven = "Não foi comprovada a existência de vulnerabilidades exploráveis na versão anunciada."
                finding.poc_command = f"curl -I -s \"{finding.url}\" | grep -iE 'server|powered|version'"
                finding.poc = (
                    f"Request: curl -I -s \"{finding.url}\"\n"
                    f"Response: {raw_evidence_text}\n"
                    f"Regra CWE: CWE-200 (Information Disclosure)\n"
                    f"Análise: Reconhecimento passivo de stack tecnológica."
                )

        elif finding.cwe_id == "CWE-22":
            finding.status = FindingStatus.INCONCLUSIVE
            finding.confidence = min(0.60, finding.confidence)
            finding.confirmed = False
            finding.triggered_rule = "HEURISTIC_FILE_PARAM_PATTERN"
            finding.detection_reason = (
                f"Parâmetro com padrão de manipulação de arquivo identificado na URL: {finding.url}"
            )
            finding.what_was_proven = (
                "Identificação de parâmetro suscetível a manipulação de caminho na requisição (ex: file=, page=, doc=, template=)."
            )
            finding.what_was_not_proven = (
                "NÃO foi demonstrada leitura arbitrária de arquivos do sistema operacional (/etc/passwd, win.ini, web.config), "
                "pois a varredura é 100% passiva e não executa injeção de payloads hostis."
            )
            finding.poc_command = f"curl -s -i \"{finding.url}\""
            finding.poc = (
                f"Request: GET {finding.url}\n"
                f"Evidência: Padrão heurístico identificado: {raw_evidence_text}\n"
                f"Regra CWE: CWE-22 (Improper Limitation of a Pathname)\n"
                f"Análise: O parâmetro requer validação ativa em ambiente autorizado para testar se há restrição estrita de path."
            )

        elif finding.cwe_id == "CWE-352":
            finding.status = FindingStatus.INCONCLUSIVE
            finding.confidence = min(0.65, finding.confidence)
            finding.confirmed = False
            finding.triggered_rule = "FORM_WITHOUT_OBSERVABLE_CSRF_INPUT"
            finding.detection_reason = "Formulário POST identificado sem campo evidente de token Anti-CSRF no DOM."
            finding.what_was_proven = "Ausência de input oculto do tipo anti-csrf token na estrutura HTML do formulário inspecionado."
            finding.what_was_not_proven = (
                "Não foi verificado se o endpoint valida a origem via cabeçalhos customizados (ex: X-Requested-With, X-CSRF-Token), "
                "cookies SameSite=Strict/Lax ou autenticação via Authorization Bearer."
            )
            finding.poc_command = f"curl -s \"{finding.url}\" | grep -i '<form'"
            finding.poc = (
                f"Target Form URL: {finding.url}\n"
                f"Evidência: Formulário POST mapeado sem input anti-csrf visível no HTML.\n"
                f"Regra CWE: CWE-352 (Cross-Site Request Forgery)\n"
                f"Análise: Verificação manual recomendada para auditar mecanismos de proteção em nível de API ou headers."
            )

        elif finding.cwe_id == "CWE-615":
            finding.status = FindingStatus.OBSERVATION
            finding.confidence = min(0.80, finding.confidence)
            finding.confirmed = False
            finding.triggered_rule = "SENSITIVE_KEYWORD_IN_DOM_COMMENT"
            finding.detection_reason = f"Comentário no código fonte contendo termos de desenvolvimento: {raw_evidence_text}"
            finding.what_was_proven = "Presença de anotações internas ou caminhos no DOM entregue ao navegador."
            finding.what_was_not_proven = "Não foi comprovada a validade operacional ou privilégio de chaves/rotas citadas."
            finding.poc_command = f"curl -s \"{finding.url}\" | grep -i -E 'todo|fixme|api_key|secret|admin'"
            finding.poc = (
                f"Request: curl -s \"{finding.url}\"\n"
                f"Evidência: {raw_evidence_text}\n"
                f"Regra CWE: CWE-615 (Inclusion of Sensitive Information in Source Code Comments)"
            )

        return finding
