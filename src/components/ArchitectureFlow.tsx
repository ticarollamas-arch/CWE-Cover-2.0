import React, { useState } from 'react';
import { 
  Network, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Activity, 
  Compass, 
  Camera, 
  FileCode, 
  ShieldCheck, 
  Database, 
  Cpu, 
  FileText,
  Copy,
  Check,
  Terminal,
  Layers,
  FolderTree,
  Sparkles
} from 'lucide-react';

interface ModuleNode {
  id: string;
  name: string;
  category: string;
  icon: any;
  badge: string;
  badgeColor: string;
  description: string;
  pythonModule: string;
  inputs: string[];
  outputs: string[];
  features: string[];
  cliFlag: string;
}

const MODULES_TREE: ModuleNode[] = [
  {
    id: 'asset-discovery-osint',
    name: 'Asset Discovery / OSINT',
    category: 'Reconhecimento de Superfície',
    icon: Globe,
    badge: 'PASSIVE RECON',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Enumeração passiva de subdomínios via Certificate Transparency (crt.sh), Wayback Machine CDX API e AlienVault OTX com validação DNS concorrente nativa.',
    pythonModule: 'recon/subdomains.py',
    inputs: ['Domínio Raiz (ex: alvo.com.br)', 'Lista de Domínios'],
    outputs: ['Lista de Subdomínios Ativos', 'Registros DNS IP/CNAME', 'Mapeamento de Hostnames'],
    features: [
      'Zero pacotes intrusivos ao alvo (100% passivo)',
      'Resolução assíncrona de socket DNS',
      'Detecção de subdomínios órfãos para takeover'
    ],
    cliFlag: '--subdomains'
  },
  {
    id: 'http-analysis',
    name: 'HTTP Analysis & Probing',
    category: 'Probing HTTP & Fingerprinting',
    icon: Activity,
    badge: 'HTTP PROBER',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Sondagem HTTP/HTTPS de alta velocidade, inspeção de latência, códigos de status, títulos HTML e detecção de mais de 15 stacks tecnológicas e WAFs.',
    pythonModule: 'recon/http_probe.py',
    inputs: ['Hosts descobertos', 'Portas 80, 443, 8080, 8443'],
    outputs: ['Status HTTP (200, 301, 403, 500)', 'Stack Tecnológica', 'Headers de Segurança Ausentes'],
    features: [
      'Medição precisa de Round-Trip Time (ms)',
      'Fingerprint de Nginx, Cloudflare, React, Django',
      'Auditoria instantânea de CWE-693 (CSP, HSTS, X-Frame)'
    ],
    cliFlag: '--probe'
  },
  {
    id: 'web-crawling',
    name: 'Web Crawling & Routing',
    category: 'Mapeamento de Rotas & JS',
    icon: Compass,
    badge: 'DEEP CRAWLER',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Navegação passiva e recursiva de endpoints, parsing de scripts JavaScript (.js), mineração de parâmetros de alto risco e formulários sem CSRF.',
    pythonModule: 'crawler/extractor.py & crawler/crawler.py',
    inputs: ['URLs Ativas', 'Profundidade (--max-depth)', 'Limite (--max-urls)'],
    outputs: ['Árvore de Rotas da Aplicação', 'Rotas de APIs REST / GraphQL', 'Formulários POST Desprotegidos'],
    features: [
      'Regex inteligente para extração de fetch(), axios e AJAX',
      'Mineração de parâmetros propensos a injeção (?file=, ?token=)',
      'Identificação de formulários sem token anti-CSRF (CWE-352)'
    ],
    cliFlag: '--crawl-native'
  },
  {
    id: 'visual-evidence',
    name: 'Visual Evidence & Snapshots',
    category: 'Evidência Visual & Headless',
    icon: Camera,
    badge: 'VISUAL CAPTURE',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Captura de snapshots visuais do DOM e renderização gráfica de telas para inclusão direta de evidências visuais em relatórios de Bug Bounty.',
    pythonModule: 'reporters/visual_snapshots.py',
    inputs: ['Endpoints HTTP 200/302', 'Painéis Administrativos', 'Erros de Aplicação'],
    outputs: ['Imagens PNG de Evidência', 'Galeria de Thumbnails', 'Relatório HTML Visual Integrado'],
    features: [
      'Geração de evidência fotográfica para triagers',
      'Agrupamento visual por similaridade de layout',
      'Salvamento automático no diretório screenshots/'
    ],
    cliFlag: '--screenshots / --visual-report'
  },
  {
    id: 'declarative-rules',
    name: 'Detection & Declarative Rules',
    category: 'Motor Declarativo de Regras',
    icon: FileCode,
    badge: 'DECLARATIVE ENGINE',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description: 'Interpretador nativo em Python de regras declarativas (JSON/YAML) com matchers por status code, palavras-chave (AND/OR), regex e operadores negativos.',
    pythonModule: 'engine/matcher.py',
    inputs: ['Diretório de Regras', 'Catálogo de Vulnerabilidades Conhecidas'],
    outputs: ['Achados Correspondentes', 'PoC de Requisição e Resposta', 'Classificação de Severidade'],
    features: [
      'Compatível com assinaturas declarativas de mercado',
      'Zero dependência de binário Go externo',
      'Matchings para .env, .git, backups, swagger e paths sensíveis'
    ],
    cliFlag: '--rules / --standalone-all'
  },
  {
    id: 'cwe-matcher',
    name: 'CWE Matcher',
    category: 'Taxonomia & Normalização',
    icon: ShieldCheck,
    badge: 'MITRE CWE TAXONOMY',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Mapeador determinístico da taxonomia MITRE CWE (CWE-200, CWE-693, CWE-352, CWE-22, CWE-79, CWE-284) com correlação direta à VRT da Bugcrowd e CVSS v3.1.',
    pythonModule: 'detectors/*.py & core/risk.py',
    inputs: ['Sinais HTTP brutos', 'Parâmetros minerados', 'Headers inspecionados'],
    outputs: ['Identificador CWE Oficial', 'Pontuação CVSS Base', 'Impacto na Bugcrowd VRT'],
    features: [
      'Classificação sem ambiguidade semântica',
      'Cálculo de Risk Score: Risco = Severidade × Confiança',
      'Filtragem automática de informacionais de baixo risco'
    ],
    cliFlag: '--cwe-filter'
  },
  {
    id: 'evidence-collector',
    name: 'Evidence Collector',
    category: 'Coleta Estruturada de Provas',
    icon: Database,
    badge: 'EVIDENCE-FIRST',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    description: 'Coleta forense de requisições, headers brutos, snippets de resposta, códigos de erro e timestamps para garantir que 100% dos achados sejam reproduzíveis.',
    pythonModule: 'core/evidence_collector.py',
    inputs: ['Fluxo de Respostas HTTP', 'Headers e Cookies', 'Snippets de Código Afetado'],
    outputs: ['Dossiê de Evidências', 'Comandos curl de Reprodução', 'Hashes Criptográficos de Prova'],
    features: [
      'Geração de curl prontos para colar no relatório',
      'Armazenamento de payloads de resposta sem truncamento crítico',
      'Prevenção de relatórios rejeitados por falta de evidência'
    ],
    cliFlag: '--verbose / -v'
  },
  {
    id: 'validation-agent',
    name: 'Validation Agent',
    category: 'Auditoria & Triagem Autônoma',
    icon: Cpu,
    badge: 'MULTI-AGENT IA',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    description: 'Camada de agentes (CrewAI / Gemini) que cruza as evidências, valida limites de escopo e descarta 100% de páginas 404 disfarçadas (Soft-404) e falsos positivos.',
    pythonModule: 'agents/validation_agent.py & orchestrator.py',
    inputs: ['Dossiê de Evidências', 'Arquivo de Escopo (--scope-file)', 'Modo (--mode)'],
    outputs: ['Status Confirmado / Rejeitado', 'Grau de Confiança (0.0 a 1.0)', 'Justificativa Técnica'],
    features: [
      'Escada rigorosa: INFO → OBSERVATION → HYPOTHESIS → CONFIRMED',
      'Proteção da reputação do pesquisador no HackerOne/Bugcrowd',
      'Auditoria de conformidade com regras do programa'
    ],
    cliFlag: '--agents --mode authorized_active'
  },
  {
    id: 'report-engine',
    name: 'Report Engine (JSON / Markdown / HTML / Screenshots)',
    category: 'Geração & Exportação de Relatórios',
    icon: FileText,
    badge: 'MULTI-FORMAT EXPORTER',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    description: 'Motor universal de renderização de relatórios nos formatos Markdown (HackerOne/Bugcrowd), JSON estruturado para CI/CD, HTML interativo com galeria de screenshots.',
    pythonModule: 'reporters/report_generator.py',
    inputs: ['Achados Validados', 'Dossiê Forense', 'Diretório screenshots/'],
    outputs: ['relatorio.md', 'relatorio.json', 'relatorio.html', 'screenshots/*.png'],
    features: [
      'Markdown estruturado com Summary, Steps e CVSS',
      'JSON compatível com pipelines DevSecOps no GitHub Actions',
      'HTML autônomo com modo escuro e filtros interativos'
    ],
    cliFlag: '--format markdown | hackerone | json | html'
  }
];

