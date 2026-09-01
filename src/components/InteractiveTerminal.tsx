import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Layers, 
  Cpu, 
  Target, 
  Bug, 
  Smartphone, 
  Workflow, 
  Zap, 
  CheckCircle2, 
  FileCode, 
  Play, 
  RotateCcw,
  Pause,
  Server, 
  Activity,
  AlertTriangle,
  Lock,
  Search,
  Eye,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Database,
  Terminal,
  FileCheck
} from 'lucide-react';

interface PresetConfig {
  id: string;
  name: string;
  badge: string;
  icon: any;
  platform: string;
  description: string;
  format: 'hackerone' | 'markdown' | 'json' | 'csv' | 'html';
  outputFile: string;
  maxDepth: number;
  maxUrls: number;
  delay: number;
  stealth: 'Alto' | 'Médio' | 'Ultra';
  useAgents: boolean;
  agentMode: 'passive' | 'safe' | 'authorized_active' | 'lab';
  enginesEnabled: string[];
}

const PRESETS: PresetConfig[] = [
  {
    id: 'bugcrowd-vrt',
    name: 'Perfil Demo: Bugcrowd VRT & Triagem Passiva',
    badge: 'BUGCROWD VRT (DEMO)',
    icon: Target,
    platform: 'Bugcrowd',
    description: 'Simulação de validação de escopo com taxonomia VRT e proteção WAF com delay adaptativo.',
    format: 'markdown',
    outputFile: 'bugcrowd_triage_demo.md',
    maxDepth: 2,
    maxUrls: 60,
    delay: 0.4,
    stealth: 'Alto',
    useAgents: true,
    agentMode: 'safe',
    enginesEnabled: ['HTTP Header Scanner', 'HTML Parser', 'Robots & Sitemap Miner', 'Passive CWE Matcher']
  },
  {
    id: 'hackerone-report',
    name: 'Perfil Demo: HackerOne Executivo & Triagem Tripla',
    badge: 'HACKERONE (DEMO)',
    icon: Bug,
    platform: 'HackerOne',
    description: 'Simulação de relatório estruturado com CVSS 3.1, passos de reprodução sanitizados e matriz de impacto.',
    format: 'hackerone',
    outputFile: 'hackerone_submission_demo.md',
    maxDepth: 2,
    maxUrls: 80,
    delay: 0.3,
    stealth: 'Alto',
    useAgents: true,
    agentMode: 'authorized_active',
    enginesEnabled: ['17 Native Engines (Mock)', '18 Evidence Agents (Mock)', 'Deduplication Pipeline']
  },
  {
    id: 'deep-api-crawler',
    name: 'Perfil Demo: Deep API & Single Page Application',
    badge: 'API / SPA (DEMO)',
    icon: FileCode,
    platform: 'Enterprise API',
    description: 'Simulação de mineração profunda de rotas REST, endpoints GraphQL e formulários sem anti-CSRF.',
    format: 'json',
    outputFile: 'api_surface_audit_demo.json',
    maxDepth: 3,
    maxUrls: 150,
    delay: 0.2,
    stealth: 'Médio',
    useAgents: true,
    agentMode: 'safe',
    enginesEnabled: ['JavaScript Regex Route Extractor', 'Form & Anti-CSRF Analyzer', 'JSON Spec Parser']
  },
  {
    id: 'termux-android',
    name: 'Perfil Demo: Modo Leve & Baixo Consumo',
    badge: 'LEVE / STANDALONE (DEMO)',
    icon: Smartphone,
    platform: 'Linux / Mobile',
    description: 'Simulação otimizada em hardware com restrição de memória, sem sockets pesados.',
    format: 'csv',
    outputFile: 'mobile_light_scan_demo.csv',
    maxDepth: 2,
    maxUrls: 30,
    delay: 0.8,
    stealth: 'Ultra',
    useAgents: false,
    agentMode: 'passive',
    enginesEnabled: ['Lightweight HTTP Socket Probe', 'Passive Header Auditor']
  },
  {
    id: 'standalone-all-in-one',
    name: 'Perfil Demo: Orquestração Completa 17 Motores',
    badge: 'FULL SUITE (DEMO)',
    icon: Zap,
    platform: 'Full Audit',
    description: 'Simulação dos 17 motores próprios e 18 agentes em grafo DAG com triagem diferencial e evidências.',
    format: 'markdown',
    outputFile: 'relatorio_completo_demo.md',
    maxDepth: 3,
    maxUrls: 120,
    delay: 0.3,
    stealth: 'Alto',
    useAgents: true,
    agentMode: 'authorized_active',
    enginesEnabled: ['17 Motores Nativos', '18 Agentes de Validação', 'PoC Sanitizer', 'Executive Engine']
  }
];

