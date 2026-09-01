import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Filter,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { CHAPTERS_DATA } from '../data/manualContent';
import { Chapter } from '../types';

interface ChaptersIndexProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function ChaptersIndex({ searchQuery, setSearchQuery }: ChaptersIndexProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([1, 2, 3, 5, 8]);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const toggleChapter = (id: number) => {
    setExpandedChapterIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedChapterIds(CHAPTERS_DATA.map(c => c.id));
  };

  const collapseAll = () => {
    setExpandedChapterIds([]);
  };

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const filteredChapters = CHAPTERS_DATA.filter(ch => {
    const matchesCategory = selectedCategory === 'todos' || ch.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      ch.title.toLowerCase().includes(query) ||
      ch.summary.toLowerCase().includes(query) ||
      ch.content.some(line => line.toLowerCase().includes(query)) ||
      (ch.codeSnippets && ch.codeSnippets.some(s => s.code.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'fundamentos':
        return { label: 'Fundamentos', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'pratica':
        return { label: 'Prática & Scans', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'integracoes':
        return { label: 'Integrações', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
      case 'avancado':
        return { label: 'Avançado & Dev', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'etica':
        return { label: 'Ética & Legal', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      default:
        return { label: cat, color: 'bg-slate-800 text-slate-400' };
    }
  };

  return (
    <section id="manual" className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>MANUAL COMPLETO V1.0 • {CHAPTERS_DATA.length} CAPÍTULOS & CREWAI</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Documentação Técnica Oficial
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Mais de 50 páginas de documentação técnica, parâmetros de crawling, instalação de dependências, arquitetura dos 17 motores nativos e automação de enxame de agentes com orquestração autoral.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition"
            >
              Expandir Todos
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition"
            >
              Recolher Todos
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar no manual (ex: cwe-200, delay, headers, tokens, flags)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 font-mono"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'todos', label: 'Todos (26)' },
              { id: 'fundamentos', label: 'Fundamentos' },
              { id: 'pratica', label: 'Prática & Scans' },
              { id: 'integracoes', label: 'Integrações' },
              { id: 'avancado', label: 'Avançado' },
              { id: 'etica', label: 'Ética' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === tab.id
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Accordion / List */}
        <div className="space-y-4">
          {filteredChapters.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">Nenhum capítulo encontrado para "{searchQuery}".</p>
              <p className="text-xs text-slate-500 mt-1">Tente pesquisar por outros termos como "nuclei", "zap", "delay", "cwe-693" ou "flags".</p>
            </div>
          ) : (
            filteredChapters.map(chapter => {
              const isExpanded = expandedChapterIds.includes(chapter.id);
              const badge = getCategoryBadge(chapter.category);

              return (
                <div
                  key={chapter.id}
                  id={chapter.slug}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-900/90 border-slate-700 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Chapter Header Bar */}
                  <div
                    onClick={() => toggleChapter(chapter.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 font-mono font-bold text-xs flex items-center justify-center text-slate-300">
                        {chapter.id < 10 ? `0${chapter.id}` : chapter.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-slate-100 text-base">
                            {chapter.title}
                          </h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{chapter.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-xs font-mono hidden sm:inline text-slate-500">
                        {isExpanded ? 'Recolher' : 'Expandir'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Chapter Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-sm text-slate-300 leading-relaxed">
                      {/* Paragraphs */}
                      <div className="space-y-2 text-xs sm:text-sm">
                        {chapter.content.map((p, pIdx) => (
                          <p key={pIdx} className="text-slate-300">
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Tables (if present) */}
                      {chapter.table && (
                        <div className="overflow-x-auto my-3 rounded-xl border border-slate-800">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                              <tr>
                                {chapter.table.headers.map((th, thIdx) => (
                                  <th key={thIdx} className="px-3.5 py-2.5 font-semibold">
                                    {th}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                              {chapter.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-800/30">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={`px-3.5 py-2 ${cIdx === 0 ? 'font-bold text-emerald-400' : 'text-slate-300'}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Code Snippets (if present) */}
                      {chapter.codeSnippets && chapter.codeSnippets.map((snippet, sIdx) => {
                        const snippetKey = `${chapter.id}-${sIdx}`;
                        return (
                          <div key={sIdx} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                            <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                              <span className="text-slate-400 flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                                {snippet.caption || `${snippet.language} snippet`}
                              </span>
                              <button
                                onClick={() => handleCopyCode(snippetKey, snippet.code)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 text-[11px] transition"
                              >
                                {copiedCodeKey === snippetKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedCodeKey === snippetKey ? 'Copiado!' : 'Copiar'}</span>
                              </button>
                            </div>
                            <pre className="p-3.5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                              {snippet.code}
                            </pre>
                          </div>
                        );
                      })}

                      {/* Tips Callouts */}
                      {chapter.tips && chapter.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}

                      {/* Warnings Callouts */}
                      {chapter.warnings && chapter.warnings.map((w, wIdx) => (
                        <div key={wIdx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
