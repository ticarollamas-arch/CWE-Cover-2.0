import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  Code, 
  Sliders, 
  Globe,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Target,
  Bug,
  Smartphone,
  Workflow,
  Zap,
  CheckCircle2,
  FileCode
} from 'lucide-react';

interface PresetConfig {
  id: string;
  name: string;
  badge: string;
  icon: any;
  platform: 'Bugcrowd' | 'HackerOne' | 'Intigriti' | 'Synack' | 'YesWeHack' | 'DevSecOps' | 'Termux' | 'OSINT';
  description: string;
  targetUrl: string;
  format: 'hackerone' | 'markdown' | 'json' | 'csv' | 'html';
  outputFile: string;
  maxDepth: number;
  maxUrls: number;
  delay: number;
  verbose: boolean;
  hasAuth: boolean;
  useAgents: boolean;
  agentMode: 'passive' | 'safe' | 'authorized_active' | 'lab';
  scopeFile: string;
  subdomains: boolean;
  probe: boolean;
  rules: boolean;
  crawlNative: boolean;
  standaloneAll: boolean;
}

const PRESETS: PresetConfig[] = [
  {
    id: 'bugcrowd-vrt',
    name: 'Bugcrowd VRT & Triagem Rápida',
    badge: 'BUGCROWD',
    icon: Target,
    platform: 'Bugcrowd',
    description: 'Relatório estruturado com taxonomia VRT e delay seguro de 0.4s para evitar bloqueio WAF.',
    targetUrl: 'https://bugcrowd-target.com',
    format: 'markdown',
    outputFile: 'bugcrowd_triage.md',
    maxDepth: 2,
    maxUrls: 60,
    delay: 0.4,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: true,
    rules: true,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'hackerone-report',
    name: 'HackerOne Formato Executivo',
    badge: 'HACKERONE',
    icon: Bug,
    platform: 'HackerOne',
    description: 'Markdown oficial com Summary, Steps to Reproduce e cálculo de CVSS / CWE integrado.',
    targetUrl: 'https://h1-target.com',
    format: 'hackerone',
    outputFile: 'hackerone_submission.md',
    maxDepth: 2,
    maxUrls: 80,
    delay: 0.3,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: false,
    rules: true,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'h1-agents-triage',
    name: 'HackerOne + Multiagentes Evidence-First',
    badge: 'MULTI-AGENT',
    icon: Cpu,
    platform: 'HackerOne',
    description: 'Pipeline autônomo com agentes de validação de evidência para 0% de falsos positivos.',
    targetUrl: 'https://h1-target.com',
    format: 'hackerone',
    outputFile: 'h1_validated_report.md',
    maxDepth: 3,
    maxUrls: 120,
    delay: 0.5,
    verbose: true,
    hasAuth: true,
    useAgents: true,
    agentMode: 'authorized_active',
    scopeFile: 'examples/scope_example.json',
    subdomains: false,
    probe: false,
    rules: false,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'intigriti-synack',
    name: 'Intigriti / Synack Escopo Restrito',
    badge: 'INTIGRITI / SYNACK',
    icon: ShieldCheck,
    platform: 'Intigriti',
    description: 'Conformidade estrita de escopo com arquivo JSON e auditoria de cabeçalhos de segurança.',
    targetUrl: 'https://intigriti-target.eu',
    format: 'markdown',
    outputFile: 'intigriti_report.md',
    maxDepth: 2,
    maxUrls: 50,
    delay: 0.6,
    verbose: true,
    hasAuth: true,
    useAgents: true,
    agentMode: 'safe',
    scopeFile: 'examples/scope_example.json',
    subdomains: false,
    probe: true,
    rules: true,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'subdomains-osint',
    name: 'OSINT & Subdomínios (Subfinder-Free)',
    badge: 'OSINT / CT LOGS',
    icon: Globe,
    platform: 'OSINT',
    description: 'Enumeração passiva sem envio de pacotes intrusivos via crt.sh, Wayback e DNS nativo.',
    targetUrl: 'empresa-alvo.com.br',
    format: 'json',
    outputFile: 'subdominios.json',
    maxDepth: 1,
    maxUrls: 10,
    delay: 0.1,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: true,
    probe: false,
    rules: false,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'deep-api-crawler',
    name: 'Deep API & JS Crawler (Katana-Free)',
    badge: 'API / REST',
    icon: Code,
    platform: 'Bugcrowd',
    description: 'Mineração de rotas REST ocultas em JS, parâmetros sensíveis e formulários sem Anti-CSRF.',
    targetUrl: 'https://app.alvo.com',
    format: 'markdown',
    outputFile: 'api_routes_audit.md',
    maxDepth: 3,
    maxUrls: 150,
    delay: 0.2,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: false,
    rules: false,
    crawlNative: true,
    standaloneAll: false
  },
  {
    id: 'termux-android',
    name: 'Termux Android Hunter (Mobile 4G/5G)',
    badge: 'TERMUX MOBILE',
    icon: Smartphone,
    platform: 'Termux',
    description: 'Perfil leve de baixo consumo de bateria e proteção anti-limite de dados de operadora.',
    targetUrl: 'https://alvo.com.br',
    format: 'csv',
    outputFile: 'termux_scan.csv',
    maxDepth: 2,
    maxUrls: 30,
    delay: 0.8,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: true,
    rules: true,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'devsecops-ci',
    name: 'Pipeline CI/CD Quality Gate (GitHub Actions)',
    badge: 'DEVSECOPS',
    icon: Workflow,
    platform: 'DevSecOps',
    description: 'Exportação JSON automatizada para bloqueio de merges caso haja vulnerabilidades críticas.',
    targetUrl: 'http://localhost:3000',
    format: 'json',
    outputFile: 'ci_scan_result.json',
    maxDepth: 2,
    maxUrls: 40,
    delay: 0.1,
    verbose: false,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: true,
    rules: true,
    crawlNative: false,
    standaloneAll: false
  },
  {
    id: 'standalone-all-in-one',
    name: 'Suite Completa 100% Autônoma (All-in-One)',
    badge: 'ZERO EXTERNAL GO',
    icon: Zap,
    platform: 'Bugcrowd',
    description: 'Executa Subdomínios + Probing + Regras Declarativas + JS Crawler em 1 único comando.',
    targetUrl: 'https://alvo.com.br',
    format: 'markdown',
    outputFile: 'relatorio_completo_autonomo.md',
    maxDepth: 2,
    maxUrls: 100,
    delay: 0.3,
    verbose: true,
    hasAuth: true,
    useAgents: false,
    agentMode: 'passive',
    scopeFile: '',
    subdomains: false,
    probe: false,
    rules: false,
    crawlNative: false,
    standaloneAll: true
  }
];

