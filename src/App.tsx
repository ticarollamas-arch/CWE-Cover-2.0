import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CyberHunterArchitectureTree from './components/CyberHunterArchitectureTree';
import ArsenalCapabilitiesCatalog from './components/ArsenalCapabilitiesCatalog';
import InteractiveTerminal from './components/InteractiveTerminal';
import ReportGenerator from './components/ReportGenerator';
import RiskCalculator from './components/RiskCalculator';
import CweMatrix from './components/CweMatrix';
import ArchitectureFlow from './components/ArchitectureFlow';
import ScenariosCheatsheet from './components/ScenariosCheatsheet';
import AutonomousEngineStudio from './components/AutonomousEngineStudio';
import PricingSection from './components/product/PricingSection';
import ProductPositioningSection from './components/product/ProductPositioningSection';
import ChaptersIndex from './components/ChaptersIndex';
import ReadmeViewer from './components/ReadmeViewer';
import PresentationDeck from './components/PresentationDeck';
import Footer from './components/Footer';
import WatermarkOverlay from './components/WatermarkOverlay';

// Product Components (4 Strictly Isolated Environments)
import ProductDashboard from './components/product/ProductDashboard';
import SetupWizard from './components/setup/SetupWizard';
import LicenseActivationModal from './components/product/LicenseActivationModal';
import PixCheckoutModal from './components/product/PixCheckoutModal';
import AdminPortal from './components/admin/AdminPortal';
import ManualsKnowledgeCenter from './components/manuals/ManualsKnowledgeCenter';
import { SystemStatus } from './types/product';

