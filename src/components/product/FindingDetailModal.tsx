import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Cpu, 
  AlertTriangle,
  Sliders,
  FileCode,
  Lock,
  Zap,
  Activity
} from 'lucide-react';
import { FindingItem } from '../../types/product';

interface FindingDetailModalProps {
  finding: FindingItem | null;
  onClose: () => void;
}

export default function FindingDetailModal({ finding, onClose }: FindingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'validation' | 'classification' | 'impact'>('overview');
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!finding) return null;

  const handleCopyCurl = () => {
    if (finding.chain_of_evidence?.curl_reproduction) {
      navigator.clipboard.writeText(finding.chain_of_evidence.curl_reproduction);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const getSeverityBadge = (severity: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getSeverityBadge(finding.severity)}`}>
                {finding.severity}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Confiança: <strong className="text-emerald-400">{Math.round(finding.confidence * 100)}%</strong>
              </span>
              <span className="text-xs font-mono text-slate-400">
                • CVSS: <strong className="text-cyan-400">{finding.cvss_score}</strong>
              </span>
              <span className="text-xs font-mono text-slate-400">
                • Risk Score: <strong className="text-amber-400">{finding.risk_score}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {finding.title}
            </h2>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>Alvo:</span>
              <span className="text-emerald-300 truncate max-w-lg">{finding.target}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 font-mono text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'evidence', label: 'Cadeia de Evidências (PoC)' },
            { id: 'validation', label: 'Validação Diferencial' },
            { id: 'classification', label: 'CWE & OWASP' },
            { id: 'impact', label: 'Impacto & Mitigação' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200 text-xs sm:text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Descrição Técnica
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {finding.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Impacto Potencial no Negócio
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {finding.impact}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ação Recomendada de Correção
                </h4>
                <div className="text-emerald-300 leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                  {finding.mitigation}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE CHAIN */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold uppercase tracking-wider">
                    Comando de Reprodução cURL (Sanitizado)
                  </span>
                  <button
                    onClick={handleCopyCurl}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1 font-mono text-[11px]"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                  {finding.chain_of_evidence?.curl_reproduction || 'N/A'}
                </pre>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tokens e cookies sensíveis foram automaticamente sanitizados com [REDACTED_BY_CYBER_HUNTER].</span>
                </div>
              </div>

              {/* Itens da cadeia */}
              {(finding.chain_of_evidence?.items || []).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                      Prova #{idx + 1}
                    </span>
                  </div>
                  <p className="text-slate-400">{item.description}</p>
                  
                  {item.response && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 block">Resposta HTTP Observada:</span>
                      <pre className="p-2.5 bg-slate-900 rounded text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                        Status: {item.response.status_code} OK&#10;
                        Body Snippet: {item.response.body_snippet}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VALIDATION */}
          {activeTab === 'validation' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Triangulação Diferencial Confirmada</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  O motor CH-VERIFY executou requisições de Baseline, Controle e Teste, descartando anomalias causadas por Soft 404 ou páginas genéricas de erro do web server.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">1. BASELINE</span>
                  <span className="text-slate-200 font-bold">Inerte (Status 200)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">2. CONTROLE</span>
                  <span className="text-slate-200 font-bold">Canário (Status 404)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">3. TESTE EXPOSTO</span>
                  <span className="text-emerald-400 font-bold">Diferença Confirmada</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLASSIFICATION */}
          {activeTab === 'classification' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-mono block">Taxonomia MITRE CWE</span>
                  <span className="text-base font-bold font-mono text-emerald-400 block">{finding.cwe_id}</span>
                  <p className="text-slate-300 text-xs">
                    Exposição de Informações Sensíveis a Atores Não Autorizados.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-mono block">Enquadramento OWASP</span>
                  <span className="text-base font-bold font-mono text-cyan-400 block">{finding.owasp_id || 'A01:2021'}</span>
                  <p className="text-slate-300 text-xs">
                    Broken Access Control / Security Misconfiguration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMPACT */}
          {activeTab === 'impact' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vetor CVSS v3.1:</span>
                  <span className="text-cyan-300 font-bold">{finding.cvss_vector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Score Base CVSS:</span>
                  <span className="text-rose-400 font-bold text-sm">{finding.cvss_score} / 10</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Risco Ponderado Real:</span>
                  <span className="text-amber-400 font-bold text-sm">{finding.risk_score}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            ID: {finding.id} • Validado pelo Cyber Hunter Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Fechar Detalhes
          </button>
        </div>

      </div>
    </div>
  );
}
