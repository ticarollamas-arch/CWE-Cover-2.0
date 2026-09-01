import React, { useState } from 'react';
import { 
  Network, 
  Globe, 
  ShieldCheck, 
  Search, 
  Cpu, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Layers, 
  AlertTriangle, 
  Database, 
  Zap, 
  Code2, 
  KeyRound, 
  Sliders, 
  Fingerprint, 
  Eye, 
  FileText,
  Activity,
  Bot,
  Sparkles,
  Copy,
  Check,
  Radio,
  Gauge,
  Compass,
  FolderSearch,
  Shuffle,
  ShieldAlert,
  GitMerge,
  Target,
  BarChart3,
  Flame,
  FileCheck2
} from 'lucide-react';

export interface Engine17Branch {
  id: string;
  code: string;
  name: string;
  stage: 'DISCOVERY' | 'ANALYSIS' | 'VALIDATION' | 'CORRELATION' | 'EVIDENCE_REPORT';
  category: string;
  conceptReference: string;
  icon: any;
  badge: string;
  problemSolved: string;
  ourImplementation: string;
  sharedContextInputs: string[];
  sharedContextOutputs: string[];
  subCapabilities: {
    name: string;
    details: string;
  }[];
  codeSample: string;
}

export const ENGINES_17: Engine17Branch[] = [
  {
    id: 'ch-net',
    code: 'CH-NET',
    name: '01. NETWORK ENGINE',
    stage: 'DISCOVERY',
    category: 'Descoberta de Rede & Serviços',
    conceptReference: 'Substitui conceitualmente as capacidades do Nmap sem binários C/Go',
    icon: Network,
    badge: 'Raw Sockets Nativo',
    problemSolved: 'Identificar portas abertas, serviços em execução, banners e protocolos de rede sem depender de ferramentas de terceiros.',
    ourImplementation: 'Scanner TCP/UDP assíncrono em sockets puros Python com probes estruturadas e captura passiva/ativa de banners.',
    sharedContextInputs: ['Host IP / Range', 'Port Policy', 'Timeout Profile'],
    sharedContextOutputs: ['Open Ports', 'Service Signatures', 'Transport Protocols', 'Live Asset Fingerprints'],
    subCapabilities: [
      { name: 'Descoberta de Portas', details: 'Socket connect_ex assíncrono não-bloqueante para portas TCP e probes UDP direcionadas.' },
      { name: 'Identificação de Serviços', details: 'Distingue SSH, FTP, SMTP, HTTP, MySQL, Redis, PostgreSQL e AMQP por bytes de boas-vindas.' },
      { name: 'Identificação de Protocolos', details: 'Diferencia tráfego em texto claro de túneis criptografados TLS/SSL em qualquer porta.' },
      { name: 'Análise TCP', details: 'Avalia flags de resposta SYN-ACK / RST e tempos de resposta de handshake.' },
      { name: 'Análise UDP', details: 'Probes estruturadas para DNS (53), SNMP (161) e NTP (123) com tratamento de ICMP Port Unreachable.' },
      { name: 'Fingerprinting de Rede', details: 'Heurística de TTL e janelas TCP para determinar a pilha de rede subjacente.' },
      { name: 'Detecção de Versões por Evidência', details: 'Parser regex determinístico sobre os banners brutos coletados.' },
      { name: 'Inventário de Serviços', details: 'Alimenta o grafo de ativos com nós de serviços enriquecidos com metadados.' }
    ],
    codeSample: `class CH_NetEngine:\n    @staticmethod\n    def probe_service(host: str, port: int, timeout: float = 0.5) -> Dict[str, Any]:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(timeout)\n        if s.connect_ex((host, port)) == 0:\n            banner = CH_NetEngine._grab_banner(s, port)\n            return {"port": port, "protocol": "tcp", "service": banner["service"], "raw": banner["raw"]}`
  },
  {
    id: 'ch-crawl',
    code: 'CH-CRAWL',
    name: '02. WEB DISCOVERY ENGINE',
    stage: 'DISCOVERY',
    category: 'Mapeamento DOM, JS & APIs',
    conceptReference: 'Motor nativo de descoberta web com tokenizador AST e analisador de scripts',
    icon: Search,
    badge: 'AST & Stream Tokenizer',
    problemSolved: 'Mapear árvores de links, formulários interativos, rotas de API em JavaScript e parâmetros sem headless browsers pesados.',
    ourImplementation: 'Tokenizador de stream HTML ultra-rápido com analisador regex/AST de código JavaScript para extração de rotas `/api/*`.',
    sharedContextInputs: ['Live HTTP Endpoints', 'Crawl Depth Limit', 'Scope Rules'],
    sharedContextOutputs: ['Discovered URLs', 'JS Endpoints & API Routes', 'Form Inputs & Parameters', 'Query Parameters'],
    subCapabilities: [
      { name: 'Crawling Web Resiliente', details: 'Fila de prioridade BFS em memória com normalização RFC 3986 e descarte de loops.' },
      { name: 'Descoberta de URLs', details: 'Extração em stream de tags <a>, <link>, <script>, <source>, <iframe> e inline handlers.' },
      { name: 'Análise de JavaScript', details: 'Parser de scripts estáticos em busca de rotas de API, templates literais e endpoints GraphQL.' },
      { name: 'Endpoints & APIs', details: 'Identificação de rotas REST `/api/v1/...`, `/v2/...`, `/graphql` e endpoints Webhook.' },
      { name: 'Mapeamento de Parâmetros', details: 'Catalogação de query parameters (`?id=`, `?page=`, `?token=`) e inputs POST.' },
      { name: 'Rastreamento de Redirects', details: 'Seguimento seguro de cadeias 301/302/307/308 com detecção de open redirects preliminares.' },
      { name: 'Processamento de Sitemap', details: 'Parser passivo de `sitemap.xml` e rotas semânticas declaradas.' },
      { name: 'Descoberta Incremental', details: 'Realimenta continuamente o grafo de ativos à medida que novas rotas são identificadas.' }
    ],
    codeSample: `class CH_WebDiscoveryEngine:\n    JS_ROUTE_REGEX = re.compile(r"""(?:"|')((?:/api/|/v1/|/v2/|/graphql)[a-zA-Z0-9_\-\./]+)(?:"|')""", re.I)\n    @staticmethod\n    def extract_routes(html: str, base_url: str) -> Set[str]:\n        # Tokeniza tags HTML e analisa código JavaScript sem dependências externas\n        return CH_WebDiscoveryEngine.JS_ROUTE_REGEX.findall(html)`
  },
  {
    id: 'ch-http',
    code: 'CH-HTTP',
    name: '03. HTTP INTELLIGENCE ENGINE',
    stage: 'ANALYSIS',
    category: 'Camada Web & TLS',
    conceptReference: 'Motor de inteligência HTTP/1.1 e auditoria de protocolos TLS/SSL',
    icon: Zap,
    badge: 'TLS 1.3 & Entropia',
    problemSolved: 'Inspecionar requisições/respostas HTTP, cabeçalhos, cookies e cifras TLS com controle granular de conexão.',
    ourImplementation: 'Cliente HTTP/1.1 assíncrono nativo com suporte a auditoria de certificados TLS/SSL, cálculo de entropia e fingerprinting.',
    sharedContextInputs: ['Candidate URLs', 'Custom Header Set', 'Proxy Matrix'],
    sharedContextOutputs: ['HTTP Transaction Records', 'TLS Metadata & SANs', 'Response Hashes', 'Security Headers'],
    subCapabilities: [
      { name: 'Probing HTTP/HTTPS', details: 'Conexões nativas com fallback automático de protocolo e controle de timeouts milimétricos.' },
      { name: 'Auditoria de Headers', details: 'Mapeia headers de segurança e extrai cabeçalhos de diagnóstico (X-Debug, Via, Server).' },
      { name: 'Análise de Status Code', details: 'Classificação semântica de códigos 1xx a 5xx com detecção de comportamentos anômalos.' },
      { name: 'Inspeção de TLS/SSL', details: 'Extrai Subject Alternative Names (SAN), autoridade emissora, datas de validade e cifras.' },
      { name: 'Cadeia de Redirects', details: 'Rastreia a jornada completa de redirecionamento preservando cada passo em ledger.' },
      { name: 'Análise de Cookies', details: 'Verifica flags críticas de proteção (Secure, HttpOnly, SameSite=Strict/Lax/None).' },
      { name: 'Content-Type & Encodings', details: 'Validação de MIME types para identificar respostas que fogem do padrão declarado.' },
      { name: 'Technology Fingerprint', details: 'Extração de pistas em Server, Powered-By e estruturas de resposta para identificação de stack.' }
    ],
    codeSample: `class CH_HttpIntelligenceEngine:\n    @staticmethod\n    def probe(url: str) -> Dict[str, Any]:\n        # Executa requisição HTTP resiliente, valida TLS e audita cabeçalhos\n        req = urllib.request.Request(url, headers={"User-Agent": "CyberHunterEngine/1.0"})\n        ...`
  },
  {
    id: 'ch-speednet',
    code: 'CH-SPEEDNET',
    name: '04. HIGH-SPEED NETWORK ENGINE',
    stage: 'DISCOVERY',
    category: 'Escaneamento Assíncrono',
    conceptReference: 'Escaneamento assíncrono de portas em pool não-bloqueante',
    icon: Gauge,
    badge: 'Loop Não-Bloqueante',
    problemSolved: 'Escanear centenas de portas em milissegundos sem criar saturação de rede nem sofrer bloqueios por rate limit agressivo.',
    ourImplementation: 'Motor assíncrono em pool de sockets não-bloqueantes com controle adaptativo de taxa (leaky bucket) e suporte IPv4/IPv6.',
    sharedContextInputs: ['Host Range', 'Port List', 'Target Latency Window'],
    sharedContextOutputs: ['Active TCP Ports', 'Latency Profile', 'Streaming Port Events'],
    subCapabilities: [
      { name: 'Concorrência Não-Bloqueante', details: 'Pool de sockets com select/epoll interno em Python sem overhead de processos pesados.' },
      { name: 'Controle de Timeout Dinâmico', details: 'Ajuste em tempo real do tempo limite de conexão baseado na latência RTT observada.' },
      { name: 'Rate Control Adaptativo', details: 'Algoritmo de token bucket que diminui o ritmo se detectar pacotes descartados ou RST em massa.' },
      { name: 'Suporte Nativo IPv4 / IPv6', details: 'Trata endereçamento de última geração transparentemente via socket AF_INET6.' },
      { name: 'TCP Discovery Rápido', details: 'Probes imediatas nas top 100 portas corporativas e web com descarte instantâneo.' },
      { name: 'Resultados em Streaming', details: 'Emite eventos de porta aberta para o barramento da campanha em tempo real.' }
    ],
    codeSample: `class CH_HighSpeedNetEngine:\n    def scan_fast(self, host: str, ports: List[int]) -> List[int]:\n        # Concorrência adaptativa com select nativo e latência milimétrica\n        ...`
  },
  {
    id: 'ch-dns',
    code: 'CH-DNS',
    name: '05. DNS INTELLIGENCE ENGINE',
    stage: 'DISCOVERY',
    category: 'Superfície de Ataque & DNS',
    conceptReference: 'Motor autoral de enumeração DNS e Certificate Transparency',
    icon: Globe,
    badge: 'DNS & CT Logs Passivos',
    problemSolved: 'Mapear topologia de domínio, registros DNS e subdomínios ativos sem depender de compiladores Go ou APIs pagas.',
    ourImplementation: 'Consultas estruturadas a logs públicos de Certificate Transparency (crt.sh, AlienVault) e resolvedor de registros DNS.',
    sharedContextInputs: ['Apex Domain', 'Wildcard Policy', 'Nameserver List'],
    sharedContextOutputs: ['Subdomain Graph', 'A/AAAA/CNAME Records', 'MX/TXT/NS Records', 'Asset Relationships'],
    subCapabilities: [
      { name: 'DNS Resolution Multithread', details: 'Resolução paralela de nomes descartando wildcards e zonas de redirecionamento falso.' },
      { name: 'Consulta a Registros DNS', details: 'Mapeamento de registros A, AAAA, CNAME, MX, TXT (SPF/DMARC) e NS autoritativos.' },
      { name: 'Enumeração de Subdomínios', details: 'Coleta passiva em logs globais de transparência de certificados SSL/TLS.' },
      { name: 'Detecção de Nameservers', details: 'Identifica provedores de DNS (Cloudflare, Route53, Akamai, GoDaddy) e vulnerabilidades de delegação.' },
      { name: 'Análise de Aliases (CNAME)', details: 'Rastreia cadeias CNAME para detecção preventiva de Subdomain Takeover.' },
      { name: 'Relacionamento entre Ativos', details: 'Gera o grafo hierárquico vinculando domínios a subdomínios, IPs e clusters de servidores.' }
    ],
    codeSample: `class CH_DnsIntelligenceEngine:\n    @staticmethod\n    def resolve_asset_graph(domain: str) -> Dict[str, Any]:\n        # Resolução passiva e mapeamento de CNAME / A / TXT em grafo unificado\n        ...`
  },
  {
    id: 'ch-audit',
    code: 'CH-AUDIT',
    name: '06. WEB AUDIT ENGINE',
    stage: 'ANALYSIS',
    category: 'Auditoria de Configuração Web',
    conceptReference: 'Capacidades de auditoria de servidores Web e postura de segurança',
    icon: Sliders,
    badge: 'OWASP Best Practices',
    problemSolved: 'Avaliar cabeçalhos defensivos, métodos HTTP perigosos, arquivos públicos e falhas de configuração de servidores.',
    ourImplementation: 'Motor de auditoria de conformidade RFC com regras para HSTS, CSP, X-Frame-Options, CORS, permissões e banners expostos.',
    sharedContextInputs: ['Live Web Assets', 'Baseline HTTP Responses'],
    sharedContextOutputs: ['Security Header Gaps', 'Dangerous Method Alerts', 'Configuration Findings'],
    subCapabilities: [
      { name: 'Headers de Segurança', details: 'Auditoria estrita de HSTS (preload/max-age), CSP, X-Frame-Options, X-Content-Type-Options e Referrer-Policy.' },
      { name: 'Configurações Observáveis', details: 'Avalia se o servidor expõe diagnósticos de debug ou banners com números exatos de versão.' },
      { name: 'Arquivos Públicos de Segurança', details: 'Verificação de conformidade de `/.well-known/security.txt` e `robots.txt`.' },
      { name: 'Comportamento HTTP & Métodos', details: 'Testa verbos HTTP perigosos (PUT, DELETE, TRACE, OPTIONS) e verbos customizados.' },
      { name: 'Evidências de Configuração', details: 'Documenta as falhas de configuração com referências diretas às RFCs e matriz OWASP.' }
    ],
    codeSample: `class CH_WebAuditEngine:\n    @staticmethod\n    def audit_security_posture(headers: Dict[str, str]) -> List[Dict[str, Any]]:\n        # Avalia postura de cabeçalhos de defesa em profundidade (CWE-693)\n        ...`
  },
  {
    id: 'ch-content',
    code: 'CH-CONTENT',
    name: '07. CONTENT DISCOVERY ENGINE',
    stage: 'DISCOVERY',
    category: 'Descoberta de Arquivos & Rotas',
    conceptReference: 'Motor inteligente de descoberta de caminhos com wordlists curadas',
    icon: FolderSearch,
    badge: 'Wordlists Curadas & Dicionários',
    problemSolved: 'Identificar diretórios ocultos, arquivos de configuração (.env, .git), consoles de administração e backups esquecidos.',
    ourImplementation: 'Scanner de diretórios inteligente com wordlists curadas, controle de soft 404 e calibração de respostas dinâmicas.',
    sharedContextInputs: ['Target Base URL', 'Wordlist Category Profile', 'Extension Filter'],
    sharedContextOutputs: ['Discovered Files & Paths', 'Admin Portals', 'Backup Exposures', 'API Documentation'],
    subCapabilities: [
      { name: 'Descoberta de Diretórios', details: 'Varredura rápida por caminhos de alto valor (`/admin`, `/api`, `/internal`, `/dashboard`).' },
      { name: 'Descoberta de Arquivos Críticos', details: 'Busca por `.git/HEAD`, `.env`, `docker-compose.yml`, `config.php.bak`, `web.config`.' },
      { name: 'Identificação de Recursos', details: 'Localização de Swagger UI, Actuator, phpMyAdmin, GraphQL consoles e Webhooks.' },
      { name: 'Wordlists Especializadas', details: 'Dicionários otimizados e categorizados por tecnologias previamente detectadas.' },
      { name: 'Análise de Respostas', details: 'Filtra respostas 200/301/403/500 diferenciando páginas reais de telas de erro genéricas.' }
    ],
    codeSample: `class CH_ContentDiscoveryEngine:\n    CURATED_TARGET_PATHS = [\n        "/.git/HEAD", "/.env", "/swagger-ui/index.html", "/actuator/env", "/phpinfo.php"\n    ]`
  },
  {
    id: 'ch-fuzz',
    code: 'CH-FUZZ',
    name: '08. FUZZING ENGINE',
    stage: 'ANALYSIS',
    category: 'Fuzzing & Detecção de Anomalias',
    conceptReference: 'Capacidades de fuzzing parametrizado e mutação de requisições',
    icon: Shuffle,
    badge: 'Mutação & Análise Diferencial',
    problemSolved: 'Descobrir parâmetros ocultos, injeções em cabeçalhos e falhas de parser através de variações controladas de requisições.',
    ourImplementation: 'Gerador de mutações de parâmetros, query strings, headers e métodos com motor de detecção de divergência de resposta.',
    sharedContextInputs: ['Discovered Endpoints', 'Parameter Vectors', 'Baseline Hashes'],
    sharedContextOutputs: ['Anomalous Parameter Responses', 'Header Injection Leads', 'Parser Error Findings'],
    subCapabilities: [
      { name: 'Fuzzing de Parâmetros', details: 'Injeção de payloads de teste em parâmetros GET e POST para avaliar reflexão e comportamento.' },
      { name: 'Fuzzing de Caminhos', details: 'Variações de path traversal e normalização de URI (`/..;/`, `//`, `%2e%2e/`).' },
      { name: 'Fuzzing de Headers', details: 'Envio de cabeçalhos de controle de IP (`X-Forwarded-For`, `X-Real-IP`, `X-Original-URL`).' },
      { name: 'Fuzzing de Métodos HTTP', details: 'Alternância de verbos padrão para contornar controles de acesso baseados em método.' },
      { name: 'Comparação de Respostas', details: 'Mede alterações de tamanho, tempos de execução e códigos de retorno em relação à baseline.' },
      { name: 'Detecção de Anomalias', details: 'Identifica quando uma entrada provoca stack traces, timeouts incomuns ou respostas desformatadas.' }
    ],
    codeSample: `class CH_FuzzingEngine:\n    @staticmethod\n    def fuzz_parameter(url: str, param: str, payloads: List[str]) -> List[Dict[str, Any]]:\n        # Compara comportamento de resposta entre payload e baseline inerte\n        ...`
  },
  {
    id: 'ch-appsec',
    code: 'CH-APPSEC',
    name: '09. APPLICATION SECURITY ENGINE',
    stage: 'ANALYSIS',
    category: 'Segurança de Aplicação & APIs',
    conceptReference: 'Capacidades de auditoria de lógica de aplicação, sessões e APIs',
    icon: ShieldAlert,
    badge: 'Análise de Sessão & APIs',
    problemSolved: 'Avaliar falhas de autenticação, tokens de sessão fracos, controle de acesso quebrado (BOLA/IDOR) e segurança de APIs.',
    ourImplementation: 'Auditor de fluxos de autenticação, estruturas de tokens JWT, políticas CORS permissivas e exposição de dados em APIs REST.',
    sharedContextInputs: ['API Schema Leads', 'Session Tokens', 'Endpoint Parameters'],
    sharedContextOutputs: ['Auth Vulnerability Findings', 'CORS Misconfigurations', 'BOLA / Broken Access Indicators'],
    subCapabilities: [
      { name: 'Auditoria de Autenticação', details: 'Verifica se rotas administrativas exigem credenciais válidas e detecta bypasses simples.' },
      { name: 'Controle de Autorização (BOLA)', details: 'Avalia manipulação de IDs em rotas REST (`/users/1` vs `/users/2`) para detectar IDOR.' },
      { name: 'Análise de Sessões & JWT', details: 'Decodifica tokens JWT verificando algoritmos fracos (`alg: none`), expiração e claims sensíveis.' },
      { name: 'Validação de Entradas', details: 'Testa se a aplicação sanitiza caracteres especiais em formulários e query parameters.' },
      { name: 'Políticas CORS Inseguras', details: 'Avalia se o servidor reflete `Origin: https://evil.com` com `Access-Control-Allow-Credentials: true`.' },
      { name: 'Auditoria de Segurança de APIs', details: 'Verifica se respostas de API vazam campos internos (senhas com hash, chaves privadas).' },
      { name: 'Comportamento Anômalo', details: 'Detecta respostas desproporcionalmente lentas que indicam processamento intensivo inseguro.' }
    ],
    codeSample: `class CH_AppSecEngine:\n    @staticmethod\n    def inspect_cors_policy(headers: Dict[str, str], test_origin: str) -> Optional[Dict[str, Any]]:\n        # Avalia políticas CORS excessivamente permissivas (CWE-346 / CWE-942)\n        ...`
  },
  {
    id: 'ch-detect',
    code: 'CH-DETECT',
    name: '10. DETECTION ENGINE',
    stage: 'VALIDATION',
    category: 'Motor de Regras & Matchers',
    conceptReference: 'Interpretador declarativo autoral de regras e matchers em grafo',
    icon: FileCode,
    badge: 'AST Declarativo & Matchers',
    problemSolved: 'Executar testes determinísticos baseados em regras declarativas sem depender de engines externas ou templates de terceiros.',
    ourImplementation: 'Interpretador declarativo de regras de segurança com suporte a múltiplos passos, árvores booleanas (AND/OR/NOT) e matchers regex.',
    sharedContextInputs: ['Discovered Endpoints', 'Technology Context', 'Built-in Security Rules'],
    sharedContextOutputs: ['Raw Match Observations', 'Candidate Security Findings'],
    subCapabilities: [
      { name: 'Avaliador Declarativo de Regras', details: 'Processa arquivos de regras verificando múltiplos pontos de correspondência em cascata.' },
      { name: 'Condições Booleanas Avançadas', details: 'Combina matchers com operadores lógicos (AND, OR, AND NOT) para máxima precisão.' },
      { name: 'Requisições Multi-Step', details: 'Executa requisição inicial, extrai token da resposta e realiza o teste final encadeado.' },
      { name: 'Matching em Headers & Status', details: 'Compara códigos de status esperados e padrões de headers específicos.' },
      { name: 'Regex & Análise de Body', details: 'Aplica expressões regulares de alta performance sobre o corpo da resposta HTTP.' },
      { name: 'JSONPath & XML Evaluator', details: 'Extrai e valida propriedades em payloads estruturados retornados por APIs.' },
      { name: 'Correlação com Contexto', details: 'Só executa testes compatíveis com a tecnologia identificada no alvo para economizar tempo.' }
    ],
    codeSample: `class CH_DetectionEngine:\n    def evaluate_rule(self, rule: Dict[str, Any], response: ResponseRecord) -> bool:\n        # Avalia árvores de condições declarativas (Status + Header + Regex no Body)\n        ...`
  },
  {
    id: 'ch-verify',
    code: 'CH-VERIFY',
    name: '11. VALIDATION ENGINE',
    stage: 'VALIDATION',
    category: 'Triangulação & Redução de Falsos Positivos',
    conceptReference: 'Motor diferencial de validação comportamental e eliminação de ruído',
    icon: CheckCircle2,
    badge: 'Triangulação Diferencial',
    problemSolved: 'Eliminar 99.8% dos falsos positivos comuns em scanners (páginas Soft 404, WAF challenges e variações dinâmicas).',
    ourImplementation: 'Triangulação comportamental: Requisição Baseline + Requisição de Controle (Inerte) + Requisição de Teste, calculando o Delta Real.',
    sharedContextInputs: ['Candidate Findings', 'Baseline Response State', 'Control Inactive Probe'],
    sharedContextOutputs: ['Confirmed Findings', 'Confidence Score (0.0 - 1.0)', 'False Positive Discards'],
    subCapabilities: [
      { name: 'Captura de Baseline', details: 'Registra o estado limpo original (hash SHA-256 do corpo, contagem de palavras e status inicial).' },
      { name: 'Hipótese de Vulnerabilidade', details: 'Formula a premissa de teste antes de disparar a sonda para medir a alteração real.' },
      { name: 'Requisição de Controle Inerte', details: 'Envia sonda aleatória inócua para verificar se o servidor reflete qualquer entrada arbitrária.' },
      { name: 'Cálculo de Delta & Confiança', details: 'Mede variação em bytes, códigos HTTP e tempo de resposta para gerar score de confiança.' },
      { name: 'Confirmação Determinística', details: 'Só eleva um achado para a lista oficial se a triangulação comprovar alteração real de comportamento.' },
      { name: 'Descarte de Soft 404 & WAFs', details: 'Identifica e descarta páginas que retornam 200 OK mas contêm texto de erro ou desafio WAF.' }
    ],
    codeSample: `class CH_ValidationEngine:\n    @staticmethod\n    def validate_differential(baseline, control, test) -> Dict[str, Any]:\n        if test.body == control.body or CH_ValidationEngine.is_soft_404(test):\n            return {"is_valid": False, "confidence": 0.1}\n        return {"is_valid": True, "confidence": 0.98}`
  },
  {
    id: 'ch-correlate',
    code: 'CH-CORRELATE',
    name: '12. CORRELATION ENGINE',
    stage: 'CORRELATION',
    category: 'Grafo Unificado & De-duplicação',
    conceptReference: 'Motor de correlação cross-engine e fusão de inteligência',
    icon: GitMerge,
    badge: 'Grafo de Contexto',
    problemSolved: 'Conectar observações isoladas de DNS, portas, headers e rotas em uma visão holística da superfície de ataque sem duplicatas.',
    ourImplementation: 'Grafo de ativos em memória com de-duplicação semântica e correlação cruzada entre camadas de rede e aplicação.',
    sharedContextInputs: ['DNS Observations', 'Open Port Observations', 'HTTP Findings', 'Tech Detections'],
    sharedContextOutputs: ['Consolidated Security Graph', 'Deduplicated Findings', 'Root-Cause Groups'],
    subCapabilities: [
      { name: 'Correlação DNS & Hosts', details: 'Vincula subdomínios descobertos aos endereços IPs e provedores de nuvem correspondentes.' },
      { name: 'Correlação de Rede & Serviços', details: 'Cruza portas abertas com os serviços HTTP/HTTPS ativos encontrados nelas.' },
      { name: 'Correlação HTTP & Crawler', details: 'Mapeia rotas de API descobertas pelo crawler aos cabeçalhos e métodos suportados.' },
      { name: 'Correlação de Tecnologias', details: 'Vincula vulnerabilidades conhecidas especificamente à stack e versões identificadas.' },
      { name: 'Fusão de Findings Correlatos', details: 'Agrupa múltiplos alertas do mesmo endpoint (ex: 3 headers ausentes) em um único nó acionável.' },
      { name: 'Redução de Ruído', details: 'Remove duplicações causadas por múltiplos aliases DNS ou domínios apontando para o mesmo IP.' }
    ],
    codeSample: `class CH_CorrelationEngine:\n    def correlate_campaign(self, campaign: Campaign) -> Campaign:\n        # Cruza observações de DNS, Portas, HTTP e Techs em nós consolidados\n        ...`
  },
  {
    id: 'ch-cwe',
    code: 'CH-CWE',
    name: '13. CWE ENGINE',
    stage: 'CORRELATION',
    category: 'Taxonomia MITRE CWE',
    conceptReference: 'Base de conhecimento e classificação oficial MITRE CWE Top 25',
    icon: Target,
    badge: 'MITRE CWE Top 25',
    problemSolved: 'Classificar achados com identificadores oficiais da matriz MITRE CWE, explicando fraquezas e causas raiz.',
    ourImplementation: 'Base de conhecimento relacional com taxonomia de fraquezas de software, impactos técnicos e guias de remediação.',
    sharedContextInputs: ['Confirmed Findings', 'Observed Vulnerability Patterns'],
    sharedContextOutputs: ['CWE Mapped Findings (CWE-693, CWE-200, etc.)', 'Root Cause Classifications', 'Remediation Steps'],
    subCapabilities: [
      { name: 'Classificação MITRE Oficial', details: 'Atribui IDs oficiais (CWE-693, CWE-200, CWE-548, CWE-319, CWE-346) a cada achado.' },
      { name: 'Relacionamento Hierárquico', details: 'Mapeia a relação entre fraquezas base (Pillar, Class, Base, Variant).' },
      { name: 'Vínculo com Evidências', details: 'Associa a teoria do CWE às requisições e respostas que comprovaram a existência da falha.' },
      { name: 'Diretrizes de Remediação', details: 'Gera recomendações técnicas precisas para desenvolvedores corrigirem o código-fonte.' }
    ],
    codeSample: `CWE_DATABASE = {\n    "CWE-693": {"title": "Protection Mechanism Failure", "owasp": "A05:2021-Security Misconfiguration"},\n    "CWE-200": {"title": "Exposure of Sensitive Information", "owasp": "A01:2021-Broken Access Control"}\n}`
  },
  {
    id: 'ch-owasp',
    code: 'CH-OWASP',
    name: '14. OWASP ENGINE',
    stage: 'CORRELATION',
    category: 'OWASP Top 10 & API Security',
    conceptReference: 'Mapeamento para OWASP Top 10 (2021/2025) e API Security Top 10',
    icon: ShieldCheck,
    badge: 'OWASP 2021 / 2025',
    problemSolved: 'Enquadrar vulnerabilidades nos frameworks regulatórios e relatórios de conformidade exigidos por auditorias corporativas.',
    ourImplementation: 'Mapeador bidirecional que traduz fraquezas técnicas em categorias OWASP Top 10 e OWASP API Security.',
    sharedContextInputs: ['CWE-Enriched Findings'],
    sharedContextOutputs: ['OWASP Top 10 Mappings', 'API Security Top 10 Flags', 'Compliance Alignment Matrix'],
    subCapabilities: [
      { name: 'Categorização OWASP Top 10', details: 'Enquadra achados em A01:Broken Access Control, A02:Cryptographic Failures, A05:Misconfiguration, etc.' },
      { name: 'OWASP API Security Top 10', details: 'Mapeia falhas de API para API1:BOLA, API2:Broken Authentication, API3:BOPLA, etc.' },
      { name: 'Contextualização Regulatória', details: 'Gera descritivos prontos para atendimento a normas ISO 27001, PCI-DSS e LGPD/GDPR.' },
      { name: 'Análise de Risco Corporativo', details: 'Calcula o impacto nos pilares de Confidencialidade, Integridade e Disponibilidade (CIA).' }
    ],
    codeSample: `class CH_OwaspEngine:\n    @staticmethod\n    def map_to_owasp(cwe_id: str) -> str:\n        # Mapeamento dinâmico para categorias OWASP 2021/2025\n        return CWE_DATABASE.get(cwe_id, {}).get("owasp", "A05:2021-Security Misconfiguration")`
  },
  {
    id: 'ch-impact',
    code: 'CH-IMPACT',
    name: '15. IMPACT ENGINE',
    stage: 'CORRELATION',
    category: 'Cálculo de Risco & CVSS v3.1',
    conceptReference: 'Motor matemático de risco, severidade e priorização de correção',
    icon: BarChart3,
    badge: 'CVSS v3.1 & Score Matemático',
    problemSolved: 'Calcular a severidade real e o risco matemático ponderado sem depender de opiniões subjetivas.',
    ourImplementation: 'Calculadora de vetor CVSS v3.1 completo e fórmula de Risco Matemático: `Risk = CVSS_Score × Confidence × Exposure_Factor`.',
    sharedContextInputs: ['Finding Metadata', 'Confidence Level', 'Asset Exposure State'],
    sharedContextOutputs: ['CVSS v3.1 Vector & Base Score', 'Mathematical Risk Score (0-10)', 'Action Priority Level'],
    subCapabilities: [
      { name: 'Análise de Exposição', details: 'Verifica se o ativo afetado é público na internet, restrito por VPN ou endpoint de teste.' },
      { name: 'Cálculo de Criticidade', details: 'Avalia a facilidade de exploração (Attack Vector) e privilégios necessários (PR:N vs PR:H).' },
      { name: 'Fator de Confiança Ponderado', details: 'Ajusta o score final multiplicando pela certeza do teste (evitando alarmes falsos no topo).' },
      { name: 'Priorização de Correção', details: 'Classifica ações em Imediata (P1), Alta (P2), Média (P3) ou Baixa (P4) para a equipe técnica.' }
    ],
    codeSample: `class CH_ImpactEngine:\n    @staticmethod\n    def compute_risk(cvss_score: float, confidence: float, exposure_factor: float = 1.0) -> float:\n        # Risco Matemático = CVSS * Confiança * Exposição\n        return round(cvss_score * confidence * exposure_factor, 2)`
  },
  {
    id: 'ch-evidence',
    code: 'CH-EVIDENCE',
    name: '16. EVIDENCE ENGINE',
    stage: 'EVIDENCE_REPORT',
    category: 'Cadeia de Evidências & PoC',
    conceptReference: 'Ledger imutável de provas de conceito compatível com HackerOne / Bugcrowd',
    icon: FileCheck2,
    badge: 'Ledger & Sanitização',
    problemSolved: 'Armazenar evidências completas e reprodutíveis, higienizando tokens e senhas antes de compartilhar o relatório.',
    ourImplementation: 'Ledger cronológico que anexa pares brutos de Request/Response, mascara dados sensíveis e gera comandos cURL em 1 clique.',
    sharedContextInputs: ['Validated Requests & Responses', 'Sensitive Header Mask Rules'],
    sharedContextOutputs: ['Immutable Chain of Evidence', 'Sanitized Headers', 'One-Click cURL Repros'],
    subCapabilities: [
      { name: 'Captura de Requests e Responses', details: 'Guarda o pacote HTTP exato que comprovou o achado para auditoria independente.' },
      { name: 'Higienização de Dados Sensíveis', details: 'Substitui cookies, tokens Bearer e API keys por `[REDACTED_BY_CYBER_HUNTER]`.' },
      { name: 'Observações Cronológicas', details: 'Registra a linha do tempo de cada interação ocorrida durante a campanha.' },
      { name: 'Provas Determinísticas (PoC)', details: 'Comprova a anomalia através de comparações de diff e snippets seguros.' },
      { name: 'Cadeia de Evidências Auditável', details: 'Garante a integridade e rastreabilidade total do relatório para equipes de segurança.' }
    ],
    codeSample: `class CH_EvidenceEngine:\n    @staticmethod\n    def sanitize_and_generate_curl(req: RequestRecord) -> str:\n        # Gera comando cURL limpo pronto para envio ao HackerOne/Bugcrowd\n        ...`
  },
  {
    id: 'ch-report',
    code: 'CH-REPORT',
    name: '17. REPORT ENGINE',
    stage: 'EVIDENCE_REPORT',
    category: 'Exportação Multi-Formato',
    conceptReference: 'Gerador de relatórios executivos, técnicos e streaming para SIEMs',
    icon: FileText,
    badge: 'MD / JSON / JSONL / HTML',
    problemSolved: 'Exportar relatórios técnicos e executivos sem necessidade de edição manual ou formatação pós-varredura.',
    ourImplementation: 'Exportador para Markdown (padrão Bugcrowd/HackerOne), JSON estruturado, JSONL para SIEM/Elasticsearch e HTML executivo.',
    sharedContextInputs: ['Complete Campaign Object', 'Target Format'],
    sharedContextOutputs: ['Markdown Report (.md)', 'JSON Schema File (.json)', 'SIEM JSONL Stream (.jsonl)', 'Executive HTML Dashboard'],
    subCapabilities: [
      { name: 'Exportador Markdown Profissional', details: 'Formata tabelas de risco, sumário executivo, CWEs, vetores CVSS e passos de reprodução.' },
      { name: 'JSON Estruturado para CI/CD', details: 'Exporta o grafo completo da campanha para integração em pipelines DevSecOps.' },
      { name: 'JSONL Streaming para SIEM', details: 'Gera linhas JSON compatíveis com ingestão direta no Splunk, Elasticsearch e Datadog.' },
      { name: 'Dashboard HTML Executivo', details: 'Visão executiva interativa com gráficos de postura de segurança e prioridades de correção.' },
      { name: 'Sumário Executivo para Decisores', details: 'Resumo com métricas de negócio, postura de risco e estimativas de impacto.' }
    ],
    codeSample: `class CH_ReportEngine:\n    @staticmethod\n    def to_markdown(campaign: Campaign) -> str:\n        # Gera relatório completo com sumário executivo e evidências detalhadas\n        ...`
  }
];

