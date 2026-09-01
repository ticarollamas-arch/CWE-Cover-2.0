import React from 'react';
import { 
  Compass, 
  GraduationCap, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Zap, 
  Target, 
  Cpu, 
  Server, 
  Smartphone,
  Scale
} from 'lucide-react';

interface ProductPositioningSectionProps {
  onOpenSetup?: () => void;
  onOpenManuals?: (tab?: 'guide' | 'steps' | 'videos' | 'policies') => void;
  onOpenCheckout?: () => void;
}

export default function ProductPositioningSection({
  onOpenSetup,
  onOpenManuals,
  onOpenCheckout
}: ProductPositioningSectionProps) {
  const targetAudience = [
    {
      title: 'Iniciantes em Bug Bounty',
      desc: 'Pesquisadores que buscam praticidade para mapear superfícies e identificar anomalias sem se perder em sintaxes complexas de dezenas de ferramentas.',
      icon: Target,
      tag: 'Prática Real'
    },
    {
      title: 'Iniciantes em Cibersegurança',
      desc: 'Profissionais em transição de carreira ou ingressando no mercado que precisam entender a anatomia de falhas e o fluxo de uma auditoria.',
      icon: ShieldCheck,
      tag: 'Fundamentos'
    },
    {
      title: 'Estudantes & Autodidatas',
      desc: 'Entusiastas de tecnologia que aprendem melhor na prática, inspecionando requisições, cabeçalhos HTTP, portas e evidências sanitizadas.',
      icon: GraduationCap,
      tag: 'Educacional'
    },
    {
      title: 'Quem busca aprender praticando',
      desc: 'Menos teoria abstrata e mais observação de como motores de rede, heurísticas e inteligência artificial cooperam em um pipeline real.',
      icon: Zap,
      tag: 'Hands-on'
    },
    {
      title: 'Quem tem dificuldade com o terminal',
      desc: 'Uma interface gráfica moderna que consolida 17 motores em um único painel visual, eliminando o atrito de scripts quebrados.',
      icon: Terminal,
      tag: 'Zero Fricção'
    },
    {
      title: 'Quem busca organizar avaliações autorizadas',
      desc: 'Profissionais que necessitam de escopo delimitado, taxa controlada (RPS), ledger imutável SHA-256 e relatórios executivos prontos.',
      icon: Layers,
      tag: 'Profissionalismo'
    }
  ];

  const productLifecycle = [
    { step: '1', title: 'Configurar', desc: 'Setup simplificado em VPS Linux ou PC com comandos copiáveis.' },
    { step: '2', title: 'Aprender', desc: 'Compreenda a função de cada motor através da central de videoaulas e manuais.' },
    { step: '3', title: 'Executar com Autorização', desc: 'Defina o alvo estritamente autorizado com limites seguros de requisições.' },
    { step: '4', title: 'Analisar', desc: 'Acompanhe a telemetria em tempo real e a triangulação dos 18 agentes.' },
    { step: '5', title: 'Compreender', desc: 'Inspecione a classificação MITRE CWE, impactos e evidências sanitizadas.' },
    { step: '6', title: 'Corrigir', desc: 'Consulte recomendações claras e orientações de remediação defensiva.' },
    { step: '7', title: 'Documentar', desc: 'Exporte relatórios profissionais em Markdown (PT/EN), HTML e JSON.' }
  ];

  return (
    <section id="posicionamento" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Top Banner / Positioning Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>CYBER HUNTER LAB — POSICIONAMENTO</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Segurança mais acessível para <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            quem está começando.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Uma plataforma criada para ajudar novos pesquisadores de segurança a <strong>aprender, organizar e executar avaliações autorizadas</strong> com mais praticidade — diretamente no seu próprio ambiente.
        </p>

        {/* Citação de Propósito */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl text-emerald-300 font-mono text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-emerald-500/5 max-w-xl mx-auto">
          “Você está começando. Nós simplificamos a parte operacional para você aprender, analisar e evoluir.”
        </div>
      </div>

      {/* Grid: Para quem é a plataforma (Público-Alvo) */}
      <div className="space-y-6 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              PÚBLICO-ALVO & PROPOSTA DE VALOR
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Desenvolvido Especialmente Para:
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Reduzimos a complexidade operacional das ferramentas de linha de comando sem esconder o processo fundamental de aprendizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetAudience.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 hover:border-emerald-500/40 hover:bg-slate-900 transition flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ambiente Prático & Guiado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Princípio do Produto: O Ciclo de Evolução */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-8 mb-16">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            PRINCÍPIO OPERACIONAL DO PRODUTO
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
            Você Não Precisa Ser Especialista Para Começar
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Transformamos uma operação tecnicamente complexa em uma experiência visual e compreensível, mantendo evidências reais e deixando claro o que foi efetivamente executado.
          </p>
        </div>

        {/* 7-Step Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {productLifecycle.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 relative text-center hover:border-emerald-500/30 transition"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                0{item.step}
              </div>
              <h5 className="text-xs font-bold text-slate-100 font-mono leading-tight">{item.title}</h5>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Pilares de Prioridade */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center font-mono text-xs">
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-emerald-400 font-bold block">• Interface Gráfica</span>
            <span className="text-[10px] text-slate-500">Sem labirintos de terminal</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold block">• Evidências Reais</span>
            <span className="text-[10px] text-slate-500">Ledger SHA-256 auditável</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-purple-400 font-bold block">• Aprendizado Progressivo</span>
            <span className="text-[10px] text-slate-500">Compreensão a cada finding</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-amber-400 font-bold block">• Automação Responsável</span>
            <span className="text-[10px] text-slate-500">Escopo e limites estritos</span>
          </div>
        </div>
      </div>

      {/* Banner de Acessibilidade & Preço de R$ 47/mês */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>PROPOSTA DE ACESSIBILIDADE</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Acesso Profissional por R$ 47/mês
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O objetivo desse preço é permitir que pessoas que estão começando na área tenham acesso a uma <strong>plataforma profissional e autoral</strong> sem precisar investir inicialmente em diversas ferramentas caras ou serviços dispersos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm font-mono rounded-xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <span>COMEÇAR POR R$ 47/MÊS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onOpenManuals && (
              <button
                onClick={() => onOpenManuals('guide')}
                className="px-5 py-3.5 bg-slate-950 hover:bg-slate-850 text-emerald-300 border border-emerald-500/30 font-semibold text-sm font-mono rounded-xl transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>VER MANUAIS & AULAS</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
