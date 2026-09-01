import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Target, 
  Bug, 
  Globe, 
  Layers, 
  Cpu, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  Workflow,
  Smartphone,
  Server
} from 'lucide-react';

export interface ArsenalUseCase {
  id: string;
  category: 'bugcrowd' | 'hackerone' | 'osint' | 'api_web' | 'devsecops' | 'termux_mobile' | 'ai_agents';
  title: string;
  platform: string;
  cweMapping: string[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
  impact: 'P1 - Crítico' | 'P2 - Alto' | 'P3 - Médio' | 'P4 - Baixo';
  description: string;
  command: string;
  workflowSteps: string[];
  targetScenarios: string;
}

export const ARSENAL_USE_CASES: ArsenalUseCase[] = [
  // 1. Bugcrowd Targets & VRT
  {
    id: 'bc-vrt-triage',
    category: 'bugcrowd',
    title: 'Auditoria de Escopo Bugcrowd VRT com Triagem de Vulnerabilidades',
    platform: 'Bugcrowd (VRT Standard)',
    cweMapping: ['CWE-200', 'CWE-693', 'CWE-352'],
    difficulty: 'Iniciante',
    impact: 'P2 - Alto',
    description: 'Varredura alinhada à taxonomia VRT da Bugcrowd, gerando evidências reprodutíveis para submissão imediata.',
    command: 'python cwe_discover.py -u https://target-program.com --i-have-authorization --format markdown -o bugcrowd_submission.md --delay 0.4',
    workflowSteps: [
      'Validação de subdomínios in-scope fornecidos no briefing da Bugcrowd',
      'Crawling passivo com delay 0.4s para evitar bloqueio por WAF Akamai/Cloudflare',
      'Mapeamento de ausência de headers defensivos e vazamentos de credenciais',
      'Geração do relatório em Markdown pronto para colagem no dashboard da Bugcrowd'
    ],
    targetScenarios: 'Programas de Bug Bounty públicos e privados na Bugcrowd (Web Applications & APIs)'
  },
  {
    id: 'bc-subdomain-takeover-ct',
    category: 'bugcrowd',
    title: 'Descoberta de Subdomínios Órfãos & CNAMEs Suscetíveis a Takeover',
    platform: 'Bugcrowd / Wildcard Scope',
    cweMapping: ['CWE-200', 'CWE-284'],
    difficulty: 'Intermediário',
    impact: 'P1 - Crítico',
    description: 'Identifica subdomínios desativados que apontam para serviços externos em nuvem (S3, GitHub Pages, Azure) sem registro.',
    command: 'python cwe_discover.py -u alvo.com --subdomains --probe --i-have-authorization --format json -o takeovers.json',
    workflowSteps: [
      'Consulta aos logs de Certificate Transparency crt.sh e AlienVault OTX nativamente',
      'Resolução de DNS em tempo real para verificar hosts com erro NXDOMAIN',
      'Probing HTTP para detectar respostas "NoSuchBucket" ou "404 Not Found" de provedores SaaS',
      'Mapeamento de evidências de controle de domínio'
    ],
    targetScenarios: 'Programas com escopo wildcard (*.empresa.com)'
  },
  {
    id: 'bc-sensitive-dumps',
    category: 'bugcrowd',
    title: 'Caça a Backups de Produção e Arquivos .env Expostos (.sql.gz, .zip)',
    platform: 'Bugcrowd / HackerOne',
    cweMapping: ['CWE-200', 'CWE-552'],
    difficulty: 'Iniciante',
    impact: 'P1 - Crítico',
    description: 'Motor nativo de regras declarativas para identificar dumps de banco de dados e segredos esquecidos em servidores.',
    command: 'python cwe_discover.py -u https://alvo.com --rules --i-have-authorization -v -o sensitive_findings.md',
    workflowSteps: [
      'Execução dos matchers nativos em caminhos comuns (/.env, /backup.zip, /db.sql)',
      'Supressão de falsos positivos através de checagem do content-type e status code',
      'Cálculo automático do Risk Score (Severidade 8.0 × Confiança 0.95 = 7.60)',
      'Geração de PoC curl para anexar no relatório'
    ],
    targetScenarios: 'Aplicações legadas, ambientes de staging e servidores PHP/Node recém-migrados'
  },

  // 2. HackerOne Program Rules
  {
    id: 'h1-triage-report',
    category: 'hackerone',
    title: 'Relatório Executivo Pronto para Submissão no HackerOne',
    platform: 'HackerOne (H1 Reports)',
    cweMapping: ['CWE-79', 'CWE-200', 'CWE-693', 'CWE-22'],
    difficulty: 'Intermediário',
    impact: 'P2 - Alto',
    description: 'Exporta o formato padronizado com Summary, Steps to Reproduce, Impact e CVSS Calculator pronto para os triagers do HackerOne.',
    command: 'python cwe_discover.py -u https://h1-target.com --i-have-authorization --format hackerone -o h1_report.md',
    workflowSteps: [
      'Descoberta de superfícies e mapeamento de fraquezas arquiteturais',
      'Estruturação com tags de impacto de negócio e passos numerados de PoC',
      'Associação oficial do identificador CWE para aceleração da triagem humana',
      'Cópia direta do Markdown para a caixa de submissão do H1'
    ],
    targetScenarios: 'Programas corporativos na HackerOne com SLA rápido de resposta'
  },
  {
    id: 'h1-multiagent-pipeline',
    category: 'hackerone',
    title: 'Pipeline Multiagente Evidence-First de Validação para HackerOne',
    platform: 'HackerOne / Synack',
    cweMapping: ['CWE-200', 'CWE-693', 'CWE-352'],
    difficulty: 'Avançado',
    impact: 'P1 - Crítico',
    description: 'Aciona os agentes Discovery, Evidence Validator e Risk Scoring para auditar achados e descartar 100% dos falsos positivos.',
    command: 'python cwe_discover.py -u https://h1-target.com --agents --mode authorized_active --scope-file examples/scope_example.json --i-have-authorization',
    workflowSteps: [
      'Agente de Descoberta mapeia todos os endpoints e cabeçalhos',
      'Agente Validador de Evidências replica as requisições HTTP e calcula a consistência',
      'Agente de Risco pontua a severidade matemática de 0.0 a 10.0',
      'Geração do JSON estruturado scan_agents.json para auditoria auditável'
    ],
    targetScenarios: 'Programas de alto valor com regras estritas contra spam ou relatórios sem impacto demonstrado'
  },

  // 3. OSINT & Reconhecimento Passivo
  {
    id: 'osint-ct-wayback-crawl',
    category: 'osint',
    title: 'Reconhecimento Passivo Total via CT Logs e Wayback Machine',
    platform: 'OSINT / EASM / Recon',
    cweMapping: ['CWE-200'],
    difficulty: 'Iniciante',
    impact: 'P3 - Médio',
    description: 'Mapeamento massivo de subdomínios e rotas antigas sem enviar 1 único pacote intrusivo ao servidor da vítima.',
    command: 'python cwe_discover.py -u empresa.com --subdomains --i-have-authorization --format json -o osint_map.json',
    workflowSteps: [
      'Consulta a registros históricos de certificados SSL na API crt.sh',
      'Extração de URLs indexadas no passado pelo Wayback Machine (GAU style)',
      'Cruzamento de fontes públicas com AlienVault OTX e HackerTarget',
      'Filtragem de hostnames ativos com resolução assíncrona de DNS'
    ],
    targetScenarios: 'Fase inicial de reconnaissance em programas Bug Bounty e testes de invasão Red Team'
  },
  {
    id: 'osint-tech-fingerprint',
    category: 'osint',
    title: 'Fingerprinting de Stack Tecnológica & WAF sem httpx Externo',
    platform: 'OSINT / Web Probing',
    cweMapping: ['CWE-693'],
    difficulty: 'Iniciante',
    impact: 'P4 - Baixo',
    description: 'Descobre Nginx, Apache, React, Laravel, WordPress, Django e WAFs analisando headers, cookies e hashes.',
    command: 'python cwe_discover.py -u https://alvo.com --probe --i-have-authorization -v',
    workflowSteps: [
      'Envio de probe HTTP rápido com medição de latência e extração de título',
      'Inspeção do cabeçalho Server e X-Powered-By contra 15+ assinaturas nativas',
      'Detecção de cookies de sessão identificadores (laravel_session, csrftoken)',
      'Auditoria de conformidade de cabeçalhos de segurança (CSP, HSTS, X-Frame-Options)'
    ],
    targetScenarios: 'Mapeamento de alvos com tecnologias vulneráveis conhecidas'
  },

  // 4. Web, APIs & Pentest Profundo
  {
    id: 'api-rest-extractor-js',
    category: 'api_web',
    title: 'Mineração de Rotas de API Ocultas em Arquivos JavaScript',
    platform: 'Web & API Pentest',
    cweMapping: ['CWE-200', 'CWE-651'],
    difficulty: 'Intermediário',
    impact: 'P2 - Alto',
    description: 'Varre o código-fonte de scripts JS (.js, bundles Webpack) procurando rotas /api/v1, /admin e parâmetros sensíveis.',
    command: 'python cwe_discover.py -u https://alvo.com --crawl-native --i-have-authorization --max-depth 3',
    workflowSteps: [
      'Download e parsing de todas as tags <script src="..."> encontradas',
      'Expressões regulares para identificar chamadas fetch(), axios e rotas REST',
      'Mineração de parâmetros propensos a injeções (?file=, ?redirect=, ?token=)',
      'Identificação de formulários HTML desprotegidos contra CSRF (CWE-352)'
    ],
    targetScenarios: 'Single Page Applications (React, Vue, Angular, Next.js)'
  },
  {
    id: 'web-swagger-graphql-audit',
    category: 'api_web',
    title: 'Detecção de Interfaces Swagger, OpenAPI e GraphQL Não Autenticadas',
    platform: 'API Security / Pentest',
    cweMapping: ['CWE-651', 'CWE-200'],
    difficulty: 'Iniciante',
    impact: 'P2 - Alto',
    description: 'Localiza endpoints de catálogo de APIs (/swagger-ui.html, /v2/api-docs, /graphql) expostos na internet pública.',
    command: 'python cwe_discover.py -u https://alvo.com --rules --i-have-authorization --format markdown -o api_findings.md',
    workflowSteps: [
      'Varredura dos caminhos declarativos de documentação de APIs',
      'Validação de resposta JSON de esquemas OpenAPI',
      'Verificação de introspecção aberta em endpoints GraphQL',
      'Mapeamento de rotas administrativas não autorizadas'
    ],
    targetScenarios: 'Backends em Spring Boot, Fastify, NestJS e Django REST Framework'
  },
  {
    id: 'web-csrf-forms-audit',
    category: 'api_web',
    title: 'Auditoria de Ações de Escrita sem Token Anti-CSRF (CWE-352)',
    platform: 'Web Security / OWASP',
    cweMapping: ['CWE-352'],
    difficulty: 'Intermediário',
    impact: 'P2 - Alto',
    description: 'Inspeciona todos os formulários POST da aplicação web e aponta quais não possuem tokens de sincronismo.',
    command: 'python cwe_discover.py -u https://alvo.com --crawl-native --i-have-authorization --max-urls 100',
    workflowSteps: [
      'Extração estruturada de todas as tags <form method="POST">',
      'Análise de inputs hidden procurando por csrf, xsrf, _token ou authToken',
      'Alerta imediato para formulários sensíveis de troca de senha e configurações',
      'Geração de relatório técnico com o snippet do formulário afetado'
    ],
    targetScenarios: 'Portais de clientes, painéis administrativos e sistemas de e-commerce'
  },

  // 5. DevSecOps & CI/CD Pipelines
  {
    id: 'devsecops-github-actions',
    category: 'devsecops',
    title: 'Integração no GitHub Actions como Quality Gate de Segurança',
    platform: 'DevSecOps / CI/CD',
    cweMapping: ['CWE-200', 'CWE-693', 'CWE-352'],
    difficulty: 'Intermediário',
    impact: 'P2 - Alto',
    description: 'Executa a suite em pipelines de deploy automático para bloquear builds com exposição de .env ou ausência de CSP.',
    command: 'python cwe_discover.py -u http://localhost:3000 --rules --probe --i-have-authorization --format json -o ci_report.json',
    workflowSteps: [
      'Inclusão do script no workflow .github/workflows/security.yml',
      'Execução contra a URL de staging ou container de teste',
      'Verificação do código de saída (exit code) baseado no Risk Score',
      'Bloqueio do merge se forem detectados achados de severidade ALTO/CRÍTICO'
    ],
    targetScenarios: 'Pipelines CI/CD em GitHub Actions, GitLab CI, Jenkins e Bitbucket Pipelines'
  },
  {
    id: 'devsecops-gdrive-sync',
    category: 'devsecops',
    title: 'Backup e Sincronização Automática de Relatórios no Google Drive',
    platform: 'Enterprise DevSecOps',
    cweMapping: ['CWE-200'],
    difficulty: 'Avançado',
    impact: 'P3 - Médio',
    description: 'Envio seguro dos relatórios de varredura criptografados para uma pasta compartilhada no Google Workspace via OAuth2.',
    command: 'python gdrive_integration.py --upload cwe_report.md --folder-id "SECURITY_REPORTS_DIR"',
    workflowSteps: [
      'Geração do relatório final no formato Markdown ou HTML corporativo',
      'Autenticação segura client-side/server-side via credenciais OAuth',
      'Upload com versionamento e timestamp para a pasta de auditoria',
      'Disponibilização do link direto para o time de segurança defensiva'
    ],
    targetScenarios: 'Times de auditoria interna, MSSPs e consultorias de cibersegurança'
  },

  // 6. Mobile Bug Hunting & Termux
  {
    id: 'termux-low-battery-recon',
    category: 'termux_mobile',
    title: 'Caça de Vulnerabilidades no Android via Termux com Baixo Consumo',
    platform: 'Termux Android / Mobile',
    cweMapping: ['CWE-200', 'CWE-693'],
    difficulty: 'Iniciante',
    impact: 'P2 - Alto',
    description: 'Varredura otimizada para conexões 4G/5G no celular, sem aquecimento do aparelho e sem consumo excessivo de dados.',
    command: 'python cwe_discover.py -u https://alvo.com --subdomains --probe --delay 0.8 --max-urls 30 --i-have-authorization',
    workflowSteps: [
      'Instalação com 1 comando: pkg install python git && git clone ...',
      'Execução leve em Python puro sem necessidade de compilar binários Go',
      'Delay de 0.8s para evitar limites de taxa em operadoras móveis',
      'Relatório direto na tela com cores ANSI legíveis no terminal do smartphone'
    ],
    targetScenarios: 'Bug hunters que trabalham pelo smartphone ou tablet em qualquer lugar'
  },

  // 7. Multiagentes de IA & Triagem
  {
    id: 'ai-agents-false-positive-killer',
    category: 'ai_agents',
    title: 'Eliminador de Falsos Positivos com Triagem Multiagente Evidence-First',
    platform: 'AI Studio / Autonomous Agents',
    cweMapping: ['CWE-200', 'CWE-693', 'CWE-22', 'CWE-352'],
    difficulty: 'Avançado',
    impact: 'P1 - Crítico',
    description: 'Rede de 3 agentes que cruzam respostas HTTP, descartam páginas 404 disfarçadas e geram justificativas técnicas.',
    command: 'python cwe_discover.py -u https://alvo.com --agents --mode safe --i-have-authorization --agents-output triage.json',
    workflowSteps: [
      'Agente 1 (Discovery): Identifica superfícies e anomalias de resposta',
      'Agente 2 (Evidence Validator): Executa requests de controle para descartar Soft-404',
      'Agente 3 (Risk Calculator): Aplica a fórmula matemática de Risco = Severidade × Confiança',
      'Entrega do dossiê com comprovação irrefutável de vulnerabilidade'
    ],
    targetScenarios: 'Programas com penalidade para relatórios inválidos (reputação no HackerOne/Bugcrowd)'
  }
];

export default function ArsenalCapabilitiesCatalog({ onSelectCommand }: { onSelectCommand?: (cmd: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas as 20k Possibilidades', icon: Sparkles, count: ARSENAL_USE_CASES.length },
    { id: 'bugcrowd', label: 'Bugcrowd & VRT', icon: Target, count: ARSENAL_USE_CASES.filter(c => c.category === 'bugcrowd').length },
    { id: 'hackerone', label: 'HackerOne Reports', icon: Bug, count: ARSENAL_USE_CASES.filter(c => c.category === 'hackerone').length },
    { id: 'osint', label: 'OSINT & Subdomínios', icon: Globe, count: ARSENAL_USE_CASES.filter(c => c.category === 'osint').length },
    { id: 'api_web', label: 'Web & API Pentest', icon: Code2, count: ARSENAL_USE_CASES.filter(c => c.category === 'api_web').length },
    { id: 'devsecops', label: 'DevSecOps & CI/CD', icon: Workflow, count: ARSENAL_USE_CASES.filter(c => c.category === 'devsecops').length },
    { id: 'termux_mobile', label: 'Termux & Mobile Hunting', icon: Smartphone, count: ARSENAL_USE_CASES.filter(c => c.category === 'termux_mobile').length },
    { id: 'ai_agents', label: 'Agentes de IA & Triagem', icon: Cpu, count: ARSENAL_USE_CASES.filter(c => c.category === 'ai_agents').length }
  ];

  const filteredUseCases = useMemo(() => {
    return ARSENAL_USE_CASES.filter(uc => {
      const matchCat = selectedCategory === 'all' || uc.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        uc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.cweMapping.some(cwe => cwe.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="arsenal-biblioteca" className="py-10 sm:py-16 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-mono text-emerald-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>BIBLIOTECA COMPLETA DE CASOS DE USO & ARSENAL DE COMANDOS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              20 Mil Coisas que Você Pode Fazer com a Suite
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
              Catálogo interativo com fluxos prontos para <span className="text-cyan-400 font-semibold font-mono">Bugcrowd</span>, <span className="text-emerald-400 font-semibold font-mono">HackerOne</span>, <span className="text-fuchsia-400 font-semibold font-mono">Intigriti</span>, <span className="text-amber-400 font-semibold font-mono">Synack</span>, automações CI/CD, auditoria de APIs e caça mobile no Termux.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{filteredUseCases.length} Fluxos Filtrados</span>
            </span>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar caso de uso (ex: Bugcrowd, .env, Token CSRF, Subdomínios, Termux, CWE-200)..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>

          {/* Categories Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-950 text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Use Cases Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUseCases.map((uc) => {
            const isExpanded = expandedId === uc.id;
            return (
              <div 
                key={uc.id}
                className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition shadow-lg"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-cyan-400">
                        {uc.platform}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        uc.impact.startsWith('P1') ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        uc.impact.startsWith('P2') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {uc.impact}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {uc.cweMapping.map((cwe, cIdx) => (
                        <span key={cIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {cwe}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {uc.description}
                  </p>
                </div>

                {/* Command Snippet with Copy */}
                <div className="space-y-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
                    <code className="text-emerald-300 truncate text-[11px]">
                      {uc.command}
                    </code>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(uc.command, uc.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                        title="Copiar Comando"
                      >
                        {copiedId === uc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expand Workflow Steps */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : uc.id)}
                      className="text-slate-400 hover:text-cyan-400 transition flex items-center gap-1"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                      <span>{isExpanded ? 'Ocultar Passo a Passo' : 'Ver Workflow Passo a Passo'}</span>
                    </button>
                    <span className="text-[11px] text-slate-500">Nível: {uc.difficulty}</span>
                  </div>

                  {/* Expanded Workflow Detail */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono text-slate-300 font-bold">
                        Etapas do Pipeline de Execução:
                      </div>
                      <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/50">
                        {uc.workflowSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                            <span className="text-cyan-400 font-mono font-bold">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 pt-1">
                        🎯 <span className="text-slate-400">Cenário Ideal:</span> {uc.targetScenarios}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Pro Tip Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-mono">
                Monte Qualquer Combinação Customizada em 1 Clique
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Você pode utilizar os seletores abaixo no gerador oficial de comandos para ajustar alvos, profundidade, delays e flags autônomas nativas.
              </p>
            </div>
          </div>
          <a
            href="#comandos-cli"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition shadow-lg shadow-emerald-500/20 shrink-0 flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Abrir Gerador Oficial</span>
          </a>
        </div>

      </div>
    </section>
  );
}
