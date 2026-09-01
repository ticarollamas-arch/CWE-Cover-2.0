import React, { useState } from 'react';
import { 
  KeyRound, 
  Server, 
  Users, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Activity, 
  Layers, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Home,
  DollarSign,
  CreditCard,
  Video
} from 'lucide-react';
import CyberLogo from '../CyberLogo';
import AdminLicensesTab from './AdminLicensesTab';
import AdminInstallationsTab from './AdminInstallationsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminSessionsTab from './AdminSessionsTab';
import AdminAuditTab from './AdminAuditTab';
import AdminConfigTab from './AdminConfigTab';
import AdminPlansTab from './AdminPlansTab';
import AdminPaymentsTab from './AdminPaymentsTab';
import AdminVideoLessonsTab from './AdminVideoLessonsTab';

interface AdminDashboardProps {
  adminUser: any;
  onLogout: () => void;
  onGoToPublic: () => void;
}

type AdminTab = 'licenses' | 'plans' | 'payments' | 'videolessons' | 'installations' | 'users' | 'sessions' | 'audit' | 'config';

export default function AdminDashboard({ adminUser, onLogout, onGoToPublic }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('licenses');

  const navItems = [
    { id: 'licenses', label: 'Licenças Criptográficas', icon: KeyRound },
    { id: 'plans', label: 'Planos & Preço Pix', icon: DollarSign },
    { id: 'payments', label: 'Cobranças & Pix', icon: CreditCard },
    { id: 'videolessons', label: 'Videoaulas & Conteúdo', icon: Video },
    { id: 'installations', label: 'Nodes & Instalações', icon: Server },
    { id: 'users', label: 'Operadores & Contas', icon: Users },
    { id: 'sessions', label: 'Sessões & Tokens', icon: Activity },
    { id: 'audit', label: 'Trilha de Auditoria', icon: ShieldAlert },
    { id: 'config', label: 'Políticas & Sistema', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans">
      
      {/* Top Admin Security Banner */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Surface Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <CyberLogo size="sm" subtitle="Superfície Administrativa" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUPER ADMIN CONSOLE</span>
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block font-mono">{adminUser?.name || 'Ana Caroline Lamas'}</span>
              <span className="text-[10px] text-rose-400 font-mono">SUPER_ADMIN</span>
            </div>

            <button
              onClick={onGoToPublic}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono transition flex items-center gap-1.5"
              title="Ir para a página pública"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Portal Público</span>
            </button>

            <button
              onClick={onLogout}
              className="px-2.5 sm:px-3.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Painéis de Governança
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Diretriz de Segurança</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Todas as ações de geração e alteração de licenças são assinadas digitalmente e registradas na trilha de auditoria imutável.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'licenses' && <AdminLicensesTab />}
          {activeTab === 'plans' && <AdminPlansTab />}
          {activeTab === 'payments' && <AdminPaymentsTab />}
          {activeTab === 'videolessons' && <AdminVideoLessonsTab />}
          {activeTab === 'installations' && <AdminInstallationsTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'sessions' && <AdminSessionsTab />}
          {activeTab === 'audit' && <AdminAuditTab />}
          {activeTab === 'config' && <AdminConfigTab />}
        </main>

      </div>

    </div>
  );
}
