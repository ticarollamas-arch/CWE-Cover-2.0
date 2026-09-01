import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ArsenalCapabilitiesCatalog from './components/ArsenalCapabilitiesCatalog';
import InteractiveTerminal from './components/InteractiveTerminal';
import ReportGenerator from './components/ReportGenerator';
import RiskCalculator from './components/RiskCalculator';
import CweMatrix from './components/CweMatrix';
import ArchitectureFlow from './components/ArchitectureFlow';
import ScenariosCheatsheet from './components/ScenariosCheatsheet';
import AutonomousEngineStudio from './components/AutonomousEngineStudio';
import ChaptersIndex from './components/ChaptersIndex';
import ReadmeViewer from './components/ReadmeViewer';
import PresentationDeck from './components/PresentationDeck';
import Footer from './components/Footer';
import WatermarkOverlay from './components/WatermarkOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'site' | 'slides'>('site');
  const [searchQuery, setSearchQuery] = useState('');

  // Global shortcut: Ctrl+K or Cmd+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (activeTab === 'slides') {
          setActiveTab('site');
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
  }, [activeTab]);

  const handleSearchClick = () => {
    if (activeTab === 'slides') {
      setActiveTab('site');
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
    if (activeTab === 'slides') {
      setActiveTab('site');
    }
    const simElement = document.getElementById('comandos-cli');
    if (simElement) {
      simElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeTab === 'slides') {
    return <PresentationDeck onExitSlides={() => setActiveTab('site')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Subtle Background Watermark & Interactive Authenticity Stamp */}
      <WatermarkOverlay />

      {/* Top Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSearchClick={handleSearchClick}
      />

      {/* Main Presentation & Documentation Content */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero Section */}
        <Hero 
          onOpenSimulator={handleOpenSimulator}
          onOpenSlides={() => setActiveTab('slides')}
        />

        {/* 2. Mega Biblioteca de Casos de Uso & Arsenal Bug Bounty (20k Possibilidades) */}
        <ArsenalCapabilitiesCatalog />

        {/* 3. Interactive CLI Builder & Output Simulator */}
        <InteractiveTerminal />

        {/* 3. Bug Bounty & Pentest Report Generator (No API, English Markdown Support) */}
        <ReportGenerator />

        {/* 4. Interactive Risk Score Engine */}
        <RiskCalculator />

        {/* 5. CWE Matrix & Detector Explorer */}
        <CweMatrix />

        {/* 6. Pipeline & Architecture Visualizer */}
        <ArchitectureFlow />

        {/* 7. 100% Native Autonomous Engine Studio (Zero External Go/Binary Dependencies) */}
        <AutonomousEngineStudio />

        {/* 8. Scenarios, Recipes, Bash Script & Termux Integrations */}
        <ScenariosCheatsheet />

        {/* 8. Comprehensive Documentation Viewer */}
        <ChaptersIndex 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 9. GitHub README Export & Multi-Agent AI Guide */}
        <ReadmeViewer />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
