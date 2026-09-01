import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Lock, 
  Save, 
  RefreshCw, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SystemConfig } from '../../types/admin';

export default function AdminConfigTab() {
  const [config, setConfig] = useState<SystemConfig>({
    autonomous_mode: true,
    rate_limit_per_minute: 60,
    brute_force_lockout_attempts: 5,
    brute_force_lockout_minutes: 15,
    session_timeout_hours: 4,
    allow_local_ollama: true,
    strict_license_enforcement: true,
    engines_count: 17,
    agents_count: 18
  });
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-400" />
            <span>Configurações do Sistema & Políticas de Segurança</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Políticas de tolerância zero para scanners externos, timeouts criptográficos e regras de rate limiting.
          </p>
        </div>

        <button
          onClick={() => {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
          }}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-2"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'CONFIGURAÇÕES SALVAS' : 'SALVAR DIRETRIZES'}</span>
        </button>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        
        {/* Card 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 font-sans">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Regras de Autonomia & Motores</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Modo Autônomo Puro</span>
                <span className="text-[11px] text-slate-500 font-sans">Zero subprocessos externos (Nmap, Nuclei, Katana bloqueados)</span>
              </div>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">ATIVO</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Motores Registrados</span>
                <span className="text-[11px] text-slate-500 font-sans">17 engines autorais em sockets nativos</span>
              </div>
              <span className="text-rose-400 font-bold">17/17 OK</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Agentes Orquestrados</span>
                <span className="text-[11px] text-slate-500 font-sans">18 agentes autônomos em grafo DAG</span>
              </div>
              <span className="text-cyan-400 font-bold">18/18 OK</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 font-sans">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Políticas de Sessão & Força Bruta</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Tentativas de Login Permitidas</span>
                <span className="text-[11px] text-slate-500 font-sans">Bloqueio automático por IP</span>
              </div>
              <span className="text-slate-200 font-bold">5 tentativas</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Tempo de Bloqueio</span>
                <span className="text-[11px] text-slate-500 font-sans">Duração do lockout temporário</span>
              </div>
              <span className="text-slate-200 font-bold">15 minutos</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-200 block font-semibold">Validade da Sessão Admin</span>
                <span className="text-[11px] text-slate-500 font-sans">Expiração de cookie HttpOnly</span>
              </div>
              <span className="text-slate-200 font-bold">4 horas</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
