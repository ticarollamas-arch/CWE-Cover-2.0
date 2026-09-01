import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Video, 
  ShieldCheck, 
  Server, 
  Smartphone, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Layers, 
  Lock, 
  FileText, 
  HelpCircle, 
  Zap, 
  Globe, 
  Scale, 
  KeyRound, 
  Info,
  ChevronDown,
  ChevronUp,
  Play,
  Clock
} from 'lucide-react';
import CyberLogo from '../CyberLogo';

interface ManualsKnowledgeCenterProps {
  onClose?: () => void;
  onOpenSetup?: () => void;
  onOpenWorkspace?: () => void;
  onOpenActivation?: () => void;
  initialTab?: 'guide' | 'steps' | 'videos' | 'policies';
}

interface VideoLesson {
  id: number;
  title: string;
  stage: string;
  description: string;
  youtube_url: string;
  duration: string;
  topics: string[];
  updated_at: string;
}

export default function ManualsKnowledgeCenter({
  onClose,
  onOpenSetup,
  onOpenWorkspace,
  onOpenActivation,
  initialTab = 'guide'
}: ManualsKnowledgeCenterProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'steps' | 'videos' | 'policies'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoadingVideos(true);
      try {
        const res = await fetch('/api/video-lessons');
        const data = await res.json();
        if (res.ok && data.lessons) {
          setVideoLessons(data.lessons);
        }
      } catch (err) {
        console.error('Erro ao carregar videoaulas:', err);
      } finally {
        setIsLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper para extrair embed URL do YouTube
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <CyberLogo size="sm" subtitle="Manual & Central de Conhecimento" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <span>DOCUMENTAÇÃO OFICIAL</span>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onOpenSetup && (
              <button
                onClick={onOpenSetup}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Abrir Setup</span>
              </button>
            )}

            {onOpenWorkspace && (
              <button
                onClick={onOpenWorkspace}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WORKSPACE</span>
              </button>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono rounded-xl transition"
              >
                Voltar
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Navigation Subheader */}
      <div className="bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>1. Ambiente & Guia Rápido</span>
            </button>

            <button
              onClick={() => setActiveTab('steps')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'steps'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>2. Manual em 10 Etapas</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>3. Central de Videoaulas (6 Aulas)</span>
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'policies'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>4. Políticas & Uso Responsável</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em manuais e comandos..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: AMBIENTE RECOMENDADO & GUIA RÁPIDO                                */}
        {/* ========================================================================= */}
        {activeTab === 'guide' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            
            {/* Header Banner */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Server className="w-3.5 h-3.5" />
                    <span>AMBIENTE RECOMENDADO: VPS LINUX</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                    Arquitetura Operacional & Configuração de Ambiente
                  </h1>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    O <strong>Cyber Hunter Lab</strong> foi projetado para executar seu runtime de 17 motores e 18 agentes em um ambiente Linux com recursos adequados (Debian 12, Ubuntu 22.04+, Kali Linux ou VPS Linux equivalente). A interface gráfica é acessada pelo navegador do seu celular ou computador.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shrink-0 text-xs font-mono space-y-2 min-w-[240px]">
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">Distribuições Recomendadas</span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span>• Debian 12 (Bookworm)</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Ideal</span>
                    </div>
                    <div className="flex items-center justify-between text-cyan-300">
                      <span>• Ubuntu 22.04 / 24.04</span>
                      <span className="text-[10px] text-cyan-400">Excelente</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-300">
                      <span>• Kali Linux 2024+</span>
                      <span className="text-[10px] text-amber-400">Compatível</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arquitetura Visual Diagram */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Fluxo de Arquitetura em Nuvem & Acesso Remoto
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono text-center">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <Smartphone className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                    <span className="font-bold text-slate-200 block">CELULAR / PC</span>
                    <span className="text-[10px] text-slate-400">Dispositivo de Acesso</span>
                  </div>

                  <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">
                    ➔
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <Globe className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                    <span className="font-bold text-slate-200 block">NAVEGADOR</span>
                    <span className="text-[10px] text-emerald-400">Interface Gráfica</span>
                  </div>

                  <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">
                    ➔
                  </div>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-left">
                    <Server className="w-5 h-5 text-emerald-400 mb-1.5" />
                    <span className="font-bold text-emerald-300 block">VPS LINUX (Runtime)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">• 17 Motores & 18 Agentes</span>
                    <span className="text-[10px] text-slate-400 block">• Evidence Ledger SHA-256</span>
                    <span className="text-[10px] text-slate-400 block">• Relatórios Automatizados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO CELULAR + TERMUX + VPS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Celular + VPS Explicado */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-cyan-400">CENÁRIO RECOMENDADO</span>
                    <h2 className="text-lg font-bold text-slate-100">Uso pelo Celular (Android + Termux + VPS)</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  O usuário pode administrar e acessar o <strong>Cyber Hunter Lab</strong> inteiramente pelo celular. 
                  O celular funciona como o dispositivo de comando (via <strong>Termux</strong> para SSH e navegador para a interface gráfica), enquanto a execução pesada, requisições de rede assíncronas e inferências de IA ocorrem com estabilidade 24/7 na VPS Linux.
                </p>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <span className="text-slate-400 font-bold block text-[11px]">FLUXO MOBILE SIMPLIFICADO:</span>
                  <div className="space-y-1 text-slate-300">
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400">1.</span>
                      <span>Abra o <strong>Termux</strong> no Android para conectar via SSH à sua VPS.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400">2.</span>
                      <span>Execute o comando de inicialização fornecido pelo Setup.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400">3.</span>
                      <span>Abra o <strong>Chrome / Firefox</strong> no celular e acesse o Workspace.</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://f-droid.org/packages/com.termux/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <span>Download Oficial Termux (F-Droid)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* AVISO DE LIMITAÇÕES NO CELULAR */}
              <div className="p-6 bg-amber-950/20 border border-amber-500/40 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-amber-400">AVISO TÉCNICO IMPORTANTE</span>
                    <h2 className="text-lg font-bold text-amber-200">Limitações de Execução Direta no Celular</h2>
                  </div>
                </div>

                <p className="text-xs text-amber-200/90 leading-relaxed">
                  A execução de todo o runtime <em>diretamente</em> no hardware do Android (sem uma VPS) pode apresentar limitações severas de:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20 text-slate-300">
                    • Limitação de CPU e RAM
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20 text-slate-300">
                    • Suspensão de processos
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20 text-slate-300">
                    • Restrições de Raw Sockets
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20 text-slate-300">
                    • Compilação de pacotes C
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 block">Root no celular:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Se o smartphone possuir root, certas restrições de permissão de socket diminuem, porém isso <strong>não equivale ao poder de processamento, conectividade e estabilidade de uma VPS Linux dedicada</strong>. Recomendamos fortemente a arquitetura com VPS.
                  </p>
                </div>
              </div>

            </div>

            {/* SEÇÃO: COMEÇANDO EM 5 PASSOS */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">GUIA RÁPIDO DE INICIAÇÃO</span>
                <h2 className="text-xl font-bold text-slate-100">Começando em 5 Passos Simples</h2>
                <p className="text-xs text-slate-400">
                  Uma jornada descomplicada para você que comprou a licença e deseja colocar o Cyber Hunter em operação:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                {[
                  {
                    step: '1',
                    title: 'Prepare o Ambiente',
                    desc: 'Contrate uma VPS Linux (Debian/Ubuntu) ou prepare seu PC Linux com Python 3.10+ e Node.js v20+.',
                    icon: Server,
                    color: 'emerald'
                  },
                  {
                    step: '2',
                    title: 'Instale o Runtime',
                    desc: 'Clone o repositório oficial e instale as dependências com os comandos fornecidos pelo Setup.',
                    icon: Terminal,
                    color: 'cyan'
                  },
                  {
                    step: '3',
                    title: 'Ative sua Chave',
                    desc: 'Insira sua chave de licença criptográfica recebida após a compra para liberar os 17 motores.',
                    icon: KeyRound,
                    color: 'amber'
                  },
                  {
                    step: '4',
                    title: 'Configure & Teste',
                    desc: 'Execute o diagnóstico de integridade e conecte a IA local (Ollama) ou utilize a heurística autoral.',
                    icon: Cpu,
                    color: 'purple'
                  },
                  {
                    step: '5',
                    title: 'Opere no Workspace',
                    desc: 'Abra o navegador, crie sua primeira campanha com escopo autorizado e acompanhe os 18 agentes.',
                    icon: ShieldCheck,
                    color: 'rose'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 relative">
                      <span className="text-2xl font-black font-mono text-slate-700 absolute top-3 right-4">
                        0{item.step}
                      </span>
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}

              </div>

              {/* Botões de Ação do Guia */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Precisa de comandos prontos? Consulte o <strong>Manual em 10 Etapas</strong> ou assista às <strong>Videoaulas</strong>.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('steps')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold border border-slate-700 transition"
                  >
                    Ver Manual em 10 Etapas
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Assistir às Videoaulas</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANUAL EM 10 ETAPAS COM COMANDOS COPIÁVEIS                         */}
        {/* ========================================================================= */}
        {activeTab === 'steps' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>COMANDOS OFICIAIS & PROCEDIMENTOS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Manual Completo em 10 Etapas
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl">
                Siga a sequência abaixo para preparar a VPS, instalar o runtime oficial do Cyber Hunter Lab, ativar sua licença e emitir seus relatórios com evidências criptográficas.
              </p>
            </div>

            {/* Steps Accordion */}
            <div className="space-y-4">
              
              {[
                {
                  step: 1,
                  title: 'ETAPA 01 — Preparando o Ambiente (VPS Linux / PC)',
                  desc: 'Atualização do catálogo de pacotes e instalação de compiladores essenciais no Debian, Ubuntu ou Kali.',
                  cmd: 'sudo apt update && sudo apt upgrade -y\nsudo apt install -y python3 python3-pip python3-venv git curl wget build-essential net-tools libpcap-dev',
                  purpose: 'Garante que o sistema possua os cabeçalhos de desenvolvimento, compilador C e bibliotecas de captura de pacotes para os motores de rede.',
                  expected: 'Todos os pacotes instalados com status 0 (sucesso), sem erros de repositório.'
                },
                {
                  step: 2,
                  title: 'ETAPA 02 — Instalando o Termux no Android (F-Droid)',
                  desc: 'Preparação do terminal móvel no celular Android através da distribuição oficial pelo repositório F-Droid.',
                  cmd: '# No Termux (Android):\npkg update && pkg upgrade -y\npkg install -y openssh git curl',
                  purpose: 'Configura o cliente SSH e ferramentas base no smartphone para conectar à sua VPS em qualquer lugar.',
                  expected: 'Prompt do Termux atualizado e comando `ssh` pronto para execução.'
                },
                {
                  step: 3,
                  title: 'ETAPA 03 — Conectando à VPS Linux via SSH',
                  desc: 'Estabelecendo uma sessão segura e criptografada com a sua VPS a partir do celular ou computador.',
                  cmd: 'ssh usuario@ip_da_sua_vps -p 22',
                  purpose: 'Acesso remoto ao terminal da máquina Linux onde o Cyber Hunter Lab será hospedado e executado.',
                  expected: 'Sessão remota aberta exibindo o banner do sistema Linux (ex: `root@vps:~#` ou `usuario@debian:~$`).'
                },
                {
                  step: 4,
                  title: 'ETAPA 04 — Clonando o Repositório Oficial do Cyber Hunter Lab',
                  desc: 'Download do código-fonte autorizado e criação do ambiente virtual Python isolado.',
                  cmd: 'git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git\ncd CWE-Cover-2.0\npython3 -m venv venv\nsource venv/bin/activate\npip install --upgrade pip\npip install -r requirements.txt',
                  purpose: 'Isola as dependências do software sem conflitar com os pacotes do sistema operacional.',
                  expected: 'Ambiente virtual `(venv)` ativo e todas as bibliotecas Python instaladas com sucesso.'
                },
                {
                  step: 5,
                  title: 'ETAPA 05 — Inicializando a Interface Gráfica & Servidor Local',
                  desc: 'Instalação dos módulos Node.js da interface e compilação do bundle de produção.',
                  cmd: 'npm install\nnpm run build\nnpm start',
                  purpose: 'Inicia o servidor na porta 3000 com suporte a WebSockets e API REST integrada.',
                  expected: 'Mensagem `Server running on http://localhost:3000` no terminal.'
                },
                {
                  step: 6,
                  title: 'ETAPA 06 — Ativando a Chave de Licença Criptográfica',
                  desc: 'Vínculo do identificador da sua instalação (Node ID) à chave recebida após a compra.',
                  cmd: '# Pela interface web, abra o Setup > Ativação de Licença\n# Ou execute via linha de comando:\npython3 cli/activate_license.py --key "CHL-XXXX-XXXX-XXXX-XXXX"',
                  purpose: 'Valida a assinatura criptográfica, libera os 17 motores autorais e o pipeline de 18 agentes.',
                  expected: 'Status `LICENÇA ATIVA` exibido com seu nome e plano correspondente.'
                },
                {
                  step: 7,
                  title: 'ETAPA 07 — Configurando IA Local (Ollama) & Fallback',
                  desc: 'Habilitação de inferência local sem envio de dados a provedores externos (opcional).',
                  cmd: '# Para instalar o Ollama na VPS:\ncurl -fsSL https://ollama.com/install.sh | sh\nollama run llama3:8b',
                  purpose: 'Permite análise semântica e sumarização offline através de modelos locais de código aberto.',
                  expected: 'Serviço Ollama respondendo em `http://127.0.0.1:11434`.'
                },
                {
                  step: 8,
                  title: 'ETAPA 08 — Criando o Primeiro Assessment Autorizado',
                  desc: 'Definição do escopo, limites de taxa e permissões no assistente do Workspace.',
                  cmd: '# Pelo navegador, clique em "WORKSPACE" > "NOVA CAMPANHA"\n# 1. Insira o domínio sob sua autorização expressa\n# 2. Selecione o perfil (Safe / Deep / Stealth)\n# 3. Marque a confirmação de autorização legal',
                  purpose: 'Inicia a orquestração do DAG de 18 agentes respeitando estritamente o escopo acordado.',
                  expected: 'Painel de telemetria exibindo o progresso em tempo real das 17 engines.'
                },
                {
                  step: 9,
                  title: 'ETAPA 09 — Triagem & Inspeção de Evidências SHA-256',
                  desc: 'Análise detalhada de cada anomalia classificada deterministicamente no MITRE CWE.',
                  cmd: '# No Workspace > Aba "Achados (Findings)" ou "Evidence Ledger"\n# Verifique o payload não intrusivo, hash SHA-256 e pontuação de Risk Score.',
                  purpose: 'Garante que todo achado seja reproduzível com zero falsos positivos e prova de integridade.',
                  expected: 'Lista de anomalias com pontuação de severidade ponderada e steps de reprodução.'
                },
                {
                  step: 10,
                  title: 'ETAPA 10 — Exportando Relatórios Executivos & Técnicos',
                  desc: 'Geração de relatórios nos formatos Markdown, HTML, JSON e rascunhos para HackerOne/Bugcrowd.',
                  cmd: '# No Workspace > Aba "Relatórios" ou pelo Gerador na Landing Page:\n# Clique em "Exportar Markdown (EN/PT)", "Exportar HTML" ou "JSON Estruturado".',
                  purpose: 'Documento profissional com resumo executivo, evidências técnicas e passos de remediação.',
                  expected: 'Arquivo baixado contendo todo o dossiê da auditoria pronto para entrega ou submissão.'
                }
              ].map((st) => {
                const isExpanded = expandedStep === st.step;
                return (
                  <div 
                    key={st.step}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 transition hover:border-slate-700"
                  >
                    <div 
                      onClick={() => setExpandedStep(isExpanded ? null : st.step)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                          {st.step < 10 ? `0${st.step}` : st.step}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-100">{st.title}</h3>
                          <p className="text-xs text-slate-400">{st.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in">
                        
                        {/* Terminal Command Block */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span>COMANDO A EXECUTAR NO TERMINAL:</span>
                            <button
                              onClick={() => handleCopy(st.cmd)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 transition"
                            >
                              {copiedCode === st.cmd ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Copiar Comando</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto selection:bg-emerald-500 selection:text-slate-950">
                            {st.cmd}
                          </pre>
                        </div>

                        {/* Purpose & Expected Output */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                              FINALIDADE DO PROCEDIMENTO
                            </span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{st.purpose}</p>
                          </div>

                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                              RESULTADO ESPERADO
                            </span>
                            <p className="text-emerald-300/90 text-[11px] leading-relaxed">{st.expected}</p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CENTRAL DE VIDEOAULAS (6 AULAS DIDÁTICAS)                         */}
        {/* ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <Video className="w-3.5 h-3.5" />
                <span>CURSO EM VÍDEO & INSTRUÇÃO DIDÁTICA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Central de Videoaulas do Cyber Hunter Lab
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl">
                Aprenda visualmente a configurar seu ambiente, operar o Termux no celular, ativar sua licença e conduzir auditorias de segurança completas.
              </p>
            </div>

            {/* Video Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoLessons.map((lesson) => {
                const embedUrl = getEmbedUrl(lesson.youtube_url);
                const hasLink = Boolean(embedUrl);

                return (
                  <div 
                    key={lesson.id}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div className="space-y-3">
                      
                      {/* Video Player or Placeholder */}
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
                        {hasLink ? (
                          <iframe
                            src={embedUrl!}
                            title={lesson.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="p-6 text-center space-y-2 max-w-xs">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                              <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-amber-300 block font-mono">
                              Videoaula ainda não disponível
                            </span>
                            <p className="text-[11px] text-slate-400 leading-tight">
                              Em gravação e produção pela instrutora. O link será disponibilizado em breve pelo Administrador.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Header Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold uppercase">{lesson.stage}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100 leading-snug">{lesson.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{lesson.description}</p>
                      </div>

                      {/* Covered Topics */}
                      {lesson.topics && lesson.topics.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                            TÓPICOS ABORDADOS NESSA AULA:
                          </span>
                          <ul className="space-y-1 text-xs text-slate-400">
                            {lesson.topics.map((tp, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <span className="text-emerald-400 mt-0.5">•</span>
                                <span>{tp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        hasLink
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}>
                        {hasLink ? 'DISPONÍVEL EM VÍDEO' : 'EM GRAVAÇÃO'}
                      </span>

                      {hasLink && lesson.youtube_url && (
                        <a
                          href={lesson.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Assistir no YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: POLÍTICAS DE USO, BUG BOUNTY & LEGISLAÇÃO                          */}
        {/* ========================================================================= */}
        {activeTab === 'policies' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>GOVERNANÇA, ÉTICA & CONFORMIDADE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Políticas de Uso Responsável, Bug Bounty & Legislação
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl">
                O Cyber Hunter Lab é uma plataforma profissional de avaliação e segurança defensiva. Conheça as diretrizes éticas e legais obrigatórias para sua operação.
              </p>
            </div>

            {/* Grid com as 4 Seções de Governança */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. POLÍTICAS E USO RESPONSÁVEL */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-emerald-400">DIRETRIZ DE OPERAÇÃO</span>
                    <h2 className="text-base font-bold text-slate-100">Uso Responsável & Autorização Prévia</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  O usuário é o único responsável por garantir que possui autorização expressa e formal do proprietário dos ativos antes de iniciar qualquer varredura ou assessment.
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-emerald-300 block">• Escopo Estritamente Autorizado</span>
                    <p className="text-[11px] text-slate-400">Varreduras devem se limitar aos domínios, subdomínios e faixas de IP contratadas ou constantes no programa.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-emerald-300 block">• Respeito a Limites de Taxa (RPS)</span>
                    <p className="text-[11px] text-slate-400">O Cyber Hunter opera em até 10 requisições/seg por padrão para evitar sobrecarga de infraestrutura.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-rose-300 block">• Proibição de Atividades Destrutivas (DoS)</span>
                    <p className="text-[11px] text-slate-400">É expressamente proibido utilizar a ferramenta para causar indisponibilidade de serviços ou extração ilícita de dados.</p>
                  </div>
                </div>
              </div>

              {/* 2. BOAS PRÁTICAS EM BUG BOUNTY */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-cyan-400">BUG BOUNTY STANDARDS</span>
                    <h2 className="text-base font-bold text-slate-100">Boas Práticas em Programas de Bug Bounty</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Cada programa de Bug Bounty em plataformas como HackerOne, Bugcrowd ou Intigriti possui sua própria política de escopo e *Safe Harbor*.
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-cyan-300 block">• Verificação de Ativos In-Scope vs Out-of-Scope</span>
                    <p className="text-[11px] text-slate-400">Nunca audite serviços de terceiros integrados (gateways de pagamento, helpdesks) a menos que explicitamente autorizados.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-cyan-300 block">• Coordinated Vulnerability Disclosure (CVD)</span>
                    <p className="text-[11px] text-slate-400">Relate os achados com discrição e aguarde a correção antes de qualquer divulgação pública.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-cyan-300 block">• Evidências Reproduzíveis</span>
                    <p className="text-[11px] text-slate-400">Utilize o ledger imutável de evidências gerado pelo Cyber Hunter para comprovar o impacto sem ruído.</p>
                  </div>
                </div>
              </div>

              {/* 3. LEGISLAÇÃO E CONFORMIDADE */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-amber-400">MARCO LEGAL & CONFORMIDADE</span>
                    <h2 className="text-base font-bold text-slate-100">Legislação Aplicável</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para usuários operando no Brasil, deve-se observar a legislação pertinente sobre crimes informáticos e proteção de dados:
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-amber-300 block">• Lei de Crimes Cibernéticos (Lei 12.737/12 - Art. 154-A)</span>
                    <p className="text-[11px] text-slate-400">Tipifica a invasão não autorizada de dispositivo informático. A autorização formal prévia é mandatória.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-amber-300 block">• Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18)</span>
                    <p className="text-[11px] text-slate-400">Exige tratamento ético de dados pessoais eventualmente expostos, com proibição de cópia ou disseminação.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-amber-300 block">• Marco Civil da Internet (Lei 12.965/14)</span>
                    <p className="text-[11px] text-slate-400">Estabelece direitos, garantias e deveres para o uso da Internet no Brasil.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed font-mono">
                  ⚠ <strong>Aviso Legal:</strong> As informações desta seção são estritamente educacionais e não substituem orientação jurídica profissional especializada. O usuário é o único responsável por verificar leis, contratos e políticas aplicáveis.
                </div>
              </div>

              {/* 4. POLÍTICA DE DADOS, PRIVACIDADE E CREDENCIAIS */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-purple-400">PRIVACIDADE LOCAL & SEGURANÇA</span>
                    <h2 className="text-base font-bold text-slate-100">Privacidade dos Dados & Credenciais</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Transparência total sobre como seus dados, evidências e chaves são tratados pela arquitetura:
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-purple-300 block">• Armazenamento 100% Local na sua VPS</span>
                    <p className="text-[11px] text-slate-400">Todas as evidências, relatórios, campanhas e hashes SHA-256 residem exclusivamente na pasta <code className="text-purple-300 font-mono">.cyber_hunter_data/</code> do seu servidor.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-purple-300 block">• Segurança de Credenciais & Segredos</span>
                    <p className="text-[11px] text-slate-400">Nunca publique chaves SSH, senhas ou tokens de API. Utilize variáveis de ambiente para armazenamento seguro.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="font-bold text-purple-300 block">• Telemetria de Ativação</span>
                    <p className="text-[11px] text-slate-400">O processo de validação de licença apenas verifica a assinatura criptográfica e o hash do Node ID para garantir o plano adquirido.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
