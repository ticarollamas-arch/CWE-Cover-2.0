import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface WatermarkOverlayProps {
  showWatermark?: boolean;
}

export default function WatermarkOverlay({ showWatermark = true }: WatermarkOverlayProps) {
  const [visible, setVisible] = useState(showWatermark);
  const [copied, setCopied] = useState(false);

  const watermarkText = "CYBERHUNTLAB • CAROL LAMAS • CWE-DISCOVER • RECON SUITE";
  const signatureText = "Marca d'Água Oficial: CyberHuntLab / Carol Lamas — cwe-discover (https://cwe-discover.cyberhuntlab.com.br)";

  const handleCopySig = () => {
    navigator.clipboard.writeText(signatureText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Background Repeating Watermark Canvas Layer */}
      {visible && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.035] flex flex-wrap items-center justify-around gap-24 sm:gap-32 p-8 rotate-[-18deg] scale-125"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-emerald-400 font-mono font-black text-xs sm:text-sm tracking-widest whitespace-nowrap"
            >
              <span>{watermarkText}</span>
              <span className="text-cyan-400">★</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating Interactive Watermark Stamp Badge (Mobile-compact) */}
      <div className="fixed bottom-3 right-3 z-30 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/90 shadow-xl text-[10px] sm:text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-semibold hidden xs:inline">CyberHuntLab</span>
          <span className="hidden sm:inline">• Carol Lamas</span>
        </div>

        <button
          onClick={handleCopySig}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="Copiar assinatura/marca d'água oficial"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setVisible(!visible)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={visible ? "Ocultar marca d'água no fundo" : "Exibir marca d'água no fundo"}
        >
          {visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
        </button>
      </div>
    </>
  );
}
