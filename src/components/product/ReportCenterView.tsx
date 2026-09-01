import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Code, 
  Globe, 
  ShieldCheck, 
  AlertTriangle,
  Printer
} from 'lucide-react';
import { CampaignItem } from '../../types/product';

interface ReportCenterViewProps {
  campaign: CampaignItem;
}

export default function ReportCenterView({ campaign }: ReportCenterViewProps) {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async (format: 'markdown' | 'html' | 'json' | 'jsonl') => {
    setExportingFormat(format);
    try {
      const response = await fetch(`/api/reports/${campaign.id}/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CyberHunter_Report_${campaign.id}_${campaign.scope.domain}.${format === 'markdown' ? 'md' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao exportar relatório:', err);
    } finally {
      setTimeout(() => setExportingFormat(null), 1000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Export Actions */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
              ID: {campaign.id}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Gerado pelo Cyber Hunter Report Agent
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Centro de Relatórios Técnicos & Executivos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Alvo: <strong className="text-emerald-300 font-mono">{campaign.target}</strong> • Risco Consolidado: <strong className="text-rose-400 font-mono">{campaign.overall_risk} ({campaign.risk_score})</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <button
            onClick={() => handleExport('markdown')}
            disabled={!!exportingFormat}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Markdown (.md)</span>
          </button>
          
          <button
            onClick={() => handleExport('html')}
            disabled={!!exportingFormat}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>HTML Executivo</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={!!exportingFormat}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON Estruturado</span>
          </button>

          <button
            onClick={() => handleExport('jsonl')}
            disabled={!!exportingFormat}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>JSONL (SIEM)</span>
          </button>
        </div>
      </div>

      {/* Relatório Renderizado */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
        
        {/* Banner do Relatório */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Cyber Hunter Lab • Autonomous Assessment
            </span>
            <span className="text-xs font-mono text-slate-500">
              Data: {new Date(campaign.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-2">
            Relatório Técnico de Postura & Superfície de Ataque
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Alvo: {campaign.target} | Perfil: {campaign.scope.profile} | Duração: {campaign.duration_sec}s
          </p>
        </div>

        {/* Resumo Executivo */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            1. Resumo Executivo
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            A auditoria autônoma do alvo <strong>{campaign.scope.domain}</strong> foi concluída utilizando a esteira de 17 motores próprios e 18 agentes especializados do Cyber Hunter Lab. Foram mapeados <strong>{campaign.assets_count} ativos</strong> de superfície e identificados <strong>{campaign.findings_count} findings confirmados</strong> após validação diferencial para eliminação de falsos positivos. O nível geral de risco atribuído é <strong>{campaign.overall_risk}</strong> (Score {campaign.risk_score}/100).
          </p>
        </div>

        {/* Resumo Quantitativo de Severidade */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <span className="text-slate-400 block text-[10px]">CRITICAL</span>
            <span className="text-lg font-bold text-rose-400">{campaign.critical_count}</span>
          </div>
          <div className="p-3 bg-orange-950/20 border border-orange-500/30 rounded-xl">
            <span className="text-slate-400 block text-[10px]">HIGH</span>
            <span className="text-lg font-bold text-orange-400">{campaign.high_count}</span>
          </div>
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
            <span className="text-slate-400 block text-[10px]">MEDIUM</span>
            <span className="text-lg font-bold text-amber-400">{campaign.medium_count}</span>
          </div>
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
            <span className="text-slate-400 block text-[10px]">LOW / INFO</span>
            <span className="text-lg font-bold text-cyan-400">{campaign.low_count}</span>
          </div>
        </div>

        {/* Detalhe dos Achados */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            2. Achados e Recomendações Técnicas
          </h3>
          
          <div className="space-y-4">
            {campaign.findings.map((f, i) => (
              <div key={f.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400">#{i + 1} {f.title}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px]">
                      {f.severity}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{f.cwe_id}</span>
                </div>

                <div className="space-y-2 text-slate-300 font-sans">
                  <div>
                    <strong className="text-slate-400 text-xs font-mono block">Impacto:</strong>
                    <p className="text-xs">{f.impact}</p>
                  </div>
                  <div>
                    <strong className="text-slate-400 text-xs font-mono block">Mitigação Recomendada:</strong>
                    <p className="text-xs text-emerald-300">{f.mitigation}</p>
                  </div>
                </div>

                {f.chain_of_evidence?.curl_reproduction && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] text-slate-500 block">Comando de Reprodução (Sanitizado):</span>
                    <pre className="p-2 bg-slate-900 rounded text-cyan-300 text-[11px] overflow-x-auto border border-slate-800">
                      {f.chain_of_evidence.curl_reproduction}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
