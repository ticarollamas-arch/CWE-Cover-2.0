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
  onOpenLogin?: () => void;
  onOpenActivation?: () => void;
  onOpenSetup?: () => void;
}

export default function Hero({ onOpenSimulator, onOpenSlides, onOpenLogin, onOpenActivation, onOpenSetup }: HeroProps) {
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
            <span className="text-cyan-400 hidden sm:inline font-mono">Plataforma Autônoma de Cybersecurity</span>
          </div>

          {/* Centered Modern Logo Badge */}
          <div className="mb-4 sm:mb-6 flex items-center justify-center">
            <CyberLogo size="lg" subtitle="Segurança mais acessível para quem está começando" />
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-5">
            Segurança mais acessível <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              para quem está começando.
            </span>
          </h1>

          {/* Subtitle / Core Positioning */}
          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mb-4 sm:mb-6 leading-relaxed px-1">
            Uma plataforma criada para ajudar novos pesquisadores de segurança a <strong>aprender, organizar e executar avaliações autorizadas</strong> com mais praticidade — diretamente no seu próprio ambiente.
          </p>

          {/* Core Philosophy Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-mono font-semibold mb-6 sm:mb-8 shadow-sm">
            <span>“Você está começando. Nós simplificamos a parte operacional para você aprender, analisar e evoluir.”</span>
          </div>

          {/* Primary Action Buttons for Product Entry */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mb-8">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>ABRIR WORKSPACE</span>
            </button>

            <button
              onClick={onOpenSetup}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <span>SETUP & INSTALAÇÃO</span>
            </button>

            <button
              onClick={onOpenActivation}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>ATIVAR LICENÇA</span>
            </button>
          </div>

          {/* Graphical Autonomous Engine Showcase Card (Sem comandos manuais) */}
          <div className="w-full max-w-3xl bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl mb-8 backdrop-blur-md text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-200 font-bold">CYBER HUNTER ORCHESTRATION ENGINE</span>
              </div>
              <span className="text-emerald-400 font-semibold">100% Autônomo • Zero CLI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">17 Motores Nativos</span>
                <span className="text-emerald-300 font-bold">Sockets & HTTP RFC</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">18 Agentes de IA</span>
                <span className="text-cyan-300 font-bold">Grafo DAG em Tempo Real</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Validação Diferencial</span>
                <span className="text-amber-300 font-bold">Zero Falso Positivo</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full max-w-2xl mb-8 sm:mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              <a
                href="#gerador-relatorio"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition group text-center"
              >
                <FileCode2 className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="text-xs font-bold font-mono">Relatórios</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">5 Formatos</span>
              </a>

              <a
                href="#arvore-funcional"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition text-center"
              >
                <Layers className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="text-xs font-bold font-mono">17 Motores</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">Árvore Funcional</span>
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

          {/* Feature Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full text-left">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Zero Payloads</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Varredura não-intrusiva sem risco de instabilidade operacional.</p>
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
              <p className="text-[11px] sm:text-xs text-slate-400">Markdown, HTML visual, JSON, CSV e formato SIEM/JSONL.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">Debian/Kali/Linux</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Execução nativa no ambiente do cliente sem binários externos.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-fuchsia-500/40 transition sm:col-span-2 lg:col-span-1">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5 sm:mb-1">18 Agentes no Grafo</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Auditoria evidence-first com confirmação apenas após prova diferencial.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
