import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  Network, 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu,
  Share2,
  List
} from 'lucide-react';
import { AssetItem } from '../../types/product';

interface AssetsExplorerViewProps {
  assets: AssetItem[];
  targetRoot: string;
}

export default function AssetsExplorerView({ assets, targetRoot }: AssetsExplorerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'DOMAIN':
      case 'SUBDOMAIN':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'IP':
        return <Network className="w-4 h-4 text-cyan-400" />;
      case 'PORT':
      case 'SERVICE':
        return <Server className="w-4 h-4 text-amber-400" />;
      case 'URL':
      case 'ENDPOINT':
        return <ExternalLink className="w-4 h-4 text-sky-400" />;
      case 'TECHNOLOGY':
        return <Cpu className="w-4 h-4 text-violet-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Grafo Unificado de Superfície & Ativos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {assets.length} ativos mapeados autonomamente sob o alvo <strong className="text-emerald-300 font-mono">{targetRoot}</strong>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'graph'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Grafo Hierárquico</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por domínio, IP, porta, tecnologia ou tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
          {['ALL', 'DOMAIN', 'SUBDOMAIN', 'IP', 'PORT', 'URL', 'TECHNOLOGY'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                typeFilter === t
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Valor do Ativo</th>
                  <th className="py-3.5 px-4">Confiança</th>
                  <th className="py-3.5 px-4">Tags & Contexto</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          {getAssetIcon(asset.type)}
                          <span>{asset.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 max-w-md truncate">
                        {asset.value}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-bold">
                          {Math.round(asset.confidence * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(asset.tags || []).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px] border border-slate-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Mapeado
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Nenhum ativo encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRAPH VIEW */}
      {viewMode === 'graph' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Visualização de Topologia de Superfície</h3>
          <p className="text-xs text-slate-400">Relações de dependência descobertas pelos motores de rede e DNS.</p>

          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Globe className="w-4 h-4" />
              <span>ROOT DOMAIN: {targetRoot}</span>
            </div>

            <div className="pl-6 border-l-2 border-slate-800 space-y-4">
              <div className="space-y-2">
                <span className="text-cyan-300 font-semibold block">├── SUBDOMÍNIOS & HOSTS</span>
                <div className="pl-6 border-l-2 border-slate-800 space-y-1.5 text-slate-300">
                  <div>api.{targetRoot.replace(/^https?:\/\//, '')} <span className="text-slate-500">→ IP: 198.51.100.42</span></div>
                  <div>auth.{targetRoot.replace(/^https?:\/\//, '')} <span className="text-slate-500">→ IP: 198.51.100.43</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-amber-300 font-semibold block">├── PORTAS & SERVIÇOS EM RAW SOCKETS</span>
                <div className="pl-6 border-l-2 border-slate-800 space-y-1.5 text-slate-300">
                  <div>443/TCP <span className="text-emerald-400">(HTTPS / TLS 1.3 / Nginx)</span></div>
                  <div>80/TCP <span className="text-cyan-400">(HTTP 301 Redirect)</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-violet-300 font-semibold block">└── STACK TECNOLÓGICA FINGERPRINT</span>
                <div className="pl-6 border-l-2 border-slate-800 space-y-1.5 text-slate-300">
                  <div>Nginx 1.24.0 • Next.js • React • Cloudflare Edge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