export default function InteractiveTerminal() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bugcrowd-vrt');
  const [targetUrl, setTargetUrl] = useState('https://bugcrowd-target.com');
  const [format, setFormat] = useState<'hackerone' | 'markdown' | 'json' | 'csv' | 'html'>('markdown');
  const [maxDepth, setMaxDepth] = useState(2);
  const [maxUrls, setMaxUrls] = useState(60);
  const [delay, setDelay] = useState(0.4);
  const [verbose, setVerbose] = useState(true);
  const [hasAuth, setHasAuth] = useState(true);
  const [outputFile, setOutputFile] = useState('bugcrowd_triage.md');
  const [copiedCmd, setCopiedCmd] = useState(false);
  
  // Multi-Agents Config
  const [useAgents, setUseAgents] = useState(false);
  const [agentMode, setAgentMode] = useState<'passive' | 'safe' | 'authorized_active' | 'lab'>('passive');
  const [scopeFile, setScopeFile] = useState('');

  // Native Autonomous Engines Config
  const [subdomains, setSubdomains] = useState(false);
  const [probe, setProbe] = useState(true);
  const [rules, setRules] = useState(true);
  const [crawlNative, setCrawlNative] = useState(false);
  const [standaloneAll, setStandaloneAll] = useState(false);

  // Apply Preset Handler
  const handleApplyPreset = (preset: PresetConfig) => {
    setSelectedPresetId(preset.id);
    setTargetUrl(preset.targetUrl);
    setFormat(preset.format);
    setOutputFile(preset.outputFile);
    setMaxDepth(preset.maxDepth);
    setMaxUrls(preset.maxUrls);
    setDelay(preset.delay);
    setVerbose(preset.verbose);
    setHasAuth(preset.hasAuth);
    setUseAgents(preset.useAgents);
    setAgentMode(preset.agentMode);
    setScopeFile(preset.scopeFile);
    setSubdomains(preset.subdomains);
    setProbe(preset.probe);
    setRules(preset.rules);
    setCrawlNative(preset.crawlNative);
    setStandaloneAll(preset.standaloneAll);
  };

  // Generate real CLI command string
  const generateCommand = () => {
    let cmd = `python cwe_discover.py -u ${targetUrl}`;
    if (hasAuth) cmd += ' --i-have-authorization';
    
    // Native Autonomous Engines
    if (standaloneAll) {
      cmd += ' --standalone-all';
    } else {
      if (subdomains) cmd += ' --subdomains';
      if (probe) cmd += ' --probe';
      if (rules) cmd += ' --rules';
      if (crawlNative) cmd += ' --crawl-native';
    }

    if (format !== 'markdown') cmd += ` --format ${format}`;
    if (outputFile && outputFile !== 'cwe_report.md') cmd += ` -o ${outputFile}`;
    if (maxDepth !== 2) cmd += ` --max-depth ${maxDepth}`;
    if (maxUrls !== 60) cmd += ` --max-urls ${maxUrls}`;
    if (delay !== 0.2) cmd += ` --delay ${delay}`;
    if (verbose) cmd += ' -v';

    if (useAgents) {
      cmd += ' --agents';
      if (agentMode !== 'passive') cmd += ` --mode ${agentMode}`;
      if (scopeFile) cmd += ` --scope-file ${scopeFile}`;
    }
    return cmd;
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(generateCommand());
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section id="comandos-cli" className="py-10 sm:py-16 border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] sm:text-xs mb-2">
              <Code className="w-3.5 h-3.5" />
              <span>MONTADOR OFICIAL DE COMANDOS PARA TODAS AS PLATAFORMAS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-100 font-mono">
              Comandos de Execução Oficial
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Monte e copie comandos customizados da suite <span className="text-emerald-400 font-mono font-semibold">cwe-discover</span> adaptados para <span className="text-cyan-400 font-mono font-semibold">Bugcrowd</span>, <span className="text-emerald-400 font-mono font-semibold">HackerOne</span>, <span className="text-fuchsia-400 font-mono font-semibold">Intigriti/Synack</span>, <span className="text-purple-400 font-mono font-semibold">Termux</span> e automações com <span className="text-fuchsia-400 font-mono font-semibold">--agents</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] sm:text-xs font-mono text-slate-400">Ambiente Suportado:</span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] sm:text-xs font-mono text-cyan-300">
              Linux / Termux / macOS / WSL
            </span>
          </div>
        </div>

        {/* Presets Selector Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Selecione o Perfil / Plataforma de Ataque:
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {PRESETS.length} Perfis Pré-Configurados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40 text-slate-100'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="font-bold text-xs font-mono text-slate-200">{p.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-500'
                  }`}>
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Command Assembly Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          
          {/* Left Column: Command Options & Parameters */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 bg-slate-900/50 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Configurar Parâmetros</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Ajuste Fino</span>
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Alvo Autorizado (-u, --url)
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="https://alvo.exemplo.com"
                />
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Formato de Exportação (--format)
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: 'markdown', label: 'Markdown (Bugcrowd)' },
                  { id: 'hackerone', label: 'HackerOne' },
                  { id: 'json', label: 'JSON (CI/CD)' },
                  { id: 'html', label: 'HTML Executivo' },
                  { id: 'csv', label: 'CSV (Planilhas)' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono transition border ${
                      format === item.id 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output File Name */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Arquivo de Saída (-o, --output)
              </label>
              <input
                type="text"
                value={outputFile}
                onChange={(e) => setOutputFile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="relatorio.md"
              />
            </div>

            {/* Sliders: Max Depth & Max URLs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Profundidade</span>
                  <span className="text-emerald-400">{maxDepth}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer bg-slate-950 h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Limite URLs</span>
                  <span className="text-emerald-400">{maxUrls}</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={maxUrls}
                  onChange={(e) => setMaxUrls(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer bg-slate-950 h-2"
                />
              </div>
            </div>

            {/* Delay Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Delay Anti-WAF / Stealth</span>
                <span className="text-emerald-400">{delay}s</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer bg-slate-950 h-2"
              />
            </div>

            {/* Autonomous Engines Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
              <div className="text-[11px] text-cyan-400 font-bold mb-1">Motores Autônomos Nativos (Sem Go):</div>
              
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={subdomains}
                    onChange={(e) => { setSubdomains(e.target.checked); if(e.target.checked) setStandaloneAll(false); }}
                    className="rounded accent-cyan-500 w-3.5 h-3.5 bg-slate-950 border-slate-700"
                  />
                  <span className="text-cyan-300 truncate">--subdomains</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={probe}
                    onChange={(e) => { setProbe(e.target.checked); if(e.target.checked) setStandaloneAll(false); }}
                    className="rounded accent-emerald-500 w-3.5 h-3.5 bg-slate-950 border-slate-700"
                  />
                  <span className="text-emerald-300 truncate">--probe</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rules}
                    onChange={(e) => { setRules(e.target.checked); if(e.target.checked) setStandaloneAll(false); }}
                    className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-700"
                  />
                  <span className="text-amber-300 truncate">--rules</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={crawlNative}
                    onChange={(e) => { setCrawlNative(e.target.checked); if(e.target.checked) setStandaloneAll(false); }}
                    className="rounded accent-purple-500 w-3.5 h-3.5 bg-slate-950 border-slate-700"
                  />
                  <span className="text-purple-300 truncate">--crawl-native</span>
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox"
                  checked={standaloneAll}
                  onChange={(e) => {
                    setStandaloneAll(e.target.checked);
                    if (e.target.checked) {
                      setSubdomains(false);
                      setProbe(false);
                      setRules(false);
                      setCrawlNative(false);
                    }
                  }}
                  className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="text-emerald-400 font-bold truncate">--standalone-all (Pipeline Completo)</span>
              </label>
            </div>

            {/* Checkbox options for Auth, Verbose, Agents */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={hasAuth}
                  onChange={(e) => setHasAuth(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="text-amber-400 font-semibold truncate">--i-have-authorization (Obrigatório)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={verbose}
                  onChange={(e) => setVerbose(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="truncate">-v / --verbose (Logs coloridos)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={useAgents}
                  onChange={(e) => setUseAgents(e.target.checked)}
                  className="rounded accent-fuchsia-500 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="text-fuchsia-400 font-semibold truncate">--agents (Multiagentes de Validação)</span>
              </label>
            </div>

            {/* Multi-agent sub-options */}
            {useAgents && (
              <div className="space-y-3 pt-2.5 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Modo dos Agentes (--mode)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'passive', label: 'passive' },
                      { id: 'safe', label: 'safe' },
                      { id: 'authorized_active', label: 'auth_active' },
                      { id: 'lab', label: 'lab' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setAgentMode(item.id as any)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono transition border ${
                          agentMode === item.id
                            ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Arquivo de Escopo (--scope-file)
                  </label>
                  <input
                    type="text"
                    value={scopeFile}
                    onChange={(e) => setScopeFile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-fuchsia-500"
                    placeholder="examples/scope_example.json"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Generated Command & Quick CheatSheet */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
            
            {/* Generated Command Box */}
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 font-medium">Comando Montado Oficial</span>
                </div>
                <button
                  onClick={handleCopyCmd}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd ? 'Copiado para o Clipboard!' : 'Copiar Comando'}</span>
                </button>
              </div>

              <div className="p-3.5 sm:p-5 font-mono text-xs text-emerald-300 bg-slate-950/90 leading-relaxed overflow-x-auto selection:bg-emerald-500 selection:text-slate-950">
                <div className="text-slate-500 mb-1.5 text-[11px] flex items-center justify-between">
                  <span># Terminal pronto para colar e executar:</span>
                  <span className="text-slate-600">CLI v2.0 Autônoma</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold whitespace-pre-wrap break-all text-xs sm:text-sm shadow-inner">
                  {generateCommand()}
                </div>
              </div>
            </div>

            {/* Quick Presets of Common Execution Commands */}
            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Atalhos Rápidos de Execução</span>
                <span className="text-emerald-400 text-[10px]">1-Click Copy</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                
                {/* Preset 1 */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
                  <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" />
                      <span>Bugcrowd Fast Scan</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">VRT</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-nowrap">
                    python cwe_discover.py -u https://alvo.com --rules --probe --i-have-authorization
                  </div>
                </div>

                {/* Preset 2 */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
                  <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Bug className="w-3 h-3 text-emerald-400" />
                      <span>HackerOne Markdown</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">H1</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-nowrap">
                    python cwe_discover.py -u https://alvo.com --format hackerone --i-have-authorization
                  </div>
                </div>

                {/* Preset 3 */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
                  <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-purple-400" />
                      <span>Termux Mobile Stealth</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">4G/5G</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-nowrap">
                    python cwe_discover.py -u https://alvo.com --delay 0.8 --max-urls 30 --i-have-authorization
                  </div>
                </div>

                {/* Preset 4 */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
                  <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-fuchsia-400" />
                      <span>Multiagentes Evidence-First</span>
                    </span>
                    <span className="text-[10px] font-mono text-fuchsia-400">IA TRIAGE</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-nowrap">
                    python cwe_discover.py -u https://alvo.com --agents --mode safe --i-have-authorization
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
