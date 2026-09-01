import React, { useState } from 'react';
import { Sliders, Calculator } from 'lucide-react';
import { RISK_LEVELS } from '../data/cwesData';

interface PresetCase {
  label: string;
  cwe: string;
  severity: number;
  confidence: number;
  reason: string;
}

const PRESET_CASES: PresetCase[] = [
  {
    label: 'Repositório .git Exposto',
    cwe: 'CWE-200',
    severity: 8.0,
    confidence: 0.90,
    reason: 'Severidade Alta (8.0) com evidência determinística (0.90).'
  },
  {
    label: 'Headers CSP Ausentes',
    cwe: 'CWE-693',
    severity: 5.0,
    confidence: 0.95,
    reason: 'Severidade Média (5.0) com certeza absoluta nos headers (0.95).'
  },
  {
    label: 'Parâmetro ?file= (Path Traversal)',
    cwe: 'CWE-22',
    severity: 5.0,
    confidence: 0.60,
    reason: 'Severidade Média (5.0) com confiança moderada (0.60).'
  },
  {
    label: 'Comentário HTML com Versão',
    cwe: 'CWE-615',
    severity: 3.0,
    confidence: 0.40,
    reason: 'Severidade Baixa (3.0) com confiança contextual (0.40).'
  }
];

export default function RiskCalculator() {
  const [severity, setSeverity] = useState<number>(8.0);
  const [confidence, setConfidence] = useState<number>(0.85);

  const riskScore = Number((severity * confidence).toFixed(2));

  // Determine risk category
  let category = RISK_LEVELS[0];
  if (riskScore > 8.5) category = RISK_LEVELS[4]; // Crítico
  else if (riskScore > 6.5) category = RISK_LEVELS[3]; // Alto
  else if (riskScore > 4.0) category = RISK_LEVELS[2]; // Médio
  else if (riskScore > 2.0) category = RISK_LEVELS[1]; // Baixo

  const getConfidenceLabel = (val: number) => {
    if (val >= 0.9) return { text: 'Forte (0.9-1.0)', color: 'text-emerald-400' };
    if (val >= 0.6) return { text: 'Moderada (0.6-0.8)', color: 'text-cyan-400' };
    if (val >= 0.3) return { text: 'Fraca (0.3-0.5)', color: 'text-amber-400' };
    return { text: 'Especulação (<0.3)', color: 'text-slate-400' };
  };

  const getSeverityLabel = (val: number) => {
    if (val >= 9.0) return { text: 'Crítica (10.0)', color: 'text-red-400' };
    if (val >= 7.0) return { text: 'Alta (8.0)', color: 'text-orange-400' };
    if (val >= 4.0) return { text: 'Média (5.0)', color: 'text-amber-400' };
    if (val >= 2.0) return { text: 'Baixa (3.0)', color: 'text-blue-400' };
    return { text: 'Info (1.0)', color: 'text-slate-400' };
  };

  return (
    <section id="risk-score" className="py-10 sm:py-16 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] sm:text-xs font-mono text-amber-400 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>CAPÍTULO 21 • MOTOR MATEMÁTICO DE PRIORIZAÇÃO</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
            Calculadora Interativa de Risk Score
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
            No <strong className="text-slate-200">cwe-discover</strong>, a fórmula <code className="text-amber-300 font-mono font-bold">risk = severity × confidence</code> garante que vulnerabilidades críticas com alta confiança liderem a triagem.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
          {/* Controls & Sliders */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-xl sm:rounded-2xl border border-slate-800 p-3.5 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-slate-200 text-xs sm:text-sm flex items-center gap-2 font-mono">
                <Sliders className="w-4 h-4 text-amber-400" />
                Ajuste os Pesos do Achado
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Escala 0.0 a 10.0</span>
            </div>

            {/* Severity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
                <span className="text-slate-300">Severidade Base:</span>
                <span className={`font-bold ${getSeverityLabel(severity).color}`}>
                  {severity.toFixed(1)} — {getSeverityLabel(severity).text}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Info (1)</span>
                <span>Baixa (3)</span>
                <span>Média (5)</span>
                <span>Alta (8)</span>
                <span>Crítica (10)</span>
              </div>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
                <span className="text-slate-300">Grau de Confiança:</span>
                <span className={`font-bold ${getConfidenceLabel(confidence).color}`}>
                  {confidence.toFixed(2)} — {getConfidenceLabel(confidence).text}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={confidence}
                onChange={e => setConfidence(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.1 (Especulativo)</span>
                <span>0.5 (Fraca)</span>
                <span>0.8 (Moderada)</span>
                <span>1.0 (Forte)</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] sm:text-xs font-mono text-slate-400 block mb-2">
                Casos Reais do Manual:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {PRESET_CASES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSeverity(preset.severity);
                      setConfidence(preset.confidence);
                    }}
                    className="p-2 sm:p-2.5 text-left rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/40 transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-0.5">
                      <span className="group-hover:text-amber-300 transition truncate">{preset.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 shrink-0 ml-1">
                        {preset.cwe}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">{preset.reason}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visualizer Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl sm:rounded-2xl border border-slate-800 p-4 sm:p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
              Resultado do Cálculo
            </span>

            {/* Main Score Display */}
            <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/80 shadow-inner">
                <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${category.color}`}>
                  {riskScore}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-500">MAX 10.0</span>
              </div>
            </div>

            {/* Category Tag */}
            <div className={`px-3.5 py-1 rounded-full text-xs font-bold font-mono border ${category.bg} ${category.color} ${category.border} mb-3 sm:mb-4`}>
              {category.label}
            </div>

            {/* Formula Math Box */}
            <div className="w-full bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 text-left font-mono text-xs space-y-1 mb-3 sm:mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Severidade Base:</span>
                <span className="text-slate-200">{severity.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Índice Confiança:</span>
                <span className="text-slate-200">× {confidence.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-slate-100">
                <span>Risk Score Calculado:</span>
                <span className={category.color}>{riskScore}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              Achados com <strong>Risk Score ≥ 6.5</strong> são categorizados com alta prioridade para reporte no rascunho de triagem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
