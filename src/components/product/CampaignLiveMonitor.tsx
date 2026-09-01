import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Pause, 
  Play, 
  StopCircle, 
  ShieldCheck, 
  Layers, 
  Globe, 
  Search, 
  FileText, 
  Sparkles,
  ArrowRight,
  Download,
  Terminal,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { CampaignItem, AgentStatus } from '../../types/product';

interface CampaignLiveMonitorProps {
  campaign: CampaignItem;
  onViewReport: () => void;
  onViewFindings: () => void;
  onViewAssets: () => void;
  onPauseResume?: (action: 'pause' | 'resume') => void;
  onCancel?: () => void;
}

const AGENTS_LIST = [
  { id: 'AGT-ORCHESTRATOR', name: 'Agente Orchestrator', role: 'Coordenação e planejamento de execução DAG', engine: 'ALL_17_ENGINES' },
  { id: 'AGT-SCOPE', name: 'Agente de Escopo', role: 'Validação e policiamento de fronteiras autorizadas', engine: 'CH-SCOPE' },
  { id: 'AGT-DNS', name: 'Agente DNS', role: 'Topologia de nomes e Certificate Transparency', engine: 'CH-DNS' },
  { id: 'AGT-NETWORK', name: 'Agente de Rede', role: 'Superfície de portas e protocolos em raw sockets', engine: 'CH-NET / CH-SPEEDNET' },
  { id: 'AGT-HTTP', name: 'Agente HTTP', role: 'Inspeção de cabeçalhos e cifras defensivas TLS', engine: 'CH-HTTP / CH-AUDIT' },
  { id: 'AGT-CRAWLER', name: 'Agente Crawler', role: 'Mapeamento DOM, rotas em JS e formulários', engine: 'CH-CRAWL' },
  { id: 'AGT-FINGERPRINT', name: 'Agente Fingerprint', role: 'Reconhecimento passivo de tecnologias e stacks', engine: 'CH-TECH' },
  { id: 'AGT-DISCOVERY', name: 'Agente Discovery', role: 'Sondagem de consoles de admin e Swagger', engine: 'CH-CONTENT' },
  { id: 'AGT-DETECTION', name: 'Agente Detection', role: 'Avaliação da árvore de regras declarativas', engine: 'CH-DETECT' },
  { id: 'AGT-VALIDATION', name: 'Agente Validation', role: 'Triangulação diferencial de hipóteses', engine: 'CH-VERIFY' },
  { id: 'AGT-FP-REJECT', name: 'Agente False Positive', role: 'Filtro semântico de ruído WAF e Soft 404', engine: 'CH-VERIFY' },
  { id: 'AGT-CORRELATION', name: 'Agente Correlation', role: 'Fusão de inteligência no grafo unificado', engine: 'CH-CORRELATE' },
  { id: 'AGT-CWE', name: 'Agente CWE', role: 'Enquadramento oficial MITRE CWE Top 25', engine: 'CH-CWE' },
  { id: 'AGT-OWASP', name: 'Agente OWASP', role: 'Mapeamento regulatório OWASP Top 10', engine: 'CH-OWASP' },
  { id: 'AGT-IMPACT', name: 'Agente Impact', role: 'Cálculo matemático de vetor CVSS v3.1', engine: 'CH-IMPACT' },
  { id: 'AGT-EVIDENCE', name: 'Agente Evidence', role: 'Sanitização de tokens e ledger de PoCs', engine: 'CH-EVIDENCE' },
  { id: 'AGT-REPORT', name: 'Agente Report', role: 'Geração de relatórios executivos e técnicos', engine: 'CH-REPORT' }
];

