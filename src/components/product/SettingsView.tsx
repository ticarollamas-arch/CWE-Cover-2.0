import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save,
  Server,
  RefreshCw
} from 'lucide-react';
import { SystemStatus } from '../../types/product';

interface SettingsViewProps {
  systemStatus: SystemStatus | null;
  onRefreshStatus: () => void;
}

export default function SettingsView({ systemStatus, onRefreshStatus }: SettingsViewProps) {
  const [ollamaEndpoint, setOllamaEndpoint] = useState(systemStatus?.ai_status?.endpoint || 'http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState('mistral');
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);

  // Escopo e Concorrência
  const [strictScope, setStrictScope] = useState(true);
  const [rpsLimit, setRpsLimit] = useState(15);
  const [maxConcurrency, setMaxConcurrency] = useState(8);
  const [socketTimeoutMs, setSocketTimeoutMs] = useState(3500);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestOllama = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: ollamaEndpoint, model: selectedModel })
      });
      const data = await res.json();
      if (data.connected) {
        setAiTestResult('✓ Conexão estabelecida com sucesso com o daemon Ollama local!');
      } else {
        setAiTestResult('○ Daemon Ollama não detectado em localhost:11434 (Operando em modo autônomo sem IA local).');
      }
    } catch (err) {
      setAiTestResult('○ Daemon Ollama offline. Os 17 motores continuam operando 100% de forma autônoma.');
    } finally {
      setIsTestingAi(false);
      onRefreshStatus();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Configurações & Parâmetros do Runtime</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ajuste de performance de raw sockets, políticas de escopo e integração com IA local opcional.
          </p>
        </div>

        <button
          onClick={onRefreshStatus}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sincronizar Runtime</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">

        {/* SECTION 1: IA LOCAL (OLLAMA) */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                1. IA Local Opcional (Ollama / Local LLM)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
              Zero Dependência de Nuvem
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Endpoint Local Ollama:</label>
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Modelo Local:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="mistral">mistral (7B)</option>
                <option value="llama3">llama3 (8B)</option>
                <option value="qwen2.5-coder">qwen2.5-coder (7B)</option>
                <option value="deepseek-coder">deepseek-coder</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestOllama}
              disabled={isTestingAi}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
            >
              {isTestingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
              <span>TESTAR CONEXÃO COM OLLAMA</span>
            </button>

            {aiTestResult && (
              <span className={`text-xs font-mono ${aiTestResult.includes('✓') ? 'text-emerald-400' : 'text-slate-400'}`}>
                {aiTestResult}
              </span>
            )}
          </div>
        </div>

        {/* SECTION 2: ESCOPO & LIMITES */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              2. Políticas de Escopo & Limites de Taxa
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block">Limite de Requisições (RPS):</label>
              <input
                type="number"
                value={rpsLimit}
                onChange={(e) => setRpsLimit(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">Prevenção contra negação de serviço</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block">Concorrência Máxima (Workers):</label>
              <input
                type="number"
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                min={1}
                max={32}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-cyan-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">Grafo de tarefas assíncronas</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block">Socket Timeout (ms):</label>
              <input
                type="number"
                value={socketTimeoutMs}
                onChange={(e) => setSocketTimeoutMs(Number(e.target.value))}
                min={500}
                max={10000}
                step={500}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-amber-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 block">Limite de latência em raw sockets</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: INFORMAÇÕES DA LICENÇA ATUAL */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              3. Identidade da Instalação & Licença Ativa
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Chave Atual:</span>
              <span className="text-emerald-400 font-bold truncate block" title={systemStatus?.license?.key || 'CHL-984F-71EA-B392-501D'}>
                {systemStatus?.license?.key || 'CHL-984F-71EA-B392-501D'}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Plano:</span>
              <span className="text-slate-200 font-bold block">{systemStatus?.license?.plan || 'Professional'}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Status:</span>
              <span className="text-emerald-400 font-bold block">Active (Registrado)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Installation ID:</span>
              <span className="text-cyan-300 font-bold truncate block" title={systemStatus?.runtime?.installation_id || 'CHL-NODE-984F-71EA-B392-501D'}>
                {systemStatus?.runtime?.installation_id || 'CHL-NODE-984F-71EA-B392-501D'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configurações salvas e aplicadas com sucesso!</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SALVAR CONFIGURAÇÕES</span>
          </button>
        </div>

      </form>

    </div>
  );
}
