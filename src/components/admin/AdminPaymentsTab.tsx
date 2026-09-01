import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Search, 
  KeyRound, 
  Download,
  Zap,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { PaymentItem } from '../../types/admin';
import { downloadLicenseHtmlFile } from '../../utils/licenseDownload';

export default function AdminPaymentsTab() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleManualConfirm = async (paymentId: string) => {
    setConfirmingId(paymentId);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao confirmar.');
      }
      setMsg(`Pagamento ${paymentId} confirmado e licença ${data.license?.key} gerada com sucesso!`);
      fetchPayments();
    } catch (err: any) {
      setMsg(err.message || 'Erro ao confirmar pagamento.');
    } finally {
      setConfirmingId(null);
    }
  };

  const filtered = payments.filter(p => 
    p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.license_key_generated?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-400" />
            <span>Transações & Cobranças Pix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Histórico completo de pedidos, liquidações e emissão automatizada de chaves.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, email ou ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
          />
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-rose-500" />
          Carregando transações Pix...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-xs font-mono text-slate-500">
          Nenhuma transação Pix registrada até o momento.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">ID / Data</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Plano / Valor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Chave Emitida</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{pay.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(pay.created_at).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200 font-semibold">{pay.client_name}</div>
                      <div className="text-[11px] text-slate-400">{pay.client_email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300 font-bold">{pay.plan_name || 'Cyber Hunter Lab'}</div>
                      <div className="text-rose-400 font-extrabold">
                        R$ {Number(pay.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      {pay.status === 'CONFIRMED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>CONFIRMADO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          <span>PENDENTE</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {pay.license_key_generated ? (
                        <span className="text-emerald-300 font-mono font-bold bg-slate-950 px-2 py-1 rounded border border-emerald-500/30">
                          {pay.license_key_generated}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {pay.status !== 'CONFIRMED' && (
                        <button
                          onClick={() => handleManualConfirm(pay.id)}
                          disabled={confirmingId === pay.id}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          {confirmingId === pay.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>Confirmar Pix</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
