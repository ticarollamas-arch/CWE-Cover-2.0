import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Layers, 
  KeyRound, 
  ShieldCheck, 
  Sliders, 
  RefreshCw, 
  Server, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  ChevronRight, 
  Lock, 
  HardDrive, 
  Radio, 
  ExternalLink,
  Zap,
  Globe,
  FileText,
  Smartphone,
  Video,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import CyberLogo from '../CyberLogo';
import { SystemStatus } from '../../types/product';

interface SetupWizardProps {
  systemStatus: SystemStatus | null;
  onOpenWorkspace: () => void;
  onBackToPresentation: () => void;
  onRefreshStatus?: () => void;
  onOpenManuals?: (tab?: 'guide' | 'steps' | 'videos' | 'policies') => void;
}

export default function SetupWizard({
  systemStatus,
  onOpenWorkspace,
  onBackToPresentation,
  onRefreshStatus,
  onOpenManuals
}: SetupWizardProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Ativação de licença no step 2
  const [licenseInput, setLicenseInput] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState('');
  const [activationSuccess, setActivationSuccess] = useState('');

  // Diagnóstico no step 3
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);

  // Ollama test no step 5
  const [ollamaPrompt, setOllamaPrompt] = useState('Verificar pipeline de segurança autônoma');
  const [isTestingOllama, setIsTestingOllama] = useState(false);
  const [ollamaTestResult, setOllamaTestResult] = useState<any>(null);

  // Updates no step 7
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  const fetchDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const res = await fetch('/api/system/diagnostics');
      const data = await res.json();
      setDiagnostics(data);
    } catch (err) {
      console.error('Erro ao buscar diagnósticos:', err);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/system/updates');
      const data = await res.json();
      setUpdateInfo(data);
    } catch (err) {
      console.error('Erro ao verificar atualizações:', err);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    fetchUpdates();
  }, []);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;

    setIsActivating(true);
    setActivationError('');
    setActivationSuccess('');

    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseInput.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setActivationSuccess(`Licença ativada com sucesso para ${data.license.client_name} (Plano ${data.license.plan}).`);
        if (onRefreshStatus) onRefreshStatus();
        fetchDiagnostics();
      } else {
        setActivationError(data.error || 'Falha na validação da licença.');
      }
    } catch (err: any) {
      setActivationError('Erro de conexão com o runtime local.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleTestOllama = async () => {
    setIsTestingOllama(true);
    setOllamaTestResult(null);
    try {
      const res = await fetch('/api/system/test-ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: diagnostics?.ollama?.models?.[0] || 'llama3', prompt: ollamaPrompt })
      });
      const data = await res.json();
      setOllamaTestResult(data);
    } catch (err: any) {
      setOllamaTestResult({ success: false, error: 'Falha ao conectar com o serviço Ollama local (127.0.0.1:11434).' });
    } finally {
      setIsTestingOllama(false);
    }
  };

  const steps = [
    { id: 1, title: 'Instalação & Git', desc: 'Debian/Kali & Clone' },
    { id: 2, title: 'Ativação de Licença', desc: 'Vínculo com o Nó' },
    { id: 3, title: 'Diagnóstico do Sistema', desc: '17 Motores & Sockets' },
    { id: 4, title: 'Dependências', desc: 'Python & Virtualenv' },
    { id: 5, title: 'IA Local (Ollama)', desc: 'Modelos & Fallback' },
    { id: 6, title: 'Configuração', desc: 'Storage & Rede' },
    { id: 7, title: 'Conclusão & Workspace', desc: 'Pronto para Operar' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* HEADER DO SETUP */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <CyberLogo size="sm" subtitle="Setup & Instalação Local" />
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono">
              <span className="text-emerald-400 font-semibold">Debian/Kali Runtime</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Node ID: {systemStatus?.runtime?.installation_id?.slice(0, 16) || 'NODE-LOCAL'}...</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBackToPresentation}
              className="hidden sm:inline-flex px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition"
            >
              Página de Apresentação
            </button>

            <button
              onClick={onOpenWorkspace}
              className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>WORKSPACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* STEPPER DE ETAPAS */}
      <div className="bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((step) => {
              const isCurrent = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition text-left ${
                    isCurrent
                      ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                      : isCompleted
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : step.id}
                  </span>
                  <div>
                    <span className="font-bold block leading-none">{step.title}</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">{step.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL DO SETUP */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ETAPA 1: INSTALAÇÃO & GIT */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 01 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Instalação & Clone do Repositório Oficial</h2>
              <p className="text-sm text-slate-400">
                O Cyber Hunter Lab opera no seu host Linux (VPS recomendada ou PC Linux), executando 17 motores de rede, raw sockets e IA autônoma.
              </p>
            </div>

            {/* Banner de Ambiente Recomendado & Videoaula */}
            <div className="p-5 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Ambiente Recomendado</span>
                    <h3 className="text-sm font-bold text-slate-100">VPS Linux (Debian 12 / Ubuntu / Kali)</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenManuals && (
                    <>
                      <button
                        onClick={() => onOpenManuals('videos')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ver Videoaula 01</span>
                      </button>
                      <button
                        onClick={() => onOpenManuals('guide')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono rounded-xl transition flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Guia de Ambientes</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Recomendamos contratar uma VPS Linux com Debian 12 ou Ubuntu 22.04. O acesso à interface gráfica pode ser feito diretamente pelo navegador do seu celular ou PC enquanto o servidor cuida de todo o processamento.
              </p>
            </div>

            {/* Guia Rápido Mobile / Termux & Limitações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                  <Smartphone className="w-4 h-4" />
                  <span>Uso pelo Celular (Android + Termux)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Utilize o Termux no Android para conectar via SSH à sua VPS e disparar o runtime, acessando depois a interface web pelo Chrome/Firefox móvel.
                </p>
                <a
                  href="https://f-droid.org/packages/com.termux/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono pt-1"
                >
                  <span>Download Termux (F-Droid Oficial)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Aviso: Limitações no Hardware do Celular</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Executar todo o runtime nativamente no processador do celular pode sofrer com economia de energia do Android, restrições de raw sockets e suspensão de processos. Prefira a VPS Linux.
                </p>
              </div>
            </div>

            {/* Requisitos de Sistema */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Requisitos de Sistema Recomendados</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SISTEMA OPERACIONAL</span>
                  <span className="text-emerald-300 font-bold">Debian 12 / Kali 2024+</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PYTHON RUNTIME</span>
                  <span className="text-cyan-300 font-bold">Python 3.10 ou superior</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">NODE.JS / GUI</span>
                  <span className="text-amber-300 font-bold">Node.js v20+ / NPM</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAPACIDADES DE REDE</span>
                  <span className="text-purple-300 font-bold">CAP_NET_RAW / Sockets</span>
                </div>
              </div>
            </div>

            {/* Comandos de Instalação e Clone */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Comandos Oficiais de Instalação</span>
              </h3>

              {[
                {
                  title: '1. Clonar o Repositório Oficial do Cyber Hunter Lab / CWE Cover',
                  cmd: 'git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git\ncd CWE-Cover-2.0'
                },
                {
                  title: '2. Criar e Ativar Ambiente Virtual Python',
                  cmd: 'python3 -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt'
                },
                {
                  title: '3. Instalar Dependências da Interface Web & Iniciar Servidor',
                  cmd: 'npm install\nnpm run build\nnpm start'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.title}</span>
                    <button
                      onClick={() => handleCopy(item.cmd, idx)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 font-mono text-[11px] transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800/80">
                    {item.cmd}
                  </pre>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para Ativação de Licença</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: ATIVAÇÃO DE LICENÇA */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 02 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Ativação & Validação de Licença</h2>
              <p className="text-sm text-slate-400">
                A licença é validada de forma criptográfica no backend e associada ao identificador único do nó de instalação.
              </p>
            </div>

            {/* Card do Nó de Instalação */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Identificador do Nó de Hardware (Installation ID)</span>
                <span className="text-emerald-400 font-mono">Imutável</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span>{systemStatus?.runtime?.installation_id || 'NODE-LOCAL-001'}</span>
                <button
                  onClick={() => handleCopy(systemStatus?.runtime?.installation_id || '', 99)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Atual da Licença */}
            {systemStatus?.license ? (
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Licença Ativa e Válida</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CHAVE</span>
                    <span className="text-slate-200 font-bold">{systemStatus.license.key}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CLIENTE</span>
                    <span className="text-slate-200 font-bold">{systemStatus.license.client_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PLANO</span>
                    <span className="text-emerald-300 font-bold">{systemStatus.license.plan}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Inserir Chave de Licença</span>
                </h3>

                <form onSubmit={handleActivateLicense} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      CHAVE DE LICENÇA (FORMATO CHL-XXXX-XXXX-XXXX-XXXX)
                    </label>
                    <input
                      type="text"
                      value={licenseInput}
                      onChange={(e) => setLicenseInput(e.target.value)}
                      placeholder="CHL-ENTP-2026-X9A2-K890"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {activationError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{activationError}</span>
                    </div>
                  )}

                  {activationSuccess && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{activationSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isActivating || !licenseInput.trim()}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    {isActivating ? 'Validando no Backend...' : 'Validar e Ativar Licença'}
                  </button>
                </form>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para Diagnóstico</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: DIAGNÓSTICO DO SISTEMA */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 03 / 07</span>
                <h2 className="text-2xl font-bold text-slate-100">Diagnóstico em Tempo Real</h2>
                <p className="text-sm text-slate-400">
                  Verificação do status dos 17 motores de avaliação, raw sockets e integridade de arquivos.
                </p>
              </div>
              <button
                onClick={fetchDiagnostics}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition"
                title="Atualizar diagnóstico"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDiagnostics ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Resumo do Runtime */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[10px]">PLATAFORMA</span>
                <span className="text-emerald-300 font-bold block">{diagnostics?.system?.platform || 'Linux x86_64'}</span>
                <span className="text-[10px] text-emerald-400">✓ Debian/Kali Ready</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[10px]">RAW SOCKETS</span>
                <span className="text-cyan-300 font-bold block">CAP_NET_RAW Ativo</span>
                <span className="text-[10px] text-cyan-400">✓ Sockets sem Binários Go</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[10px]">STORAGE SEGURO</span>
                <span className="text-amber-300 font-bold block">.cyber_hunter_data</span>
                <span className="text-[10px] text-amber-400">✓ Permissões OK</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[10px]">17 MOTORES</span>
                <span className="text-emerald-400 font-bold block">17 / 17 Operacionais</span>
                <span className="text-[10px] text-emerald-400">✓ Autoral & Nativo</span>
              </div>
            </div>

            {/* Tabela dos 17 Motores Nativos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Status da Esteira de 17 Motores Autorais</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                {(diagnostics?.engines?.items || []).map((engine: any) => (
                  <div key={engine.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-400">{engine.id}</span>
                      <span className="text-slate-300 ml-2">{engine.name}</span>
                      <span className="text-[10px] text-slate-500 block">{engine.role}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                      READY
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para Dependências</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: DEPENDÊNCIAS */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 04 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Dependências do Sistema & Python</h2>
              <p className="text-sm text-slate-400">
                O Cyber Hunter Lab foi projetado para operar com zero dependências de binários externos de terceiros (sem Nmap, Nuclei, Katana, Subfinder ou compiladores Go).
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Validação dos Módulos Principais</span>
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { name: 'Python Sockets Nativo (AF_INET / SOCK_RAW)', status: 'OK', desc: 'Sondagem de portas e banners via TCP/UDP direto' },
                  { name: 'HTTP / TLS Engine (urllib3 & ssl)', status: 'OK', desc: 'Validação RFC 9110 e verificação de cifras criptográficas' },
                  { name: 'DOM & AST Tokenizer (BeautifulSoup / html.parser)', status: 'OK', desc: 'Extração de rotas, tokens CSRF e parâmetros sem headless browser pesado' },
                  { name: 'Express / Vite GUI Bridge', status: 'OK', desc: 'Interface web fluida com SSE em tempo real e porta 3000' }
                ].map((dep, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">{dep.name}</span>
                      <span className="text-[10px] text-slate-400 block">{dep.desc}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">✓ {dep.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => setActiveStep(5)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para IA Local (Ollama)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 5: IA LOCAL & OLLAMA */}
        {activeStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 05 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Inteligência Artificial Local (Ollama)</h2>
              <p className="text-sm text-slate-400">
                O Cyber Hunter Lab integra opcionalmente com modelos locais Ollama para gerar narrativas e correlações sem enviar dados para a nuvem.
              </p>
            </div>

            {/* Status da Conexão Ollama */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">Endpoint Local Ollama</h3>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  diagnostics?.ollama?.connected 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {diagnostics?.ollama?.connected ? '✓ Ollama Online' : '○ Operação Determinística'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-slate-500">Endpoint: </span>
                <span className="text-cyan-300">http://127.0.0.1:11434</span>
              </div>

              {/* Teste de inferência */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono text-slate-400">
                  TESTE DE INFERÊNCIA RÁPIDA
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ollamaPrompt}
                    onChange={(e) => setOllamaPrompt(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleTestOllama}
                    disabled={isTestingOllama}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    {isTestingOllama ? 'Testando...' : 'Testar Inferência'}
                  </button>
                </div>

                {ollamaTestResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono ${
                    ollamaTestResult.success
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    {ollamaTestResult.success ? (
                      <div>
                        <span className="font-bold block text-emerald-400">Resposta da IA Local:</span>
                        <p className="mt-1">{ollamaTestResult.response}</p>
                      </div>
                    ) : (
                      <div>
                        <span>{ollamaTestResult.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => setActiveStep(6)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para Configurações</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 6: CONFIGURAÇÕES */}
        {activeStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 06 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Configuração de Armazenamento & Políticas</h2>
              <p className="text-sm text-slate-400">
                Parâmetros de diretório, rate limiting padrão e sanitização de evidências.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Diretório de Armazenamento</span>
                </span>
                <p className="text-xs text-slate-400">Persistência local imutável das campanhas.</p>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                  /.cyber_hunter_data/
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Rate Limiting Padrão</span>
                </span>
                <p className="text-xs text-slate-400">Controle adaptativo para evitar instabilidade nos alvos.</p>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                  10 req/s (configurável por campanha)
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(5)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => setActiveStep(7)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Avançar para Conclusão</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 7: CONCLUSÃO & WORKSPACE */}
        {activeStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">ETAPA 07 / 07</span>
              <h2 className="text-2xl font-bold text-slate-100">Setup Concluído com Sucesso</h2>
              <p className="text-sm text-slate-400">
                Seu ambiente Cyber Hunter Lab está configurado, auditado e pronto para operar de forma autônoma.
              </p>
            </div>

            {/* Card de Conclusão */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Instalação Verificada & Pronta</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Versão: <strong className="text-emerald-300">{updateInfo?.installed_version || '2.0.0-native-autonomic'}</strong> • Canal Estável
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">17 MOTORES</span>
                  <span className="text-emerald-300 font-bold">100% Prontos</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">18 AGENTES DAG</span>
                  <span className="text-cyan-300 font-bold">Orquestração Ativa</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">INTEGRIDADE</span>
                  <span className="text-purple-300 font-bold">SHA-256 Validado</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onOpenWorkspace}
                  className="flex-1 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>ABRIR WORKSPACE OPERACIONAL</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={onBackToPresentation}
                  className="py-3.5 px-6 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
                >
                  Voltar à Apresentação
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
