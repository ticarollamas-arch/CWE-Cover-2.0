import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  KeyRound, 
  Terminal, 
  Layers, 
  ArrowRight,
  Fingerprint,
  FileCode2,
  Lock
} from 'lucide-react';
import { PlanItem } from '../../types/product';

interface PricingSectionProps {
  onOpenCheckout: (planId?: string) => void;
  onOpenActivation: () => void;
}

export default function PricingSection({
  onOpenCheckout,
  onOpenActivation
}: PricingSectionProps) {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch(() => {
        // Default fallback
        setPlans([
          {
            id: 'plan-chl-monthly',
            name: 'Cyber Hunter Lab',
            price: 47.00,
            currency: 'BRL',
            period: 'monthly',
            period_label: 'mês',
            status: 'ACTIVE',
            description: 'Acesso autônomo completo aos 17 motores próprios e 18 agentes em Debian / Kali Linux.',
            features: [
              '17 Motores Nativos Integrados',
              '18 Agentes Autônomos em Grafo DAG',
              'Auditoria Web, Rede, DNS e AppSec',
              'Triangulação e Eliminação de Falsos Positivos',
              'Classificação MITRE CWE Top 25 & OWASP',
              'Ledger Imutável de Evidências Sanitizadas',
              'Relatórios Executivos e Técnicos em Markdown/HTML',
              'Zero dependências externas de scanners ou IAs pagas'
            ]
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const defaultPlan = plans[0] || {
    id: 'plan-chl-monthly',
    name: 'Cyber Hunter Lab',
    price: 47.00,
    currency: 'BRL',
    period: 'monthly',
    period_label: 'mês',
    status: 'ACTIVE',
    description: 'Acesso autônomo completo aos 17 motores próprios e 18 agentes em Debian / Kali Linux.',
    features: [
      '17 Motores Nativos Integrados',
      '18 Agentes Autônomos em Grafo DAG',
      'Auditoria Web, Rede, DNS e AppSec',
      'Triangulação e Eliminação de Falsos Positivos',
      'Classificação MITRE CWE Top 25 & OWASP',
      'Ledger Imutável de Evidências Sanitizadas',
      'Relatórios Executivos e Técnicos em Markdown/HTML',
      'Zero dependências externas de scanners ou IAs pagas'
    ]
  };

  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>PROPOSTA DE PREÇO ACESSÍVEL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Segurança Profissional por R$ 47/mês
        </h2>
        <p className="text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
          O objetivo desse valor é permitir que pessoas que estão começando na área tenham acesso a uma plataforma profissional sem precisar investir inicialmente em diversas ferramentas ou serviços separados.
        </p>
      </div>

      {/* Main Plan Card */}
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow & Badge */}
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-100">{defaultPlan.name}</h3>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold uppercase border border-emerald-500/30">
                Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {defaultPlan.description}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="flex items-baseline gap-1 sm:justify-end">
              <span className="text-sm font-bold text-slate-400">R$</span>
              <span className="text-4xl font-extrabold text-slate-100">{Number(defaultPlan.price).toFixed(2)}</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">/{defaultPlan.period_label || 'mês'} via Pix</span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            O que está incluído na licença:
          </div>
          {defaultPlan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="leading-relaxed">{feat}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onOpenCheckout(defaultPlan.id)}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>ASSINAR COM PIX (R$ {Number(defaultPlan.price).toFixed(2)})</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            type="button"
            onClick={onOpenActivation}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-emerald-300 font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs font-mono"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Já comprou? Ative sua Chave de Ativação</span>
          </button>
        </div>

        {/* Safety Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>Liberação imediata • Chave criptográfica única • Suporte Debian & Kali</span>
        </div>

      </div>

    </section>
  );
}
