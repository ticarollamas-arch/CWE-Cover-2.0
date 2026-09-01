import React from 'react';
import { Github, Terminal, Heart, Lock, Smartphone, Globe, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import CyberLogo from './CyberLogo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-8 sm:py-12 relative overflow-hidden">
      {/* Subtle brand glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-3">
            <CyberLogo size="sm" subtitle="Manual & Suite Oficial v1.0" />
            
            <p className="text-slate-400 leading-relaxed text-xs">
              Suite de reconhecimento passivo, mapeamento de superfície de ataque e priorização de falhas por CWE com zero envio de payloads. Desenvolvida por <strong className="text-slate-200">Carol Lamas</strong> para o ecossistema <strong className="text-cyan-400">CyberHuntLab</strong>.
            </p>

            {/* Author & Lab Contact Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 font-mono text-[10px] sm:text-[11px]">
              <a 
                href="https://cyberhuntlab.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition"
              >
                <Globe className="w-3 h-3" />
                <span>cyberhuntlab.com.br</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>

              <a 
                href="mailto:carollamas@cyberhuntlab.com.br"
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <Mail className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[200px]">carollamas@cyberhuntlab.com.br</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 pt-1 font-mono text-[10px] sm:text-[11px] text-slate-500">
              <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Compatível com Android (Termux) & Golang Ecosystem</span>
            </div>
          </div>

          {/* Ethical Disclaimer */}
          <div className="md:col-span-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-xs">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Aviso de Uso Responsável & Ética</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Esta ferramenta deve ser utilizada exclusivamente em alvos autorizados com escopo formal de Bug Bounty ou laboratórios próprios. Nunca realize varreduras sem autorização prévia.
            </p>
            <div className="pt-1 text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Licença MIT sob os direitos de CyberHuntLab.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2 font-mono text-xs">
            <span className="text-slate-200 font-semibold block mb-2">Seções & Portais</span>
            <ul className="space-y-1.5 text-slate-400 text-[11px] sm:text-xs">
              <li><a href="https://cyberhuntlab.com.br" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">🌐 cyberhuntlab.com.br</a></li>
              <li><a href="#gerador-relatorio" className="hover:text-emerald-400 transition">⚡ Gerador de Relatórios</a></li>
              <li><a href="#comandos-cli" className="hover:text-emerald-400 transition">⌨️ Comandos de Execução</a></li>
              <li><a href="#risk-score" className="hover:text-amber-400 transition">📊 Calculadora de Risco</a></li>
              <li><a href="#cwes" className="hover:text-cyan-400 transition">🛡️ Matriz de CWEs</a></li>
              <li><a href="#receitas" className="hover:text-violet-400 transition">⚡ Cenários & Termux</a></li>
              <li><a href="#manual" className="hover:text-sky-400 transition">📖 Manual Completo (28 Capítulos)</a></li>
              <li><a href="#readme-export" className="hover:text-cyan-400 transition">📦 Exportação GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Official Watermark Signature */}
        <div className="border-t border-slate-800/60 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-slate-500 font-mono text-[10px] sm:text-[11px] text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <span>© 2026 Carol Lamas</span>
            <span>•</span>
            <span>CyberHuntLab</span>
            <span>•</span>
            <span className="text-cyan-400">cwe-discover.cyberhuntlab.com.br</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[280px] sm:max-w-none">Marca d'água autêntica CyberHuntLab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
