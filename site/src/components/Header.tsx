import React, { useState } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Sliders, 
  Zap, 
  Presentation, 
  Layers, 
  Copy, 
  Check, 
  Search,
  FileText,
  Menu,
  X,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import CyberLogo from './CyberLogo';

interface HeaderProps {
  activeTab: 'site' | 'slides';
  setActiveTab: (tab: 'site' | 'slides') => void;
  onSearchClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onSearchClick }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyClone = () => {
    navigator.clipboard.writeText('git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (activeTab === 'slides') {
      setActiveTab('site');
    }
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
            title="cwe-discover — CyberHuntLab"
          >
            <CyberLogo size="sm" subtitle="by CyberHuntLab" />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs font-medium text-slate-300">
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
            href="#comandos-cli" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comandos</span>
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
            href="#receitas" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Cenários</span>
          </a>
          <a 
            href="#manual" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Manual</span>
          </a>
          <a 
            href="#readme-export" 
            className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-900 transition flex items-center gap-1.5 text-cyan-300 font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub / README</span>
          </a>
        </nav>

        {/* Right Actions Bar (Mobile compact & touch-friendly) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Search Button */}
          <button
            onClick={onSearchClick}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1.5 text-xs"
            title="Buscar no Manual (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden xl:inline font-mono text-[11px] text-slate-400">Buscar (Ctrl+K)</span>
          </button>

          {/* Portal Link (Desktop) */}
          <a
            href="https://cyberhuntlab.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition"
            title="CyberHuntLab Portal"
          >
            <span>cyberhuntlab.com.br</span>
          </a>

          {/* Clone Button (Desktop) */}
          <button
            onClick={handleCopyClone}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-mono transition"
            title="Copiar comando git clone"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>git clone</span>
          </button>

          {/* Desktop Mode Switcher */}
          <div className="hidden md:flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-800">
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

          {/* Mobile Single Slide Icon Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'site' ? 'slides' : 'site')}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
            title={activeTab === 'site' ? 'Abrir Modo Slides' : 'Voltar ao Site'}
          >
            {activeTab === 'site' ? <Presentation className="w-4 h-4" /> : <BookOpen className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-3 py-3 space-y-2 shadow-2xl animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
          {/* Mobile Brand / Watermark Banner */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span>CyberHuntLab • Carol Lamas</span>
            <span className="text-[10px] text-cyan-400">cwe-discover v1.0</span>
          </div>

          <div className="grid grid-cols-1 gap-1 font-mono text-xs">
            <button
              onClick={() => handleNavClick('gerador-relatorio')}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-left flex items-center gap-2 font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gerador de Relatórios (Sem API)</span>
            </button>
            <button
              onClick={() => handleNavClick('arsenal-biblioteca')}
              className="p-2 rounded-xl hover:bg-slate-900 text-emerald-300 text-left flex items-center gap-2 font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Biblioteca & Arsenal de Comandos (20k)</span>
            </button>
            <button
              onClick={() => handleNavClick('comandos-cli')}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gerador de Comandos CLI</span>
            </button>
            <button
              onClick={() => handleNavClick('risk-score')}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Calculadora de Risk Score</span>
            </button>
            <button
              onClick={() => handleNavClick('autonomous-suite')}
              className="p-2 rounded-xl hover:bg-slate-900 text-cyan-300 text-left flex items-center gap-2 font-semibold"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Suite Autônoma (Zero Go/Binários)</span>
            </button>
            <button
              onClick={() => handleNavClick('cwes')}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Catálogo & Matriz de CWEs</span>
            </button>
            <button
              onClick={() => handleNavClick('receitas')}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span>Cenários & Automação Termux</span>
            </button>
            <button
              onClick={() => handleNavClick('manual')}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-200 text-left flex items-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Manual Completo (28 Capítulos)</span>
            </button>
            <button
              onClick={() => handleNavClick('readme-export')}
              className="p-2 rounded-xl hover:bg-slate-900 text-cyan-300 text-left flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>README Oficial & Exportação GitHub</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveTab(activeTab === 'site' ? 'slides' : 'site');
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 text-cyan-300 border border-slate-800 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{activeTab === 'site' ? 'Abrir Slides' : 'Voltar ao Site'}</span>
            </button>
            <button
              onClick={handleCopyClone}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'git clone'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
