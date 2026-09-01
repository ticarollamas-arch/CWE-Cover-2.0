import React, { useState } from 'react';
import { Layers, ShieldCheck, Search, Terminal, FileCode, ShieldAlert } from 'lucide-react';
import { CWES_DATA } from '../data/cwesData';
import { CWEInfo } from '../types';

export default function CweMatrix() {
  const [selectedCwe, setSelectedCwe] = useState<CWEInfo>(CWES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCwes = CWES_DATA.filter(c => 
    c.cwe.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="cwes" className="py-10 sm:py-16 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>CAPÍTULO 15 & 20 • DETECTORES PASSIVOS NATIVOS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              Matriz de CWEs & Mapeamento de Falhas
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Cada detector do <strong className="text-slate-200">cwe-discover</strong> implementa a interface <code className="text-cyan-300 font-mono">BaseDetector</code> para identificar padrões sem enviar payloads hostis.
            </p>
          </div>

          {/* Filter Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filtrar por CWE ou nome..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* CWE List (Left Column) */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-2.5">
            {filteredCwes.map(item => {
              const isSelected = selectedCwe.cwe === item.cwe;
              return (
                <div
                  key={item.cwe}
                  onClick={() => setSelectedCwe(item)}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                      {item.cwe}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                      item.defaultSeverity === 'Alta'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : item.defaultSeverity === 'Médio'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.defaultSeverity} ({item.scoreBase}.0)
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs sm:text-sm mb-0.5">{item.name}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* CWE Details Panel (Right Column) */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-6">
              {/* Top Banner */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3 sm:pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-lg sm:text-xl font-extrabold font-mono text-cyan-400">
                      {selectedCwe.cwe}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm sm:text-base font-bold text-slate-100">
                      {selectedCwe.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedCwe.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Severidade Base</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-amber-400">
                    {selectedCwe.scoreBase}.0 / 10.0
                  </div>
                </div>
              </div>

              {/* Technical Description & How It Detects */}
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <h5 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Lógica de Detecção Passiva
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {selectedCwe.detectionLogic || 'Inspeção passiva estrutural de cabeçalhos e endpoints de resposta.'}
                  </p>
                </div>

                {/* Example Command */}
                <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <h5 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Comando de Auditoria & Validação
                  </h5>
                  <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all">
                    python cwe_discover.py -u https://alvo.com --i-have-authorization
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-3 sm:pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs font-mono text-slate-500">
              <span>CyberHuntLab CWE Engine</span>
              <span className="text-cyan-400 font-semibold">Carol Lamas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
