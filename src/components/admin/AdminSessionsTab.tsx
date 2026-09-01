import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Activity,
  Fingerprint
} from 'lucide-react';
import { ActiveSession } from '../../types/admin';

export default function AdminSessionsTab() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/sessions');
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Erro ao buscar sessões:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (token: string) => {
    try {
      const res = await fetch(`/api/admin/sessions/${token}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(sessions.filter(s => s.token !== token));
      }
    } catch (err) {
      console.error('Erro ao revogar sessão:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-rose-400" />
            <span>Sessões Ativas & Tokens Emitidos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoramento de sessões administrativas e de operadores em tempo real com expiração de 4 horas e revogação forçada.
          </p>
        </div>

        <button
          onClick={fetchSessions}
          className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition"
          title="Recarregar Sessões"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Token Hash</th>
                <th className="py-3 px-4">Origem / IP</th>
                <th className="py-3 px-4">Criado em</th>
                <th className="py-3 px-4">Expira em</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sessions.map((s) => (
                <tr key={s.token} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.type === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-semibold">{s.username}</td>
                  <td className="py-3.5 px-4 text-slate-500">{s.token.slice(0, 16)}...</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.ip_address}</td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(s.created_at).toLocaleTimeString('pt-BR')}</td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(s.expires_at).toLocaleTimeString('pt-BR')}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRevokeSession(s.token)}
                      className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 rounded-lg transition"
                      title="Revogar Sessão Imediatamente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
