import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Maximize2, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  Terminal, 
  EyeOff, 
  Layers, 
  Lock, 
  ShieldAlert, 
  FileWarning, 
  FolderSearch, 
  FileCode, 
  Compass, 
  Zap, 
  Cpu, 
  Award, 
  Globe, 
  Database, 
  Github, 
  Code2, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';
import { SlideData } from '../types';

interface PresentationDeckProps {
  onExitSlides: () => void;
}

export default function PresentationDeck({ onExitSlides }: PresentationDeckProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onExitSlides();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'EyeOff': return <EyeOff className="w-5 h-5 text-purple-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-teal-400" />;
      case 'Lock': return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'FileWarning': return <FileWarning className="w-5 h-5 text-red-400" />;
      case 'FolderSearch': return <FolderSearch className="w-5 h-5 text-blue-400" />;
      case 'FileCode': return <FileCode className="w-5 h-5 text-indigo-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-sky-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-400" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Database': return <Database className="w-5 h-5 text-indigo-400" />;
      case 'Github': return <Github className="w-5 h-5 text-slate-300" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-teal-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default: return <SparklesIcon />;
    }
  };

  function SparklesIcon() {
    return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Presentation Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-mono text-emerald-400 flex items-center gap-1.5 shrink-0">
            <Presentation className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline font-bold">MODO APRESENTAÇÃO / KEYNOTE</span>
            <span className="hidden sm:inline md:hidden font-bold">APRESENTAÇÃO</span>
            <span className="sm:hidden font-bold">KEYNOTE</span>
          </div>
          <span className="text-xs text-slate-400 hidden lg:inline">
            Use as teclas <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">→</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">Espaço</kbd>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap">
            <span className="hidden sm:inline text-slate-400">Slide </span>
            <strong className="text-emerald-400">{currentSlideIndex + 1}</strong>
            <span className="text-slate-500"> / </span>
            <span>{totalSlides}</span>
          </span>
          <button
            onClick={onExitSlides}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-800 text-[11px] sm:text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Voltar ao Site</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card Container */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center my-4 sm:my-6">
        <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800 p-5 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Slide Badge */}
          <div className="inline-block text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3">
            {slide.badge}
          </div>

          {/* Slide Title & Subtitle */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-2">
            {slide.title}
          </h2>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mb-6 sm:mb-8">
            {slide.subtitle}
          </p>

          {/* Grid: Bullets & Code Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-6 sm:mb-8">
            {/* Bullets List */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              {slide.bullets.map((bullet, bIdx) => (
                <div 
                  key={bIdx}
                  className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-start gap-3 sm:gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {getIcon(bullet.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm sm:text-base mb-1">
                      {bullet.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {bullet.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code / Visual Box */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3">
              {slide.codeBlock && (
                <>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      {slide.codeBlock.lang}
                    </span>
                    <button
                      onClick={() => handleCopyCode(slide.codeBlock!.code)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                      title="Copiar código"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {slide.codeBlock.code}
                  </pre>
                  {slide.codeBlock.note && (
                    <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                      // {slide.codeBlock.note}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Key Takeaway Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-800/30 flex items-center gap-3 text-xs sm:text-sm text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span><strong className="text-emerald-200">Takeaway:</strong> {slide.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Thumbnails Bar */}
      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>
          <button
            onClick={nextSlide}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <span>Próximo Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1 px-1">
          {PRESENTATION_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer shrink-0 ${
                currentSlideIndex === idx
                  ? 'w-6 sm:w-8 bg-emerald-400'
                  : 'w-2 sm:w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Ir para o Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
