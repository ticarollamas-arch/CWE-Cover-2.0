import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  FileCode, 
  FileText, 
  Sliders, 
  KeyRound, 
  Plus, 
  Globe, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Server,
  Fingerprint
} from 'lucide-react';
import CyberLogo from '../CyberLogo';
import { CampaignItem, SystemStatus, ScopeConfig } from '../../types/product';
import NewCampaignWizard from './NewCampaignWizard';
import CampaignLiveMonitor from './CampaignLiveMonitor';
import AgentsCatalogView from './AgentsCatalogView';
import AssetsExplorerView from './AssetsExplorerView';
import FindingsView from './FindingsView';
import EvidenceLedgerView from './EvidenceLedgerView';
import ReportCenterView from './ReportCenterView';
import SettingsView from './SettingsView';

interface ProductDashboardProps {
  systemStatus: SystemStatus | null;
  onLogout: () => void;
  onBackToPresentation?: () => void;
}

export default function ProductDashboard({
  systemStatus,
  onLogout,
  onBackToPresentation
}: ProductDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'monitor' | 'agents' | 'assets' | 'findings' | 'evidence' | 'reports' | 'settings'
  >('overview');

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<CampaignItem | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);

  // Busca lista de campanhas
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
        if (!activeCampaign && data.campaigns.length > 0) {
          setActiveCampaign(data.campaigns[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar campanhas:', err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Polling / SSE para atualizar campanha ativa enquanto estiver RUNNING
  useEffect(() => {
    if (!activeCampaign || activeCampaign.status !== 'RUNNING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/campaigns/${activeCampaign.id}`);
        if (res.status === 401 || res.status === 403) {
          onLogout();
          return;
        }
        const data = await res.json();
        if (data.campaign) {
          setActiveCampaign(data.campaign);
          setCampaigns(prev => prev.map(c => c.id === data.campaign.id ? data.campaign : c));
        }
      } catch (err) {
        console.error('Erro no polling da campanha:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeCampaign?.id, activeCampaign?.status]);

  const handleStartNewCampaign = async (campaignData: { target: string; name: string; scope: ScopeConfig }) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.campaign) {
        setCampaigns([data.campaign, ...campaigns]);
        setActiveCampaign(data.campaign);
        setActiveTab('monitor');
      }
    } catch (err) {
      console.error('Erro ao iniciar nova campanha:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* TOPBAR OPERACIONAL */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <CyberLogo size="sm" subtitle="Autonomous Security Platform" />
            
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Runtime Local Debian/Kali/Linux</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                Plano: <strong className="text-emerald-300">{systemStatus?.license?.plan || 'Professional'}</strong>
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">NOVA CAMPANHA</span>
              <span className="sm:hidden">NOVA</span>
            </button>

            {onBackToPresentation && (
              <button
                onClick={onBackToPresentation}
                className="hidden sm:flex px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition items-center gap-1.5"
                title="Voltar para a página de apresentação pública"
              >
                <span>Página Pública</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-850 font-mono text-xs">
          {[
            { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'monitor', label: 'Campanha Ativa', icon: Activity, count: activeCampaign?.status === 'RUNNING' ? 'LIVE' : undefined },
            { id: 'agents', label: 'Agentes (18)', icon: Cpu },
            { id: 'assets', label: 'Assets Explorer', icon: Layers, count: activeCampaign?.assets_count },
            { id: 'findings', label: 'Findings & Risco', icon: ShieldAlert, count: activeCampaign?.findings_count },
            { id: 'evidence', label: 'Cadeia de Evidências', icon: FileCode },
            { id: 'reports', label: 'Relatórios', icon: FileText },
            { id: 'settings', label: 'Configurações', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 font-semibold transition border-b-2 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    tab.count === 'LIVE' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* TAB 1: VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Operational Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Campanhas Realizadas</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-slate-100">{campaigns.length}</div>
                <span className="text-[11px] text-emerald-400 block font-mono">100% autônomas no host</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Ativos Mapeados</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-cyan-300">
                  {campaigns.reduce((acc, c) => acc + (c.assets_count || 0), 0)}
                </div>
                <span className="text-[11px] text-cyan-400 block font-mono">DNS, IPs, Portas e Rotas</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Vulnerabilidades Validadas</span>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-amber-300">
                  {campaigns.reduce((acc, c) => acc + (c.findings_count || 0), 0)}
                </div>
                <span className="text-[11px] text-amber-400 block font-mono">Zero falsos positivos</span>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Críticos & Altos</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-rose-400">
                  {campaigns.reduce((acc, c) => acc + (c.critical_count || 0) + (c.high_count || 0), 0)}
                </div>
                <span className="text-[11px] text-rose-400 block font-mono">Prioridade imediata</span>
              </div>
            </div>

            {/* Campanhas Recentes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Campanhas Recentes de Avaliação</h3>
                  <p className="text-xs text-slate-400">Selecione uma campanha para abrir o monitor ou emitir relatórios.</p>
                </div>
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold rounded-xl transition flex items-center gap-1 font-mono"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Campanha</span>
                </button>
              </div>

              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <div className="p-8 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">Nenhuma Campanha Executada</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Nenhum ativo descoberto ou finding registrado ainda. Inicie sua primeira campanha de auditoria para acionar os 17 motores e 18 agentes autônomos.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsWizardOpen(true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>INICIAR PRIMEIRA CAMPANHA</span>
                    </button>
                  </div>
                ) : (
                  campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      onClick={() => {
                        setActiveCampaign(camp);
                        setActiveTab('monitor');
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        activeCampaign?.id === camp.id
                          ? 'bg-slate-850 border-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 w-full md:w-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-emerald-400">{camp.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            camp.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-300' :
                            camp.status === 'RUNNING' ? 'bg-cyan-500/10 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {camp.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            • {new Date(camp.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{camp.name}</h4>
                        <p className="text-xs font-mono text-slate-400 flex items-center gap-1 truncate">
                          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{camp.target}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs w-full md:w-auto justify-between md:justify-start border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block text-[10px]">ATIVOS</span>
                          <span className="text-slate-200 font-bold">{camp.assets_count}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">FINDINGS</span>
                          <span className="text-amber-400 font-bold">{camp.findings_count}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">RISCO</span>
                          <span className="text-rose-400 font-bold">{camp.overall_risk} ({camp.risk_score})</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MONITOR DE CAMPANHA ATIVA */}
        {activeTab === 'monitor' && (
          activeCampaign ? (
            <CampaignLiveMonitor
              campaign={activeCampaign}
              onViewReport={() => setActiveTab('reports')}
              onViewFindings={() => setActiveTab('findings')}
              onViewAssets={() => setActiveTab('assets')}
            />
          ) : (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-200">Nenhuma Campanha em Execução</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Selecione uma campanha anterior na Visão Geral ou crie uma nova campanha para acompanhar os 18 agentes em tempo real.
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>NOVA CAMPANHA</span>
              </button>
            </div>
          )
        )}

        {/* TAB 3: AGENTES (18) */}
        {activeTab === 'agents' && (
          <AgentsCatalogView />
        )}

        {/* TAB 4: ASSETS EXPLORER */}
        {activeTab === 'assets' && (
          <AssetsExplorerView
            assets={activeCampaign?.assets || []}
            targetRoot={activeCampaign?.target || 'alvo-autorizado.com'}
          />
        )}

        {/* TAB 5: FINDINGS */}
        {activeTab === 'findings' && (
          <FindingsView
            findings={activeCampaign?.findings || []}
            targetName={activeCampaign?.target || 'alvo-autorizado.com'}
          />
        )}

        {/* TAB 6: EVIDENCE */}
        {activeTab === 'evidence' && (
          <EvidenceLedgerView
            findings={activeCampaign?.findings || []}
          />
        )}

        {/* TAB 7: RELATÓRIOS */}
        {activeTab === 'reports' && (
          activeCampaign ? (
            <ReportCenterView
              campaign={activeCampaign}
            />
          ) : (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-200">Nenhuma Campanha Selecionada</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Para exportar relatórios executivos ou técnicos em Markdown, JSON, JSONL ou HTML, execute ou selecione uma campanha.
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>INICIAR CAMPANHA</span>
              </button>
            </div>
          )
        )}

        {/* TAB 8: CONFIGURAÇÕES */}
        {activeTab === 'settings' && (
          <SettingsView
            systemStatus={systemStatus}
            onRefreshStatus={() => {}}
          />
        )}

      </main>

      {/* MODAL: NOVA CAMPANHA */}
      <NewCampaignWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onStartCampaign={handleStartNewCampaign}
        systemStatus={systemStatus}
      />

    </div>
  );
}