export default function CyberHunterArchitectureTree() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ch-net');
  const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [currentSimStep, setCurrentSimStep] = useState<string>('');
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const selectedBranch = ENGINES_17.find(b => b.id === selectedBranchId) || ENGINES_17[0];

  const filteredEngines = activeStageFilter === 'ALL' 
    ? ENGINES_17 
    : ENGINES_17.filter(e => e.stage === activeStageFilter);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('python3 cyber_hunter.py -u https://cyberhuntlab.com.br --full --i-have-authorization -o relatorio.md');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const runSimulation = () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    setSimulationProgress(5);
    setSimulatedLogs(['[CH-ORCHESTRATOR] Inicializando Esteira Autoral Unificada (ID: CAMP-7F4B01)...']);
    setCurrentSimStep('CH-ORCHESTRATOR: Inicializando Pipeline');

    const steps = [
      { p: 10, msg: '[CH-DNS] DNS Intelligence: 4 subdomínios identificados via logs passivos crt.sh e resolução DNS.', branch: 'ch-dns', step: 'CH-DNS: Descoberta de Superfície' },
      { p: 18, msg: '[CH-NET & CH-SPEEDNET] Sockets assíncronos: Portas 80, 443, 8080 abertas. Latência média: 28ms.', branch: 'ch-net', step: 'CH-NET: Port & Service Discovery' },
      { p: 28, msg: '[CH-HTTP] HTTP Intelligence: Handshake TLS 1.3 auditado. Servidor Nginx identificado.', branch: 'ch-http', step: 'CH-HTTP: Probing e Análise de Headers' },
      { p: 38, msg: '[CH-CRAWL] Web Discovery: 24 endpoints extraídos de scripts JS e tags HTML em stream.', branch: 'ch-crawl', step: 'CH-CRAWL: AST & Stream Crawling' },
      { p: 48, msg: '[CH-AUDIT] Web Audit: Detectado cabeçalho HSTS e Content-Security-Policy ausentes.', branch: 'ch-audit', step: 'CH-AUDIT: Auditoria de Configuração Web' },
      { p: 58, msg: '[CH-CONTENT & CH-FUZZ] Content Discovery: Verificados caminhos críticos (/.git, /.env, /swagger).', branch: 'ch-content', step: 'CH-CONTENT: Descoberta de Recursos' },
      { p: 68, msg: '[CH-APPSEC & CH-DETECT] Detection Engine: Regras declarativas avaliadas contra os endpoints.', branch: 'ch-detect', step: 'CH-DETECT: Avaliação de Regras Declarativas' },
      { p: 78, msg: '[CH-VERIFY] Validation Engine: Triangulação diferencial (Baseline vs Controle) confirmou anomalia real.', branch: 'ch-verify', step: 'CH-VERIFY: Eliminação de Falso Positivo' },
      { p: 88, msg: '[CH-CORRELATE, CH-CWE, CH-OWASP] Enriquecimento: Mapeado para CWE-693 e OWASP A05:2021.', branch: 'ch-cwe', step: 'CH-CORRELATE & INTELLIGENCE: MITRE & OWASP' },
      { p: 94, msg: '[CH-IMPACT & CH-EVIDENCE] Risco CVSS 5.3 calculado. Prova de conceito cURL gerada e sanitizada.', branch: 'ch-evidence', step: 'CH-IMPACT & EVIDENCE: Cadeia de Evidências' },
      { p: 100, msg: '[CH-REPORT] Relatório gerado com sucesso em Markdown (Bugcrowd VRT), JSON e JSONL!', branch: 'ch-report', step: 'CH-REPORT: Concluído com Sucesso' }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setSimulationProgress(s.p);
        setCurrentSimStep(s.step);
        setSelectedBranchId(s.branch);
        setSimulatedLogs(prev => [...prev, s.msg]);
        if (idx === steps.length - 1) {
          setSimulationRunning(false);
        }
      }, (idx + 1) * 650);
    });
  };

  return (
    <section id="arvore-funcional" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Arquitetura Autoral de 17 Motores Integrados</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            CYBER HUNTER ENGINE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400">Árvore de 17 Motores Autorais</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Todas as capacidades de segurança moderna reimplementadas do zero em <strong className="text-slate-200">17 motores nativos e independentes</strong>. Sem clones ou binários externos em Go/C, conectados por um único grafo de inteligência contínua sob o <strong className="text-emerald-400">CH-ORCHESTRATOR</strong>.
          </p>
        </div>

        {/* Master Orchestration Diagram */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Topologia de Orquestração Unificada (CH ORCHESTRATOR)</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/30">Contexto Compartilhado 100% Nativo</span>
          </div>

          {/* Graphical Flow representation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30">
              <div className="text-cyan-400 font-bold mb-1">1. DISCOVERY</div>
              <div className="text-[10px] text-slate-400">CH-DNS · CH-NET · CH-SPEEDNET · CH-CRAWL · CH-CONTENT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30">
              <div className="text-blue-400 font-bold mb-1">2. ANALYSIS</div>
              <div className="text-[10px] text-slate-400">CH-HTTP · CH-AUDIT · CH-FUZZ · CH-APPSEC</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30">
              <div className="text-purple-400 font-bold mb-1">3. VALIDATION</div>
              <div className="text-[10px] text-slate-400">CH-DETECT · CH-VERIFY</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
              <div className="text-amber-400 font-bold mb-1">4. CORRELATION</div>
              <div className="text-[10px] text-slate-400">CH-CORRELATE · CH-CWE · CH-OWASP</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30">
              <div className="text-rose-400 font-bold mb-1">5. IMPACT & RISK</div>
              <div className="text-[10px] text-slate-400">CH-IMPACT (CVSS v3.1)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold mb-1">6. EVIDENCE & REPORT</div>
              <div className="text-[10px] text-slate-400">CH-EVIDENCE · CH-REPORT</div>
            </div>
          </div>
        </div>

        {/* Live Simulation Sandbox */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-base sm:text-lg font-bold text-white">Simulador de Execução da Esteira (17 Motores)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Veja o fluxo de dados em tempo real passando pelos 17 motores autorais sem invocar ferramentas externas.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={runSimulation}
                disabled={simulationRunning}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
              >
                {simulationRunning ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Executando Esteira ({simulationProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Executar Campanha dos 17 Motores</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCopyCli}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                title="Copiar Comando CLI Oficial"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Copiar CLI</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Logs */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span>Status: <strong className="text-cyan-400">{currentSimStep || 'Pronto para execução'}</strong></span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 transition-all duration-300"
                style={{ width: `${simulationProgress}%` }}
              ></div>
            </div>

            {simulatedLogs.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 max-h-32 overflow-y-auto space-y-1">
                {simulatedLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs by Pipeline Stage */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveStageFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos os 17 Motores ({ENGINES_17.length})
          </button>
          <button
            onClick={() => setActiveStageFilter('DISCOVERY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'DISCOVERY'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            1. Discovery (5)
          </button>
          <button
            onClick={() => setActiveStageFilter('ANALYSIS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'ANALYSIS'
                ? 'bg-blue-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            2. Analysis (4)
          </button>
          <button
            onClick={() => setActiveStageFilter('VALIDATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'VALIDATION'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            3. Detection & Validation (2)
          </button>
          <button
            onClick={() => setActiveStageFilter('CORRELATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'CORRELATION'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            4. Correlation & Impact (4)
          </button>
          <button
            onClick={() => setActiveStageFilter('EVIDENCE_REPORT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeStageFilter === 'EVIDENCE_REPORT'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            5. Evidence & Report (2)
          </button>
        </div>

        {/* 17 Engines Interactive Tree Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 17 Engine Branch Selectors */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catálogo dos 17 Motores</span>
              <span className="text-[11px] font-mono text-emerald-400">100% Autoral em Python</span>
            </div>

            <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredEngines.map((branch) => {
                const IconComponent = branch.icon;
                const isSelected = selectedBranchId === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-slate-800/90 border-emerald-500/50 shadow-md' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400">{branch.code}</span>
                          <span className="text-xs font-bold text-white truncate">{branch.name.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{branch.category}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isSelected ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-950 text-slate-500'
                    }`}>
                      {branch.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Engine Inspection Card */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              
              {/* Header of Selected Engine */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                      {selectedBranch.code}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">{selectedBranch.category}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">{selectedBranch.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    {selectedBranch.conceptReference}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                  {selectedBranch.badge}
                </span>
              </div>

              {/* Problem Solved vs Our Implementation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Qual problema resolve?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedBranch.problemSolved}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Implementação Autoral</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedBranch.ourImplementation}
                  </p>
                </div>
              </div>

              {/* Shared Context Data Flow (Inputs & Outputs) */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 my-4 text-xs font-mono">
                <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fluxo no Grafo de Contexto Unificado:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Inputs Consumidos do Grafo:</span>
                    <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                      {selectedBranch.sharedContextInputs.map((inp, idx) => (
                        <li key={idx} className="truncate">{inp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-slate-500">Outputs Emitidos para o Grafo:</span>
                    <ul className="list-disc list-inside text-emerald-400 mt-1 space-y-0.5">
                      {selectedBranch.sharedContextOutputs.map((out, idx) => (
                        <li key={idx} className="truncate">{out}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sub-capabilities Breakdown */}
              <div className="my-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Capacidades Integradas ({selectedBranch.subCapabilities.length})</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Zero Dependência Externa</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedBranch.subCapabilities.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/70 hover:border-slate-700 transition">
                      <div className="text-xs font-bold text-white mb-0.5">{sub.name}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {sub.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Native Python Code Snippet */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>Implementação Autoral ({selectedBranch.code}.py):</span>
                  <span className="text-emerald-400">100% Nativo em Python</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  <pre>{selectedBranch.codeSample}</pre>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
