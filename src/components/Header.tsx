import React, { useState } from 'react';
import { 
  BookOpen, 
  Sliders, 
  Zap, 
  Presentation, 
  Layers, 
  Search,
  FileText,
  Menu,
  X,
  ShieldCheck,
  Cpu,
  KeyRound,
  DollarSign,
  Video,
  Terminal
} from 'lucide-react';
import CyberLogo from './CyberLogo';

interface HeaderProps {
  activeTab: 'site' | 'slides' | 'setup' | 'manuals';
  setActiveTab: (tab: 'site' | 'slides' | 'setup' | 'manuals') => void;
  onSearchClick: () => void;
  onOpenActivation?: () => void;
  onOpenCheckout?: () => void;
  onOpenSetup?: () => void;
  onOpenWorkspace?: () => void;
  onOpenManuals?: (tab?: 'guide' | 'steps' | 'videos' | 'policies') => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onSearchClick,
  onOpenActivation,
  onOpenCheckout,
  onOpenSetup,
  onOpenWorkspace,
  onOpenManuals
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (activeTab === 'slides' || activeTab === 'setup') {
      setActiveTab('site');
    }
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <a 
            href="#" 
            onClick={() => handleNavClick()}
            className="flex items-center transition hover:opacity-90"
            title="Cyber Hunter Lab"
          >
            <CyberLogo size="sm" subtitle="Plataforma Autônoma" />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs font-medium text-slate-300">
          <a 
            href="#arvore-funcional" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>17 Engines</span>
          </a>
          <a 
            href="#gerador-relatorio" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-emerald-300 font-semibold"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Relatórios</span>
          </a>
          <a 
            href="#arsenal-biblioteca" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-emerald-300 font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Arsenal (20k)</span>
          </a>
          <a 
            href="#planos" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-amber-300 font-semibold"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Planos (Pix)</span>
          </a>
          <a 
            href="#risk-score" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Risk Score</span>
          </a>
          <a 
            href="#autonomous-suite" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-cyan-300 font-semibold"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Suite Autônoma</span>
          </a>
          <a 
            href="#cwes" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>CWEs</span>
          </a>
          <a 
            href="#manual" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Manual</span>
          </a>
        </nav>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Search Button (Desktop only — mobile & tablet use the hamburger menu) */}
          <button
            onClick={onSearchClick}
            className="hidden lg:flex p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition items-center gap-1.5 text-xs"
            title="Buscar no Manual (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden xl:inline font-mono text-[11px] text-slate-400">Buscar (Ctrl+K)</span>
          </button>

          {/* Setup Button (Desktop) */}
          <button
            onClick={onOpenSetup}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            title="Abrir Guia de Setup & Instalação"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Setup</span>
          </button>

          {/* Adquirir com Pix Button (Desktop) */}
          <button
            onClick={onOpenCheckout}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            title="Assinar com Pix (R$ 47/mês)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Assinar Pix</span>
          </button>

          {/* License Activation Button (Desktop) */}
          <button
            onClick={onOpenActivation}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
            title="Ativar Chave de Licença"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ativar Chave</span>
          </button>

          {/* Workspace Button (Desktop) */}
          <button
            onClick={onOpenWorkspace}
            className="hidden lg:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm shadow-emerald-500/20 transition"
            title="Acessar Workspace"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>WORKSPACE</span>
          </button>

          {/* Desktop Mode Switcher (Desktop only — mobile & tablet use the hamburger menu) */}
          <div className="hidden lg:flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('site')}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'site'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Site</span>
            </button>
            <button
              onClick={() => setActiveTab('manuals')}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'manuals'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Manual & Aulas</span>
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'setup'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Setup</span>
            </button>
            <button
              onClick={() => setActiveTab('slides')}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'slides'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3 h-3" />
              <span>Slides</span>
            </button>
          </div>

          {/* Mobile Clean Hamburger Menu Toggle (Only button on mobile header) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition flex items-center justify-center min-w-[40px] min-h-[40px]"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-3 shadow-2xl animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
          {/* Mobile Brand / Watermark Banner */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <span>CyberHuntLab • Carol Lamas</span>
            <span className="text-[10px] text-cyan-400">Plataforma Autônoma</span>
          </div>

          {/* Primary Mobile Action Buttons */}
          <div className="grid grid-cols-1 gap-2 font-mono text-xs">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenWorkspace?.(); }}
              className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>ACESSAR WORKSPACE</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCheckout?.(); }}
              className="p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 text-amber-300 text-center font-semibold flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Assinar Plano Pix (R$ 47/mês)</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenActivation?.(); }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-cyan-300 text-center font-semibold flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Inserir Chave de Ativação</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenManuals) {
                  onOpenManuals();
                } else {
                  setActiveTab('manuals');
                }
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/30 text-emerald-300 text-center font-semibold flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Manual & Videoaulas (6 Aulas)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSetup) {
                  onOpenSetup();
                } else {
                  setActiveTab('setup');
                }
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/30 text-emerald-300 text-center font-semibold flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Guia de Setup & Instalação</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onSearchClick(); }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-center font-semibold flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Buscar no Manual (Ctrl+K)</span>
            </button>
          </div>

          {/* Section Navigation Links */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block px-1 font-bold">Navegação Rápida</span>
            <button
              onClick={() => handleNavClick('arvore-funcional')}
              className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-left flex items-center gap-2 font-bold min-h-[44px]"
            >
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Árvore Funcional (17 Engines Autorais)</span>
            </button>
            <button
              onClick={() => handleNavClick('gerador-relatorio')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-emerald-300 text-left flex items-center gap-2 font-semibold min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gerador de Relatórios (Sem API)</span>
            </button>
            <button
              onClick={() => handleNavClick('arsenal-biblioteca')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2 font-semibold min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Biblioteca & Arsenal de Capacidades (20k)</span>
            </button>
            <button
              onClick={() => handleNavClick('planos')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-amber-300 text-left flex items-center gap-2 font-semibold min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Planos Comerciais & Pix</span>
            </button>
            <button
              onClick={() => handleNavClick('risk-score')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2 min-h-[44px]"
            >
              <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Calculadora de Risk Score</span>
            </button>
            <button
              onClick={() => handleNavClick('autonomous-suite')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-cyan-300 text-left flex items-center gap-2 font-semibold min-h-[44px]"
            >
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Suite Autônoma (Zero Go/Binários)</span>
            </button>
            <button
              onClick={() => handleNavClick('cwes')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2 min-h-[44px]"
            >
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Catálogo & Matriz de CWEs</span>
            </button>
            <button
              onClick={() => handleNavClick('manual')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Manual Completo (28 Capítulos)</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveTab(activeTab === 'site' ? 'slides' : 'site');
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-cyan-300 border border-slate-800 text-xs font-mono flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Presentation className="w-4 h-4" />
              <span>{activeTab === 'site' ? 'Abrir Slides Deck' : 'Voltar ao Site'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
