import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint,
  Globe
} from 'lucide-react';
import { InstallationNode } from '../../types/admin';

export default function AdminInstallationsTab() {
  const [installations, setInstallations] = useState<InstallationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInstallations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/installations');
      const data = await res.json();
      if (data.installations) {
        setInstallations(data.installations);
      }
    } catch (err) {
      console.error('Erro ao buscar instalações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-rose-400" />
            <span>Instalações & Nodes do Ecossistema</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro de identificadores únicos de hardware (Installation ID), plataformas e status de telemetria.
          </p>
        </div>

        <button
          onClick={fetchInstallations}
          className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition"
          title="Recarregar Instalações"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {installations.map((node) => (
          <div 
            key={node.installation_id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-rose-400">{node.installation_id}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ONLINE</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Host: <strong className="text-slate-200">{node.hostname}</strong></p>
              </div>

              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-rose-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-500 text-[10px] block">Plataforma</span>
                <span className="text-slate-300 font-semibold">{node.platform}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">IP Local</span>
                <span className="text-slate-300 font-semibold">{node.ip_address || '127.0.0.1'}</span>
              </div>

              <div className="col-span-2 pt-2 border-t border-slate-850">
                <span className="text-slate-500 text-[10px] block">Licença Vinculada</span>
                <span className="text-emerald-400 font-semibold">
                  {node.active_license_key || 'Licença ativa instalada localmente'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>Primeiro registro: {new Date(node.first_seen_at).toLocaleDateString('pt-BR')}</span>
              <span>Último ping: {new Date(node.last_seen_at).toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
