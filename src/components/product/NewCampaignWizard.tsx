import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Zap, 
  Sparkles, 
  X,
  Play
} from 'lucide-react';
import { ScopeConfig } from '../../types/product';

interface NewCampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCampaign: (campaignData: { target: string; name: string; scope: ScopeConfig }) => void;
  systemStatus?: any;
}

export default function NewCampaignWizard({
  isOpen,
  onClose,
  onStartCampaign,
  systemStatus
}: NewCampaignWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [targetUrl, setTargetUrl] = useState('https://alvo-autorizado.com');
  const [campaignName, setCampaignName] = useState('');
  
  // Escopo
  const [allowSubdomains, setAllowSubdomains] = useState(true);
  const [authorizedEndpoints, setAuthorizedEndpoints] = useState('/api/*, /v1/*, /auth/*');
  const [rateLimitRps, setRateLimitRps] = useState(10);
  const [profile, setProfile] = useState<'safe' | 'authorized' | 'lab'>('authorized');
  const [hasAuthorization, setHasAuthorization] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCleanDomain = (url: string) => {
    return url.trim().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!targetUrl.trim()) {
        setError('Por favor, informe a URL ou domínio do alvo.');
        return;
      }
      const domain = getCleanDomain(targetUrl);
      if (!campaignName) {
        setCampaignName(`Auditoria Autônoma — ${domain}`);
      }
      setStep(2);
    } else if (step === 2) {
      if (!hasAuthorization) {
        setError('Você precisa confirmar autorização formal antes de prosseguir.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleStart = () => {
    const domain = getCleanDomain(targetUrl);
    const endpoints = authorizedEndpoints.split(',').map(e => e.trim()).filter(Boolean);

    onStartCampaign({
      target: targetUrl.trim().startsWith('http') ? targetUrl.trim() : `https://${targetUrl.trim()}`,
      name: campaignName.trim() || `Auditoria Autônoma — ${domain}`,
      scope: {
        domain,
        allow_subdomains: allowSubdomains,
        authorized_endpoints: endpoints.length ? endpoints : ['/*'],
        rate_limit_rps: rateLimitRps,
        profile
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Decorator */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Nova Campanha de Avaliação Autônoma</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Etapa {step} de 4: {
                step === 1 ? 'Definição do Alvo' :
                step === 2 ? 'Configuração de Escopo' :
                step === 3 ? 'Perfil de Avaliação' : 'Revisão & Início'
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: ALVO */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  URL ou Domínio do Alvo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://alvo-autorizado.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Informe a URL raiz ou domínio que você possui autorização expressa para avaliar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Identificador / Nome da Campanha (Opcional)
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder={`Auditoria Autônoma — ${getCleanDomain(targetUrl) || 'alvo'}`}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  O Cyber Hunter utilizará seus 17 motores autorais para mapear DNS, rotas, formulários e tecnologias sem disparar scanners de ruído ou invasivos.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: ESCOPO */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Fronteiras de Escopo Autorizado</span>
                </h4>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-900/60 cursor-pointer transition border border-transparent hover:border-slate-800">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div className="text-xs">
                    <span className="text-slate-200 font-semibold block">Domínio Principal: {getCleanDomain(targetUrl)}</span>
                    <span className="text-slate-400">Varredura mandatória do host base autorizado</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-900/60 cursor-pointer transition border border-transparent hover:border-slate-800">
                  <input
                    type="checkbox"
                    checked={allowSubdomains}
                    onChange={(e) => setAllowSubdomains(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div className="text-xs">
                    <span className="text-slate-200 font-semibold block">Subdomínios Relacionados (*.{getCleanDomain(targetUrl)})</span>
                    <span className="text-slate-400">Resolução de nomes via Certificate Transparency e DNS nativo</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Endpoints / Recursos Autorizados
                </label>
                <input
                  type="text"
                  value={authorizedEndpoints}
                  onChange={(e) => setAuthorizedEndpoints(e.target.value)}
                  placeholder="/api/*, /v1/*, /login"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separados por vírgula. Agentes só auditarão rotas contidas nessas regras.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Limite de Taxa (RPS):</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">10 requisições/seg</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Concorrência:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">Adaptativa (Token Bucket)</span>
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 bg-amber-950/20 border border-amber-500/40 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAuthorization}
                  onChange={(e) => setHasAuthorization(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded mt-0.5"
                />
                <span className="text-xs text-amber-200 leading-relaxed">
                  Declaro sob responsabilidade ética e jurídica possuir autorização formal para auditar os ativos especificados neste escopo.
                </span>
              </label>
            </div>
          )}

          {/* STEP 3: PERFIL DE AVALIAÇÃO */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-slate-300">
                Selecione o perfil de operação do Orquestrador:
              </p>

              <div className="space-y-3">
                <div
                  onClick={() => setProfile('safe')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    profile === 'safe'
                      ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">Modo Seguro (Reconhecimento 100% Passivo)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Recomendado</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Apenas consultas de DNS, inspeção passiva de cabeçalhos HTTP, certificados TLS e tokenização de páginas públicas sem qualquer teste de carga.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setProfile('authorized')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    profile === 'authorized'
                      ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">Modo Autorizado (Triagem Completa de Vulnerabilidades)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Padrão Bug Bounty</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Ativa o Crawler de rotas, detecção de repositórios Git/.env expostos, auditoria de headers e validação diferencial de hipóteses para descarte de falsos positivos.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setProfile('lab')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    profile === 'lab'
                      ? 'bg-violet-950/30 border-violet-500 ring-1 ring-violet-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 mt-0.5">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">Modo Laboratório / CTF</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">Redes Locais</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Permite varredura em faixas de IP privadas (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16) e ambientes isolados de teste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVISÃO E INÍCIO */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tudo Pronto para a Execução</span>
                </h4>
                <p className="text-xs text-slate-300">
                  O Orchestrator irá coordenar o DAG de 18 agentes especializados de forma 100% autônoma.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Alvo:</span>
                  <span className="text-emerald-300 font-bold truncate block">{targetUrl}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Perfil:</span>
                  <span className="text-cyan-300 font-bold uppercase">{profile}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Agentes:</span>
                  <span className="text-slate-100 font-semibold">18 Agentes Ativos</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">IA Local:</span>
                  <span className="text-slate-100 font-semibold">
                    {systemStatus?.ai_status?.connected ? 'Ollama Conectado' : 'Operação Autônoma'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
            >
              Cancelar
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>INICIAR ASSESSMENT</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
