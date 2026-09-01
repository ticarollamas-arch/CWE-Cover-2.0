import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Lock, 
  Mail, 
  Calendar, 
  RefreshCw,
  Plus,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

export default function AdminUsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            <span>Contas de Acesso & Operadores</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de papéis com separação rígida de privilégios (Super Admin, Security Admin, Operator).
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition"
          title="Recarregar Usuários"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => (
          <div key={u.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-sm">{u.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    u.role === 'SUPER_ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono block">@{u.username}</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                <UserCheck className="w-4 h-4 text-rose-400" />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Email:</span>
                <span className="text-slate-200">{u.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Criado em:</span>
                <span className="text-slate-300">{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Último Acesso:</span>
                <span className="text-emerald-400">{u.last_login ? new Date(u.last_login).toLocaleString('pt-BR') : 'Sessão Atual'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
