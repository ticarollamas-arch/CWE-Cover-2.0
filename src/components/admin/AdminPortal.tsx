import React, { useState, useEffect } from 'react';
import AdminLoginView from './AdminLoginView';
import AdminDashboard from './AdminDashboard';
import { Loader2 } from 'lucide-react';

interface AdminPortalProps {
  onBackToPublic: () => void;
}

export default function AdminPortal({ onBackToPublic }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/admin/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAdminSession();
  }, []);

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-3" />
        <span className="text-xs font-mono text-slate-400">Verificando sessão de autoridade administrativa...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginView 
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={onBackToPublic}
      />
    );
  }

  return (
    <AdminDashboard 
      adminUser={adminUser}
      onLogout={handleLogout}
      onGoToPublic={onBackToPublic}
    />
  );
}
