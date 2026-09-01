import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Clock,
  Filter
} from 'lucide-react';
import { AuditLogEntry } from '../../types/admin';

export default function AdminAuditTab() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit');
      const data = await res.json();
      if (data.audit_logs) {
        setLogs(data.audit_logs);
      }
    } catch (err) {
      console.error('Erro ao buscar auditoria:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Trilha de Auditoria & Segurança Operacional</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro imutável de eventos de autenticação, geração/ativação de licenças, execuções e bloqueios de força bruta.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition"
          title="Recarregar Auditoria"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ação, ator ou detalhes..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'AUTH', 'LICENSE', 'CAMPAIGN', 'SECURITY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition shrink-0 ${
                categoryFilter === cat
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Ator / IP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="text-slate-200 block font-semibold">{log.actor}</span>
                    <span className="text-[10px] text-slate-500">{log.ip}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      log.status === 'BLOCKED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs max-w-md truncate">
                    {log.details}
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