export default function ArchitectureFlow() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('asset-discovery-osint');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const selectedModule = MODULES_TREE.find(m => m.id === selectedModuleId) || MODULES_TREE[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const asciiTree = `CWE-Cover-2.0
│
├── Asset Discovery / OSINT
├── HTTP Analysis / Probing
├── Web Crawling / DOM & JS
├── Visual Evidence / Snapshots
├── Detection / Declarative Rules
├── CWE & OWASP Matcher
├── Evidence Collector
├── Validation Agent
└── Report Engine
       ├── JSON / JSONL
       ├── Markdown (HackerOne/Bugcrowd)
       ├── HTML Visual Interativo
       └── screenshots/`;

  return (
    <section id="arquitetura" className="py-10 sm:py-16 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-mono text-emerald-400 mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>ARQUITETURA MODULAR & FLUXO DE EXECUÇÃO DA SUITE</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
            Árvore Arquitetural do CWE-Cover 2.0
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
            Estrutura desacoplada em 9 motores nativos integrados, operando sob o princípio <span className="text-emerald-400 font-semibold font-mono">Evidence-First</span> com geração de relatórios e evidências visuais.
          </p>
        </div>

        {/* Tree ASCII Visual Card */}
        <div className="mb-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                Diagrama Oficial da Hierarquia Modular
              </span>
            </div>
            <button
              onClick={() => handleCopy(asciiTree, 'ascii-tree')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition flex items-center gap-1.5"
            >
              {copiedText === 'ascii-tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'ascii-tree' ? 'Árvore Copiada!' : 'Copiar Diagrama ASCII'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
            {/* ASCII Preview */}
            <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed overflow-x-auto selection:bg-emerald-500 selection:text-slate-950">
              <pre className="text-slate-300 font-mono">
                <span className="text-emerald-400 font-bold">CWE-Cover-2.0</span>{'\n'}
                <span className="text-slate-600">│</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-cyan-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('asset-discovery-osint')}>Asset Discovery / OSINT</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-emerald-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('http-analysis')}>HTTP Analysis / Probing</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-purple-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('web-crawling')}>Web Crawling / DOM & JS</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-amber-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('visual-evidence')}>Visual Evidence / Snapshots</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-rose-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('declarative-rules')}>Detection / Declarative Rules</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-emerald-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('cwe-matcher')}>CWE matcher</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('evidence-collector')}>Evidence Collector</span>{'\n'}
                <span className="text-slate-600">├── </span><span className="text-fuchsia-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('validation-agent')}>Validation Agent</span>{'\n'}
                <span className="text-slate-600">└── </span><span className="text-teal-400 hover:underline cursor-pointer" onClick={() => setSelectedModuleId('report-engine')}>Report Engine</span>{'\n'}
                <span className="text-slate-600">       ├── </span><span className="text-slate-400">JSON</span>{'\n'}
                <span className="text-slate-600">       ├── </span><span className="text-slate-400">Markdown</span>{'\n'}
                <span className="text-slate-600">       ├── </span><span className="text-slate-400">HTML</span>{'\n'}
                <span className="text-slate-600">       └── </span><span className="text-amber-400 font-bold">screenshots/</span>
              </pre>
            </div>

            {/* Quick Interactive Selector */}
            <div className="lg:col-span-6 space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Clique em um módulo para inspecionar:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MODULES_TREE.map((mod) => {
                  const Icon = mod.icon;
                  const isSelected = selectedModuleId === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                        isSelected
                          ? 'bg-slate-950 border-emerald-500 shadow-md shadow-emerald-500/10 text-slate-100 ring-1 ring-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-mono font-semibold truncate">{mod.name.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Module Deep Dive Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 shadow-inner">
                {React.createElement(selectedModule.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${selectedModule.badgeColor}`}>
                    {selectedModule.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedModule.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-100 font-mono">
                  {selectedModule.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>{selectedModule.cliFlag}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Col: Description & Features */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedModule.description}
              </p>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  Recursos & Diferenciais Nativos:
                </h4>
                <div className="space-y-2">
                  {selectedModule.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: I/O Pipeline & Code Module */}
            <div className="lg:col-span-5 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block mb-1">// Arquivo do Módulo Python</span>
                <div className="text-emerald-400 font-bold text-xs truncate bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {selectedModule.pythonModule}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Entradas (Inputs):</span>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {selectedModule.inputs.map((inp, iIdx) => (
                      <li key={iIdx} className="truncate">• {inp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Saídas (Outputs):</span>
                  <ul className="space-y-1 text-[11px] text-cyan-300">
                    {selectedModule.outputs.map((out, oIdx) => (
                      <li key={oIdx} className="truncate">• {out}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
