import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Lock, 
  ShieldCheck, 
  Search, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { FindingItem } from '../../types/product';

interface EvidenceLedgerViewProps {
  findings: FindingItem[];
}

export default function EvidenceLedgerView({ findings }: EvidenceLedgerViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopyCurl = (id: string, curl: string) => {
    navigator.clipboard.writeText(curl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFindings = findings.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <span>Ledger de Evidências Sanitizadas & PoCs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro auditável de provas de conceito para reprodução independente sem exposição de dados sensíveis.
          </p>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Sanitização Automática [REDACTED_BY_CYBER_HUNTER] Ativa</span>
        </div>
      </div>

      {/* List of Evidence Chains */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500">ID: {finding.id} • {finding.cwe_id}</span>
                <h3 className="text-sm font-bold text-slate-200 mt-0.5">{finding.title}</h3>
                <span className="text-xs font-mono text-emerald-400">{finding.target}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                ✓ Prova Validada ({Math.round(finding.confidence * 100)}%)
              </span>
            </div>

            {/* cURL Command */}
            {finding.chain_of_evidence?.curl_reproduction && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Comando cURL de Reprodução Técnica:</span>
                  <button
                    onClick={() => handleCopyCurl(finding.id, finding.chain_of_evidence!.curl_reproduction)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === finding.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === finding.id ? 'Copiado!' : 'Copiar cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                  {finding.chain_of_evidence.curl_reproduction}
                </pre>
              </div>
            )}

            {/* Provas detalhadas */}
            {(finding.chain_of_evidence?.items || []).map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-slate-300">Evidência #{idx + 1}: {item.title}</span>
                  <span className="text-[10px] text-emerald-400">Status 200 OK</span>
                </div>
                <p className="text-slate-400 font-sans">{item.description}</p>
                {item.response?.body_snippet && (
                  <pre className="p-2.5 bg-slate-900 rounded text-slate-300 text-[11px] overflow-x-auto border border-slate-800">
                    {item.response.body_snippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