interface SimulationStep {
  id: string;
  name: string;
  shortLabel: string;
  category: 'TARGET' | 'ORCHESTRATOR' | 'AGENTS' | 'ANALYSIS' | 'EVIDENCE' | 'IMPACT' | 'REPORT';
  description: string;
  agent: string;
  logMessage: string;
  findingDemo?: {
    cwe: string;
    title: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    cvss: number;
    hash: string;
  };
}

const SIMULATION_PIPELINE: SimulationStep[] = [
  {
    id: 'step-1-target',
    name: '1. TARGET-DEMO',
    shortLabel: 'TARGET DEMO',
    category: 'TARGET',
    description: 'Inicialização do escopo sintético de demonstração (TARGET-DEMO / Sandbox Isolado).',
    agent: 'Target Boundary Guard (Demo)',
    logMessage: '[TARGET-DEMO] Alvo fictício fixado no sandbox. Nenhuma requisição externa autorizada na Landing.'
  },
  {
    id: 'step-2-orchestrator',
    name: '2. ORQUESTRADOR',
    shortLabel: 'ORQUESTRADOR',
    category: 'ORCHESTRATOR',
    description: 'Compilação de políticas de conformidade, taxa de stealth anti-WAF e grafo DAG.',
    agent: 'Core Policy Orchestrator (Demo)',
    logMessage: '[ORQUESTRADOR] Políticas declarativas compiladas. Delay ajustado para 0.4s. Grafo DAG alocado.'
  },
  {
    id: 'step-3-agents',
    name: '3. AGENTS',
    shortLabel: 'AGENTS',
    category: 'AGENTS',
    description: 'Ativação do enxame de 18 agentes especializados em topologia paralela e sequencial.',
    agent: 'Agent Swarm Manager (Demo)',
    logMessage: '[AGENTS] 18 Agentes de IA distribuídos: Recon, Parser AST, Header Auditor, Session Guard.'
  },
  {
    id: 'step-4-analysis',
    name: '4. ANÁLISE',
    shortLabel: 'ANÁLISE',
    category: 'ANALYSIS',
    description: 'Inspeção passiva heurística de cabeçalhos RFC, formulários, cookies e regras CWE.',
    agent: 'Differential Heuristic Analyst (Demo)',
    logMessage: '[ANÁLISE] Sondagem passiva simulada concluída. 4 indícios de vulnerabilidade identificados.',
    findingDemo: {
      cwe: 'CWE-693',
      title: 'Ausência de Content-Security-Policy e Proteção Anti-Clickjacking',
      severity: 'MEDIUM',
      cvss: 5.4,
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  },
  {
    id: 'step-5-evidence',
    name: '5. EVIDENCE',
    shortLabel: 'EVIDENCE',
    category: 'EVIDENCE',
    description: 'Coleta de provas criptograficamente assinadas com hashes SHA-256 e sanitização de dados.',
    agent: 'Evidence Ledger & Sanitizer (Demo)',
    logMessage: '[EVIDENCE] Hash SHA-256 gerado para prova documental. Payloads destrutivos bloqueados.',
    findingDemo: {
      cwe: 'CWE-200',
      title: 'Exposição Passiva de Versão de Servidor Web (Header Server / X-Powered-By)',
      severity: 'LOW',
      cvss: 3.1,
      hash: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
    }
  },
  {
    id: 'step-6-impact',
    name: '6. IMPACT',
    shortLabel: 'IMPACT',
    category: 'IMPACT',
    description: 'Cálculo determinístico de Risk Score, CVSS 3.1 e mapeamento para Bugcrowd VRT / HackerOne.',
    agent: 'Impact Scorer & VRT Mapper (Demo)',
    logMessage: '[IMPACT] Matriz de risco calculada: Severidade 5.4 • Confiança 95% • Zero Falso Positivo.',
    findingDemo: {
      cwe: 'CWE-614',
      title: 'Cookie de Sessão sem Flag Secure / SameSite restrito (Simulação)',
      severity: 'MEDIUM',
      cvss: 6.1,
      hash: 'sha256:ca978112ca1bbdcafac231b39a23dc4da7860814964f70915f45c8646412d950'
    }
  },
  {
    id: 'step-7-report',
    name: '7. REPORT',
    shortLabel: 'REPORT',
    category: 'REPORT',
    description: 'Geração de dossiê final estruturado pronto para exportação nos formatos suportados.',
    agent: 'Executive Report Synthesizer (Demo)',
    logMessage: '[REPORT] Dossiê demonstrativo compilado em formato compatível com HackerOne/Markdown.'
  }
];

interface InteractiveTerminalProps {
  onOpenActivation?: () => void;
  onOpenWorkspace?: () => void;
}

export default function InteractiveTerminal({ onOpenActivation, onOpenWorkspace }: InteractiveTerminalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bugcrowd-vrt');
  const [format, setFormat] = useState<'hackerone' | 'markdown' | 'json' | 'csv' | 'html'>('markdown');
  const [maxDepth, setMaxDepth] = useState(2);
  const [maxUrls, setMaxUrls] = useState(60);
  const [delay, setDelay] = useState(0.4);
  const [useAgents, setUseAgents] = useState(true);
  const [agentMode, setAgentMode] = useState<'passive' | 'safe' | 'authorized_active' | 'lab'>('safe');
  
  // Simulation State (Purely client-side UI animation)
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [simulatedLogs, setSimulatedLogs] = useState<Array<{ time: string; msg: string; tag: string }>>([]);
  const [simulatedFindings, setSimulatedFindings] = useState<Array<any>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleApplyPreset = (preset: PresetConfig) => {
    setSelectedPresetId(preset.id);
    setFormat(preset.format);
    setMaxDepth(preset.maxDepth);
    setMaxUrls(preset.maxUrls);
    setDelay(preset.delay);
    setUseAgents(preset.useAgents);
    setAgentMode(preset.agentMode);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setSimulatedLogs([
      {
        time: new Date().toLocaleTimeString(),
        msg: 'Iniciando Simulação Demonstrativa do Orquestrador Cyber Hunter...',
        tag: 'INIT'
      }
    ]);
    setSimulatedFindings([]);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setCurrentStepIndex(-1);
    setSimulatedLogs([]);
    setSimulatedFindings([]);
  };

  // Step sequencer effect
  useEffect(() => {
    if (!isSimulating) return;

    timerRef.current = setTimeout(() => {
      setCurrentStepIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < SIMULATION_PIPELINE.length) {
          const step = SIMULATION_PIPELINE[nextIndex];
          setSimulatedLogs(old => [
            ...old,
            {
              time: new Date().toLocaleTimeString(),
              msg: step.logMessage,
              tag: step.shortLabel
            }
          ]);
          if (step.findingDemo) {
            setSimulatedFindings(old => [...old, step.findingDemo]);
          }
          return nextIndex;
        } else {
          setIsSimulating(false);
          setSimulatedLogs(old => [
            ...old,
            {
              time: new Date().toLocaleTimeString(),
              msg: '✅ Simulação do Fluxo Concluída. Dossiê demonstrativo pronto.',
              tag: 'CONCLUÍDO'
            }
          ]);
          return prev;
        }
      });
    }, 1400);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isSimulating, currentStepIndex]);

  return (
    <section id="comandos-cli" className="py-10 sm:py-16 border-b border-slate-800 bg-slate-950 relative overflow-hidden">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] sm:text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMULAÇÃO DO ORQUESTRADOR // SIMULADOR DE CAMPANHA</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-100 font-mono flex items-center gap-2">
              <span>Simulador de Políticas & Fluxo de Auditoria</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Ambiente demonstrativo visual para experimentar os parâmetros de orquestração dos 17 motores nativos e 18 agentes em tempo real. Esta interface não realiza varreduras ou conexões reais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] sm:text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              MODO DEMONSTRAÇÃO — SIMULADOR
            </span>
          </div>
        </div>

        {/* Informational Disclaimer Banner */}
        <div className="mb-6 p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Aviso de Segurança:</strong> A Landing Page pública não executa requisições contra alvos reais. O alvo abaixo é fixo (<strong className="text-emerald-400">TARGET-DEMO</strong>) para fins didáticos e demonstração visual.
            </span>
          </div>
          <button
            onClick={onOpenActivation || onOpenWorkspace}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 text-[11px] transition shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Ativar Workspace Real</span>
          </button>
        </div>

        {/* Visual Pipeline Flow Stepper (TARGET DEMO -> ORQUESTRADOR -> AGENTS -> ANÁLISE -> EVIDENCE -> IMPACT -> REPORT) */}
        <div className="mb-6 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              Sequência Visual do Pipeline:
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              TARGET-DEMO → ORQUESTRADOR → AGENTS → ANÁLISE → EVIDENCE → IMPACT → REPORT
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
            {SIMULATION_PIPELINE.map((step, idx) => {
              const isCurrent = currentStepIndex === idx && isSimulating;
              const isPast = currentStepIndex > idx || (currentStepIndex === SIMULATION_PIPELINE.length - 1 && !isSimulating && simulatedLogs.length > 0);
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                      : isPast
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400 animate-pulse" />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase">{step.shortLabel}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : isCurrent ? (
                      <Activity className="w-3 h-3 text-amber-400 animate-spin" />
                    ) : (
                      <span className="text-[9px] font-mono text-slate-600">0{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 line-clamp-2 leading-tight">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Presets Selector Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Perfis de Campanha de Demonstração:
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {PRESETS.length} Perfis Demonstrativos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40 text-slate-100'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="font-bold text-xs font-mono text-slate-200 truncate">{p.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded self-start ${
                    isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-950 text-slate-500'
                  }`}>
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Configuration Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          
          {/* Left Column: Interactive Parameters (Simulated) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Parâmetros da Simulação</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Ajuste Fino Demonstrativo
              </span>
            </div>

            {/* Static Non-Editable Target Display (Zero user URL input) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-slate-400">
                  Target de Demonstração (Fixo / Mocked Scope)
                </label>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  Alvo Estático Fictício
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-400 font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TARGET-DEMO</span>
                    <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Sandbox de Demonstração)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    NÃO EDITÁVEL
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                * Para conformidade de segurança e isolamento, a Landing não permite digitar URLs ou domínios reais.
              </p>
            </div>

            {/* Format Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Formato do Relatório Demonstrativo
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: 'markdown', label: 'Markdown Executivo' },
                  { id: 'hackerone', label: 'HackerOne MD' },
                  { id: 'json', label: 'JSON Auditavel' },
                  { id: 'html', label: 'HTML Interativo' },
                  { id: 'csv', label: 'CSV / Planilha' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono transition border cursor-pointer ${
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

            {/* Sliders for Depth and URLs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Profundidade (Crawl)</span>
                  <span className="text-emerald-400 font-bold">{maxDepth} Níveis</span>
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
                  <span>Limite de Rotas</span>
                  <span className="text-emerald-400 font-bold">{maxUrls} URLs</span>
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
                <span>Delay Anti-WAF / Taxa de Stealth</span>
                <span className="text-emerald-400 font-bold">{delay}s por requisição</span>
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

            {/* Agent Options */}
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={useAgents}
                  onChange={(e) => setUseAgents(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-700"
                />
                <span className="text-emerald-300 font-semibold">Habilitar Grafo de 18 Agentes Evidence-First (Simulado)</span>
              </label>

              {useAgents && (
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { id: 'passive', label: 'Passivo' },
                    { id: 'safe', label: 'Seguro' },
                    { id: 'authorized_active', label: 'Ativo Autorizado' },
                    { id: 'lab', label: 'Lab Sandbox' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setAgentMode(item.id as any)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition border cursor-pointer ${
                        agentMode === item.id
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Simulation Execution & Telemetry Logs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            
            {/* Policy Summary Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-slate-200">Plano de Execução do Simulador</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  {activePreset.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ALVO DA SIMULAÇÃO</span>
                  <span className="text-emerald-400 font-bold truncate block">TARGET-DEMO</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FORMATO EXPORT</span>
                  <span className="text-cyan-400 font-bold uppercase">{format}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GRAFO DE AGENTES</span>
                  <span className="text-amber-400 font-bold">{useAgents ? `18 Agentes (${agentMode})` : 'Desativado'}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RATE & STEALTH</span>
                  <span className="text-slate-300 font-bold">{delay}s delay • 0% DoS</span>
                </div>
              </div>

              {/* Simulation Telemetry Console Box */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Telemetria da Simulação (DADOS DE DEMONSTRAÇÃO):
                  </span>
                  {isSimulating && (
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 animate-pulse">
                      <Activity className="w-3 h-3" />
                      SIMULANDO...
                    </span>
                  )}
                </div>

                <div className="h-28 overflow-y-auto font-mono text-[11px] space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
                  {simulatedLogs.length === 0 ? (
                    <p className="text-slate-500 italic">
                      Clique em "SIMULAR FLUXO DE EXECUÇÃO" abaixo para visualizar o comportamento visual dos agentes e motores em tempo real.
                    </p>
                  ) : (
                    simulatedLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-slate-500 text-[10px]">[{log.time}]</span>
                        <span className="text-amber-400 text-[10px] font-bold">[{log.tag}]</span>
                        <span className="text-slate-200">{log.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Simulated Findings Preview */}
              {simulatedFindings.length > 0 && (
                <div className="p-2.5 bg-slate-950/90 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      Achados Detectados na Simulação (DADOS DE DEMONSTRAÇÃO):
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">MOCK</span>
                  </div>
                  <div className="space-y-1.5">
                    {simulatedFindings.map((finding, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{finding.cwe}</span>
                          <span className="text-slate-200 truncate">{finding.title}</span>
                        </div>
                        <span className="text-cyan-400 shrink-0 font-bold">CVSS {finding.cvss}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulation Action Controls & Workspace Transition */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Controles do Simulador de Campanha</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">100% Client-Side</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {!isSimulating ? (
                  <button
                    onClick={startSimulation}
                    className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>SIMULAR FLUXO DE EXECUÇÃO</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSimulation}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>PAUSAR SIMULAÇÃO</span>
                  </button>
                )}

                <button
                  onClick={resetSimulation}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REINICIAR SIMULADOR</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p className="text-[11px] text-slate-400 font-mono">
                  Para criar e executar campanhas reais em alvos sob sua autorização:
                </p>
                <button
                  onClick={onOpenActivation || onOpenWorkspace}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer font-mono"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>ENTRAR / ATIVAR WORKSPACE</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
