import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  DollarSign, 
  Layers, 
  Edit3,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { PlanItem } from '../../types/admin';

export default function AdminPlansTab() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      if (data.plans) {
        setPlans(data.plans);
        if (!selectedPlan && data.plans.length > 0) {
          setSelectedPlan(data.plans[0]);
        }
      }
    } catch {
      setErrorMsg('Erro ao carregar planos comerciais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/plans/${selectedPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPlan)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar plano.');
      }

      setSuccessMsg('Plano comercial atualizado com sucesso!');
      fetchPlans();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar alterações no plano.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-rose-500" />
        Carregando planos comerciais...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-400" />
            <span>Gestão de Planos & Precificação Pix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure valores, períodos e regras comerciais desacopladas da aplicação.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plans List */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Planos Cadastrados
          </div>
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedPlan?.id === p.id
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">{p.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  p.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-rose-300 font-extrabold">
                R$ {Number(p.price).toFixed(2)} <span className="text-slate-400 font-normal">/{p.period_label || 'mês'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Editor Form */}
        {selectedPlan && (
          <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-100 font-mono">
                Editar Plano: {selectedPlan.name}
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {selectedPlan.id}</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nome do Plano</label>
                  <input
                    type="text"
                    value={selectedPlan.name}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Preço (R$ BRL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedPlan.price}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-rose-300 font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Periodicidade</label>
                  <select
                    value={selectedPlan.period || 'monthly'}
                    onChange={(e) => setSelectedPlan({ 
                      ...selectedPlan, 
                      period: e.target.value,
                      period_label: e.target.value === 'yearly' ? 'ano' : 'mês'
                    })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono"
                  >
                    <option value="monthly">Mensal (/mês)</option>
                    <option value="yearly">Anual (/ano)</option>
                    <option value="lifetime">Vitalício (Único)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Status Comercial</label>
                  <select
                    value={selectedPlan.status}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono"
                  >
                    <option value="ACTIVE">ATIVO (Visível no Checkout)</option>
                    <option value="PAUSED">PAUSADO (Oculto)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Descrição</label>
                <textarea
                  value={selectedPlan.description || ''}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Instruções de Pagamento Pix</label>
                <input
                  type="text"
                  value={selectedPlan.payment_instructions || ''}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, payment_instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs font-mono flex items-center gap-2 transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}
