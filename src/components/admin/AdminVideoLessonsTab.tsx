import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Video, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Play, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface VideoLesson {
  id: number;
  title: string;
  stage: string;
  description: string;
  youtube_url: string;
  duration: string;
  topics: string[];
  updated_at: string;
}

export default function AdminVideoLessonsTab() {
  const [lessons, setLessons] = useState<VideoLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchLessons = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/video-lessons');
      const data = await res.json();
      if (res.ok && data.lessons) {
        setLessons(data.lessons);
      } else {
        setErrorMessage(data.error || 'Erro ao carregar videoaulas.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao carregar videoaulas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleLessonChange = (id: number, field: keyof VideoLesson, value: any) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSaveLesson = async (lesson: VideoLesson) => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/video-lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(`Videoaula ${lesson.id} salva com sucesso.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Erro ao salvar videoaula.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/video-lessons/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Todas as 6 videoaulas foram atualizadas com sucesso!');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(data.error || 'Erro ao salvar em lote.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100">Central de Videoaulas & Instrução Técnica</h2>
          </div>
          <p className="text-xs text-slate-400">
            Cadastre e atualize os links do YouTube para as 6 aulas em sequência didática oficial do Cyber Hunter Lab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLessons}
            disabled={isLoading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono transition flex items-center gap-1"
            title="Recarregar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving || isLoading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'SALVANDO...' : 'SALVAR TODAS AS AULAS'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Instruction Box */}
      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-200 block">Como funcionam os links de videoaula:</span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Insira o link padrão do YouTube (ex: <code className="text-cyan-300 font-mono">https://www.youtube.com/watch?v=VIDEO_ID</code> ou <code className="text-cyan-300 font-mono">https://youtu.be/VIDEO_ID</code>). 
            Se o campo permanecer vazio, o portal exibirá o status claro <strong className="text-amber-400">"Videoaula ainda não disponível (em gravação / aguardando link do instrutor)"</strong> para o usuário, sem gerar erros ou players fictícios.
          </p>
        </div>
      </div>

      {/* Video Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const hasLink = Boolean(lesson.youtube_url && lesson.youtube_url.trim().length > 0);

          return (
            <div 
              key={lesson.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-bold flex items-center justify-center text-xs">
                    0{lesson.id}
                  </span>
                  <div>
                    <span className="text-xs font-mono font-semibold text-rose-400 block">{lesson.stage}</span>
                    <h3 className="text-sm font-bold text-slate-100">{lesson.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border ${
                    hasLink 
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                  }`}>
                    {hasLink ? '● LINK ATIVO' : '○ AGUARDANDO LINK'}
                  </span>

                  <button
                    onClick={() => handleSaveLesson(lesson)}
                    disabled={isSaving}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-rose-400" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">TÍTULO DA AULA</label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(lesson.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">DURAÇÃO ESTIMADA</label>
                  <input
                    type="text"
                    value={lesson.duration}
                    onChange={(e) => handleLessonChange(lesson.id, 'duration', e.target.value)}
                    placeholder="Ex: 18 min"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                {/* YouTube URL */}
                <div className="md:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-400 block">LINK DO YOUTUBE</label>
                    {hasLink && (
                      <a 
                        href={lesson.youtube_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                      >
                        <span>Testar no YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={lesson.youtube_url}
                    onChange={(e) => handleLessonChange(lesson.id, 'youtube_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">EMENTA / DESCRIÇÃO PEDAGÓGICA</label>
                  <textarea
                    rows={2}
                    value={lesson.description}
                    onChange={(e) => handleLessonChange(lesson.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500 leading-relaxed"
                  />
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