export default function App() {
  const [viewMode, setViewMode] = useState<'presentation' | 'setup' | 'dashboard' | 'slides' | 'manuals'>('presentation');
  const [manualInitialTab, setManualInitialTab] = useState<'guide' | 'steps' | 'videos' | 'policies'>('guide');
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  
  // Modals state
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [routeBlockedMessage, setRouteBlockedMessage] = useState<string | null>(null);

  // Check URL pathname & hash for Admin, Setup, Manuals and Workspace isolation
  const checkRoute = async () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path.startsWith('/admin') || hash === '#admin' || hash === '#/admin' || hash === '#/admin/login') {
      setIsAdminRoute(true);
      return;
    } else {
      setIsAdminRoute(false);
    }

    if (path === '/setup' || hash === '#setup' || hash === '#/setup') {
      setViewMode('setup');
      return;
    }

    if (path === '/manual' || path === '/manuals' || path === '/videoaulas' || path === '/politicas' || 
        hash === '#manuals' || hash === '#/manuals' || hash === '#aulas' || hash === '#videoaulas') {
      if (hash === '#aulas' || hash === '#videoaulas' || path === '/videoaulas') {
        setManualInitialTab('videos');
      } else if (path === '/politicas' || hash === '#politicas') {
        setManualInitialTab('policies');
      } else {
        setManualInitialTab('guide');
      }
      setViewMode('manuals');
      return;
    }

    if (path === '/workspace' || hash === '#workspace' || hash === '#/workspace' || path === '/dashboard' || hash === '#dashboard') {
      // Validação estrita: Workspace exige autenticação comprovada no backend
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData && sessionData.authenticated) {
          setIsAuthenticated(true);
          setViewMode('dashboard');
        } else {
          setIsAuthenticated(false);
          setViewMode('presentation');
          setRouteBlockedMessage('O Workspace é restrito. Insira uma Chave de Ativação válida para acessar o ambiente operacional.');
          setIsActivationOpen(true);
          // Normaliza URL para raiz
          window.history.replaceState({}, '', '/');
        }
      } catch {
        setIsAuthenticated(false);
        setViewMode('presentation');
        setIsActivationOpen(true);
      }
      return;
    }

    if (path === '/slides' || hash === '#slides') {
      setViewMode('slides');
      return;
    }
  };

  useEffect(() => {
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Check existing client session & fetch system status on load
  const verifySessionAndStatus = async () => {
    try {
      const [statusRes, sessionRes] = await Promise.all([
        fetch('/api/system/status'),
        fetch('/api/auth/session')
      ]);
      
      const statusData = await statusRes.json();
      if (statusData.status) {
        setSystemStatus(statusData.status);
      }

      const sessionData = await sessionRes.json();
      if (sessionData.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Se a sessão expirou e o usuário estava no dashboard, ejeta com segurança
        if (viewMode === 'dashboard') {
          setViewMode('presentation');
        }
      }
    } catch (err) {
      console.error('Erro ao conectar ao backend Cyber Hunter:', err);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    verifySessionAndStatus();
  }, []);

  // Isolated full-page environments (Setup, Manuals, Slides, Dashboard) replace the
  // entire page content. Reset scroll to the top whenever one of them is opened so the
  // user doesn't land mid-page with content pushed out of the viewport (e.g. clicking
  // "Guia de Instalação" while scrolled down previously left the new view displaced).
  useEffect(() => {
    if (viewMode === 'setup' || viewMode === 'manuals' || viewMode === 'slides' || viewMode === 'dashboard') {
      window.scrollTo(0, 0);
    }
  }, [viewMode]);

  // Global shortcut: Ctrl+K or Cmd+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (viewMode === 'slides' || viewMode === 'dashboard') {
          setViewMode('presentation');
        }
        const manualElement = document.getElementById('manual');
        if (manualElement) {
          manualElement.scrollIntoView({ behavior: 'smooth' });
          const searchInput = manualElement.querySelector('input');
          if (searchInput) {
            searchInput.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleSearchClick = () => {
    if (viewMode === 'slides' || viewMode === 'dashboard') {
      setViewMode('presentation');
    }
    const manualElement = document.getElementById('manual');
    if (manualElement) {
      manualElement.scrollIntoView({ behavior: 'smooth' });
      const searchInput = manualElement.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  const handleOpenSimulator = () => {
    if (viewMode === 'slides' || viewMode === 'dashboard') {
      setViewMode('presentation');
    }
    const simElement = document.getElementById('arvore-funcional') || document.getElementById('comandos-cli');
    if (simElement) {
      simElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Workspace Action: strictly verify authentication before switching view
  const handleOpenWorkspace = async () => {
    if (isAuthenticated) {
      setViewMode('dashboard');
      return;
    }

    // Re-checa sessão no backend
    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (sessionData && sessionData.authenticated) {
        setIsAuthenticated(true);
        setViewMode('dashboard');
        return;
      }
    } catch {}

    // Não autenticado: abre modal de ativação
    setRouteBlockedMessage(null);
    setIsActivationOpen(true);
  };

  const handleActivationSuccess = (licenseData: any) => {
    setIsAuthenticated(true);
    setIsActivationOpen(false);
    setRouteBlockedMessage(null);
    setViewMode('dashboard');
    verifySessionAndStatus();
  };

  const handleCheckoutSuccess = (licenseData: any) => {
    setIsAuthenticated(true);
    setIsCheckoutOpen(false);
    setRouteBlockedMessage(null);
    setViewMode('dashboard');
    verifySessionAndStatus();
  };

  const handleOpenCheckout = (planId?: string) => {
    setSelectedPlanId(planId);
    setIsCheckoutOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
    setViewMode('presentation');
    window.history.replaceState({}, '', '/');
  };

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    window.history.pushState({}, '', '/');
    setViewMode('presentation');
  };

  // 1. ISOLATED ADMIN PORTAL (Accessible via /admin or #admin)
  if (isAdminRoute) {
    return <AdminPortal onBackToPublic={handleExitAdmin} />;
  }

  // 2. ISOLATED SETUP ENVIRONMENT (Accessible via /setup, #setup, or button)
  if (viewMode === 'setup') {
    return (
      <SetupWizard
        systemStatus={systemStatus}
        onOpenWorkspace={handleOpenWorkspace}
        onBackToPresentation={() => setViewMode('presentation')}
        onRefreshStatus={verifySessionAndStatus}
        onOpenManuals={(tab) => {
          if (tab) setManualInitialTab(tab);
          setViewMode('manuals');
        }}
      />
    );
  }

  // 3. ISOLATED MANUALS & VIDEO LESSONS ENVIRONMENT (Accessible via /manual, /videoaulas, #manuals, or Header)
  if (viewMode === 'manuals') {
    return (
      <ManualsKnowledgeCenter
        initialTab={manualInitialTab}
        onClose={() => setViewMode('presentation')}
        onOpenSetup={() => setViewMode('setup')}
        onOpenWorkspace={handleOpenWorkspace}
        onOpenActivation={() => setIsActivationOpen(true)}
      />
    );
  }

  // 4. ISOLATED SLIDES ENVIRONMENT (Presentation Deck)
  if (viewMode === 'slides') {
    return <PresentationDeck onExitSlides={() => setViewMode('presentation')} />;
  }

  // 5. ISOLATED WORKSPACE ENVIRONMENT (Client Operations Dashboard)
  if (viewMode === 'dashboard') {
    return (
      <ProductDashboard
        systemStatus={systemStatus}
        onLogout={handleLogout}
        onBackToPresentation={() => setViewMode('presentation')}
      />
    );
  }

  // 6. LANDING ENVIRONMENT (Public Presentation, Architecture, Arsenal, Pricing & Manual)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Subtle Background Watermark & Interactive Authenticity Stamp */}
      <WatermarkOverlay />

      {/* Top Header Navigation */}
      <Header 
        activeTab={viewMode === 'manuals' ? 'manuals' : (viewMode === 'setup' ? 'setup' : (viewMode === 'slides' ? 'slides' : 'site'))} 
        setActiveTab={(tab) => {
          if (tab === 'setup') setViewMode('setup');
          else if (tab === 'slides') setViewMode('slides');
          else if (tab === 'manuals') {
            setManualInitialTab('guide');
            setViewMode('manuals');
          }
          else setViewMode('presentation');
        }} 
        onSearchClick={handleSearchClick}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenCheckout={() => handleOpenCheckout()}
        onOpenSetup={() => setViewMode('setup')}
        onOpenWorkspace={handleOpenWorkspace}
        onOpenManuals={(tab) => {
          if (tab) setManualInitialTab(tab);
          setViewMode('manuals');
        }}
      />

      {/* Main Presentation & Documentation Content */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero Section */}
        <Hero 
          onOpenSimulator={handleOpenSimulator}
          onOpenSlides={() => setViewMode('slides')}
          onOpenLogin={handleOpenWorkspace}
          onOpenActivation={() => setIsActivationOpen(true)}
          onOpenSetup={() => setViewMode('setup')}
        />

        {/* 2. Posicionamento & Público-Alvo: Segurança acessível para quem está começando */}
        <ProductPositioningSection 
          onOpenSetup={() => setViewMode('setup')}
          onOpenManuals={(tab) => {
            if (tab) setManualInitialTab(tab);
            setViewMode('manuals');
          }}
          onOpenCheckout={() => handleOpenCheckout()}
        />

        {/* 3. Cyber Hunter Engine: Árvore Funcional Integrada (17 Motores Autorais) */}
        <CyberHunterArchitectureTree />

        {/* 3. Mega Biblioteca de Casos de Uso & Arsenal Bug Bounty (20k Possibilidades) */}
        <ArsenalCapabilitiesCatalog />

        {/* 4. Simulador Visual de Políticas & Orquestração de Campanhas (Modo Demonstração) */}
        <InteractiveTerminal 
          onOpenActivation={() => setIsActivationOpen(true)}
          onOpenWorkspace={handleOpenWorkspace}
        />

        {/* 5. Bug Bounty & Pentest Report Generator (No API, English Markdown Support) */}
        <ReportGenerator />

        {/* 6. Planos de Acesso & Checkout Pix Desacoplado */}
        <PricingSection 
          onOpenCheckout={handleOpenCheckout}
          onOpenActivation={() => setIsActivationOpen(true)}
        />

        {/* 7. Interactive Risk Score Engine */}
        <RiskCalculator />

        {/* 8. CWE Matrix & Detector Explorer */}
        <CweMatrix />

        {/* 9. Pipeline & Architecture Visualizer */}
        <ArchitectureFlow />

        {/* 10. 100% Native Autonomous Engine Studio (Zero External Go/Binary Dependencies) */}
        <AutonomousEngineStudio />

        {/* 11. Scenarios, Recipes, Bash Script & Termux Integrations */}
        <ScenariosCheatsheet />

        {/* 12. Comprehensive Documentation Viewer */}
        <ChaptersIndex 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 13. GitHub README Export & Multi-Agent AI Guide */}
        <ReadmeViewer />
      </main>

      {/* Footer */}
      <Footer />

      {/* License Activation Modal (Key-Only, Safe, No Admin Credentials) */}
      <LicenseActivationModal
        isOpen={isActivationOpen}
        onClose={() => {
          setIsActivationOpen(false);
          setRouteBlockedMessage(null);
        }}
        onSuccess={handleActivationSuccess}
        installationId={systemStatus?.installation_id || 'CHL-NODE-984F-71EA-B392-501D'}
        onOpenPricing={() => handleOpenCheckout()}
        blockedRouteMessage={routeBlockedMessage}
      />

      {/* Pix Checkout Modal (Instant Pix Order & Crypto Key Generation) */}
      <PixCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onActivatedSuccessfully={handleCheckoutSuccess}
        initialPlanId={selectedPlanId}
      />
    </div>
  );
}
