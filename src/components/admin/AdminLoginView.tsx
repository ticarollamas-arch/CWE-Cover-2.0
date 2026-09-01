import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  AlertTriangle, 
  Loader2, 
  KeyRound, 
  Fingerprint, 
  Server,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import CyberLogo from '../CyberLogo';

interface AdminLoginViewProps {
  onLoginSuccess: (userData: any) => void;
  onBackToPublic?: () => void;
}

export default function AdminLoginView({ onLoginSuccess, onBackToPublic }: AdminLoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha o usuário e a senha administrativa.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação administrativa.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar à autoridade administrativa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Top Security Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-red-600" />

        <div className="p-8 sm:p-10 space-y-6">
          
          {/* Header Identity */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <CyberLogo size="md" subtitle="Superfície Administrativa Restrita" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ISOLATED MANAGEMENT CONSOLE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Autenticação de Segurança
            </h1>
            <p className="text-xs text-slate-400">
              Acesso exclusivo para governança de licenças, instalações e auditoria.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Usuário Master
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4 text-rose-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Senha Criptográfica
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-rose-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-950/50 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 text-sm font-mono tracking-wide"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VALIDANDO SESSÃO...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>AUTENTICAR MASTER ADMIN</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice & Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col items-center gap-3 text-center text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Fingerprint className="w-3.5 h-3.5 text-rose-400" />
              <span>Proteção anti-força bruta ativa com bloqueio progressivo</span>
            </div>

            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="text-xs text-slate-400 hover:text-slate-200 transition underline underline-offset-4"
              >
                Voltar para a página pública
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