export default function CampaignLiveMonitor({
  campaign,
  onViewReport,
  onViewFindings,
  onViewAssets
}: CampaignLiveMonitorProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'dag'>('agents');

  // Calcula progresso baseado nos agentes completados
  const totalAgents = AGENTS_LIST.length;
  const completedAgents = AGENTS_LIST.filter(a => campaign.agents_status?.[a.id] === 'COMPLETED').length;
  const runningAgent = AGENTS_LIST.find(a => campaign.agents_status?.[a.id] === 'RUNNING');
  const progressPercent = campaign.status === 'COMPLETED' ? 100 : Math.round((completedAgents / totalAgents) * 100);

  const getStatusBadge = (status?: AgentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Running...</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Waiting</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Status */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-emerald-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                {campaign.id}
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Modo: <strong className="text-slate-200 uppercase">{campaign.scope.profile}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <span>{campaign.name}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">{campaign.target}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {campaign.status === 'COMPLETED' ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onViewReport}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>VER RELATÓRIO</span>
                </button>
                <button
                  onClick={onViewFindings}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Findings ({campaign.findings_count})</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" /> : <Pause className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                  <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
                </button>
                <button
                  className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/60 transition flex items-center gap-1.5"
                >
                  <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="pt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Progresso do Orquestrador:</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              {runningAgent && (
                <span className="text-cyan-300 hidden sm:inline">
                  • Agente Ativo: <strong className="text-slate-100">{runningAgent.name}</strong>
                </span>
              )}
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              {campaign.status === 'COMPLETED' ? '✓ Assessment Concluído' : 'Orquestração em Tempo Real'}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div 
            onClick={onViewAssets}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition"
          >
            <span className="text-slate-400 text-xs block">Ativos Descobertos</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{campaign.assets_count}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Observações Processadas</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{campaign.observations_count}</span>
          </div>

          <div 
            onClick={onViewFindings}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition"
          >
            <span className="text-slate-400 text-xs block">Findings Confirmados</span>
            <span className="text-xl font-bold font-mono text-amber-400">{campaign.findings_count}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Risco Ponderado</span>
            <span className="text-xl font-bold font-mono text-rose-400">{campaign.overall_risk} ({campaign.risk_score})</span>
          </div>
        </div>

      </div>

      {/* Mode View Switcher: Lista de Agentes vs Grafo DAG */}
      <div className="flex items-center justify-between">
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'agents'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Esteira dos Agentes ({completedAgents}/{totalAgents})</span>
          </button>
          <button
            onClick={() => setActiveTab('dag')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'dag'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Grafo do Orchestrator (DAG)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LISTA DOS AGENTES */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AGENTS_LIST.map((agent) => {
            const status = campaign.agents_status?.[agent.id] || (campaign.status === 'COMPLETED' ? 'COMPLETED' : 'WAITING');
            return (
              <div
                key={agent.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200">{agent.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">[{agent.id}]</span>
                  </div>
                  <p className="text-xs text-slate-400">{agent.role}</p>
                  <span className="text-[11px] font-mono text-emerald-400/80 block pt-1">
                    Engine: {agent.engine}
                  </span>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(status)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: GRAFO DO ORCHESTRATOR */}
      {activeTab === 'dag' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Topologia do Task Graph do Orchestrator</h3>
              <p className="text-xs text-slate-400">Resolução estrita de dependências sem scanners externos.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              100% Autônomo
            </span>
          </div>

          {/* Árvore Visual em Grafo */}
          <div className="flex flex-col items-center space-y-4 py-4 font-mono text-xs">
            
            {/* Nível 1: Orchestrator */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-emerald-300 font-bold shadow-lg shadow-emerald-500/10 min-w-[240px]">
              👑 ORCHESTRATOR AGENT
            </div>

            <div className="w-0.5 h-6 bg-slate-700" />

            {/* Nível 2: Descoberta Primária Paralela */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">DNS AGENT</span>
                <span className="text-[10px] text-slate-400">CH-DNS</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">NETWORK AGENT</span>
                <span className="text-[10px] text-slate-400">Raw Sockets</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">HTTP AGENT</span>
                <span className="text-[10px] text-slate-400">RFC 7230 / TLS</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-700" />

            {/* Nível 3: Crawler & Fingerprint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">CRAWLER AGENT</span>
                <span className="text-[10px] text-slate-400">DOM Stream Parsing</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">FINGERPRINT AGENT</span>
                <span className="text-[10px] text-slate-400">Tech Identification</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-700" />

            {/* Nível 4: Detecção e Validação Diferencial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-center text-cyan-300">
                <span className="font-semibold block">DETECTION AGENT</span>
                <span className="text-[10px] text-slate-400">Regras Declarativas</span>
              </div>
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-center text-cyan-300">
                <span className="font-semibold block">VALIDATION AGENT</span>
                <span className="text-[10px] text-slate-400">Triangulação Diferencial</span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-700" />

            {/* Nível 5: Evidências, Impacto e Relatório */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">EVIDENCE AGENT</span>
                <span className="text-[10px] text-slate-400">Sanitized Ledger</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-200 font-semibold block">IMPACT AGENT</span>
                <span className="text-[10px] text-slate-400">CVSS v3.1 / CWE</span>
              </div>
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-emerald-300">
                <span className="font-semibold block">REPORT AGENT</span>
                <span className="text-[10px] text-slate-400">Markdown/HTML/JSON</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
