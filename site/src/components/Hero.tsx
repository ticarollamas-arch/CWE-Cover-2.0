import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  TrendingUp, 
  Smartphone, 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  Presentation,
  Shield,
  Layers,
  Lock
} from 'lucide-react';
import CyberLogo from './CyberLogo';

interface HeroProps {
  onOpenSimulator: () => void;
  onOpenSlides: () => void;
}

export default function Hero({ onOpenSimulator, onOpenSlides }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const command = 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 overflow-hidden border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 sm:h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Official Watermark / Brand Badge - Clean on Mobile */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] sm:text-xs font-mono text-emerald-400 mb-4 sm:mb-6 shadow-inner max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-300">CYBERHUNTLAB</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200">CAROL LAMAS</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-cyan-400 hidden sm:inline font-mono">cwe-discover.cyberhuntlab.com.br</span>
          </div>

          {/* Centered Modern Logo Badge */}
          <div className="mb-4 sm:mb-6 flex items-center justify-center">
            <CyberLogo size="lg" subtitle="Suite de Reconhecimento & Priorização CWE" />
          </div>

          {/* Main Headline - Mobile Friendly & Scaled */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-6">
            Mapeie a superfície de ataque <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              sem disparar um único payload
            </span>
          </h1>

          {/* Subtitle - Proportional & Legible on Mobile */}
          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mb-6 sm:mb-8 leading-relaxed px-1">
            O <strong className="text-emerald-300 font-semibold">cwe-discover</strong> analisa cabeçalhos, formulários, rotas expostas e arquivos sensíveis, calculando o <span className="text-amber-300 font-mono">Risk Score</span> exato e gerando relatórios para <span className="text-cyan-300">HackerOne</span>. Com <span className="text-purple-300 font-mono">--agents</span>, 9 agentes evidence-first auditam cada achado antes da confirmação.
          </p>

          {/* Quick Command Box - Responsive & Compact for Mobile */}
          <div className="w-full max-w-2xl bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 p-1.5 sm:p-2 shadow-2xl mb-6 sm:mb-8 backdrop-blur-md">
            <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 border-b border-slate-800/80 text-[10px] sm:text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/80"></div>
                <span className="ml-1 sm:ml-2 text-slate-400">bash • termux / linux</span>
              </div>
              <span className="text-emerald-400 text-[10px] sm:text-[11px] font-semibold">100% Passivo</span>
            </div>
            
            <div className="p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-4 font-mono text-xs sm:text-sm overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap text-left py-1 text-slate-200 scrollbar-none">
                <span className="text-emerald-400 font-bold select-none">$</span>
                <span className="text-emerald-300">python</span>
                <span className="text-slate-100">cwe_discover.py</span>
                <span className="text-cyan-300">-u</span>
                <span className="text-slate-300 underline decoration-slate-600">alvo.com</span>
                <span className="text-amber-400 font-semibold">--i-have-authorization</span>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1 text-[11px] sm:text-xs font-mono"
                title="Copiar comando"
              >
                {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Action CTAs - 2x2 on mobile, 4x1 on desktop */}
          <div className="w-full max-w-2xl mb-8 sm:mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              <a
                href="#gerador-relatorio"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition group shadow-sm text-center"
              >
                <FileCode2 className="w-4 h-4 mb-1 text-slate-950" />
                <span className="text-xs font-bold font-mono">Relatórios</span>
                <span className="text-[9px] sm:text-[10px] text-slate-900 font-medium">HackerOne / MD</span>
              </a>

              <a
                href="#comandos-cli"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition text-center"
              >
                <Terminal className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="text-xs font-bold font-mono">Comandos</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">Syntax Builder</span>
              </a>

              <button
                onClick={onOpenSlides}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition text-center cursor-pointer"
              >
                <Presentation className="w-4 h-4 mb-1 text-cyan-400" />
                <span className="text-xs font-bold font-mono">Apresentação</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">Slides Deck</span>
              </button>

              <a
                href="#manual"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition text-center"
              >
                <Sparkles className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-xs font-bold font-mono">Manual</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">28 Capítulos</span>
              </a>
            </div>
          </div>

          {/* Feature Highlight Cards - Compact & High-Contrast on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full text-left">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Zero Payloads</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Varredura 100% não-intrusiva sem risco de quebra de serviços.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Risk Scoring</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Cálculo matemático determinístico Severidade × Confiança.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">5 Formatos Export</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Markdown, HTML visual, JSON, CSV e rascunhos HackerOne.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Termux + Nuclei</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Roda direto no smartphone Android e integra com Nuclei & ZAP.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-fuchsia-500/40 transition sm:col-span-2 lg:col-span-1">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Pipeline Multiagente</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">9 agentes evidence-first auditam e só confirmam com prova válida.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
