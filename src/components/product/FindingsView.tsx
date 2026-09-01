import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  Sliders, 
  AlertTriangle,
  ArrowUpDown,
  Lock
} from 'lucide-react';
import { FindingItem, SeverityLevel } from '../../types/product';
import FindingDetailModal from './FindingDetailModal';

interface FindingsViewProps {
  findings: FindingItem[];
  targetName: string;
}

export default function FindingsView({ findings, targetName }: FindingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          finding.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          finding.cwe_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || finding.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Vulnerabilidades & Findings Confirmados</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {findings.length} achados validados diferencialmente sob <strong className="text-emerald-300 font-mono">{targetName}</strong>
          </p>
        </div>

        {/* Severity Metrics Mini-Cards */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/60 font-bold">
            {findings.filter(f => f.severity === 'CRITICAL').length} Críticos
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-950/40 text-orange-300 border border-orange-800/60 font-bold">
            {findings.filter(f => f.severity === 'HIGH').length} Altos
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/60 font-bold">
            {findings.filter(f => f.severity === 'MEDIUM').length} Médios
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por vulnerabilidade, CWE, OWASP ou URL..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-2 rounded-xl transition shrink-0 ${
                severityFilter === sev
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-3">
        {filteredFindings.length > 0 ? (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getSeverityBadge(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {finding.cwe_id}
                  </span>
                  {finding.owasp_id && (
                    <span className="text-xs font-mono text-cyan-400">
                      • {finding.owasp_id}
                    </span>
                  )}
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{Math.round(finding.confidence * 100)}% Confiança</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition">
                  {finding.title}
                </h3>

                <p className="text-xs font-mono text-slate-400 truncate max-w-2xl">
                  {finding.target}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="text-right hidden sm:block">
                  <span className="text-slate-500 block text-[10px]">CVSS / RISCO</span>
                  <span className="text-slate-200 font-bold">{finding.cvss_score} ({finding.risk_score})</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            Nenhuma vulnerabilidade encontrada para os critérios informados.
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Finding */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

    </div>
  );
}
