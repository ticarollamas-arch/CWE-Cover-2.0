import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Plus, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  UserCheck, 
  Clock, 
  X,
  Search,
  Fingerprint,
  Calendar,
  Layers,
  Sparkles,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { LicenseItem } from '../../types/product';

export default function AdminLicensesTab() {
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [plan, setPlan] = useState<'Standard' | 'Professional' | 'Enterprise'>('Enterprise');
  const [daysValid, setDaysValid] = useState(365);
  const [maxTargets, setMaxTargets] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/licenses');
      const data = await res.json();
      if (data.licenses) {
        setLicenses(data.licenses);
      }
    } catch (err) {
      console.error('Erro ao buscar licenças:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleGenerateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/licenses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          plan,
          days_valid: daysValid,
          max_targets: maxTargets,
          features: ['all_17_engines', '18_agents', 'evidence_ledger', 'custom_reporting', 'ollama_ai', 'unlimited_campaigns']
        })
      });
      const data = await res.json();
      if (data.license) {
        setLicenses([data.license, ...licenses]);
        setIsModalOpen(false);
        setClientName('');
        setClientEmail('');
      }
    } catch (err) {
      console.error('Erro ao gerar licença:', err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Active' | 'Suspended' | 'Revoked') => {
    try {
      const res = await fetch(`/api/admin/licenses/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.license) {
        setLicenses(licenses.map(l => l.id === id ? data.license : l));
      }
    } catch (err) {
      console.error('Erro ao atualizar licença:', err);
    }
  };

  const handleRenew = async (id: string, days: number = 365) => {
    try {
      const res = await fetch(`/api/admin/licenses/${id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      const data = await res.json();
      if (data.license) {
        setLicenses(licenses.map(l => l.id === id ? data.license : l));
      }
    } catch (err) {
      console.error('Erro ao renovar licença:', err);
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredLicenses = licenses.filter(l => 
    l.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.client_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-rose-400" />
            <span>Gerenciamento Administrativo de Licenças</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Geração de chaves criptográficas com vínculo único de instalação, suspensão e renovação instantânea.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchLicenses}
            className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition"
            title="Recarregar Licenças"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>GERAR NOVA LICENÇA</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por nome do cliente, email ou chave CHL-XXXX..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition font-mono"
        />
      </div>

      {/* Licenses Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Chave / ID</th>
                <th className="py-3 px-4">Cliente / Email</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Instalação Vinculada</th>
                <th className="py-3 px-4">Expiração</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLicenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-850/50 transition">
                  
                  {/* Chave */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">{lic.key}</span>
                      <button
                        onClick={() => handleCopy(lic.key)}
                        className="p-1 text-slate-500 hover:text-slate-200 rounded transition"
                        title="Copiar Chave"
                      >
                        {copiedKey === lic.key ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{lic.id}</span>
                  </td>

                  {/* Cliente */}
                  <td className="py-3.5 px-4">
                    <span className="font-sans font-semibold text-slate-200 block">{lic.client_name}</span>
                    <span className="text-[10px] text-slate-400">{lic.client_email}</span>
                  </td>

                  {/* Plano */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                      {lic.plan}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      lic.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      lic.status === 'Suspended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {lic.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      <span>{lic.status}</span>
                    </span>
                  </td>

                  {/* Instalação */}
                  <td className="py-3.5 px-4">
                    {lic.installation_id ? (
                      <span className="text-cyan-400 text-[11px] font-bold">{lic.installation_id}</span>
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">Aguardando ativação</span>
                    )}
                  </td>

                  {/* Expiração */}
                  <td className="py-3.5 px-4 text-slate-400">
                    <span>{new Date(lic.expires_at).toLocaleDateString('pt-BR')}</span>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-sans">
                      {lic.status === 'Active' ? (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Suspended')}
                          className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] transition"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Active')}
                          className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] transition"
                        >
                          Ativar
                        </button>
                      )}

                      <button
                        onClick={() => handleRenew(lic.id, 365)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition"
                        title="Renovar por mais 1 ano"
                      >
                        +1 Ano
                      </button>

                      {lic.status !== 'Revoked' && (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Revoked')}
                          className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] transition"
                        >
                          Revogar
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Gerar Licença */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-amber-500" />
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-rose-400" />
                  <span>Emissão de Chave Criptográfica</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleGenerateLicense} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nome do Cliente / Organização</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Security Operations Group"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email do Responsável</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="secops@cliente.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Plano</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                    >
                      <option value="Standard">Standard (10 alvos)</option>
                      <option value="Professional">Professional (100 alvos)</option>
                      <option value="Enterprise">Enterprise (500 alvos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Validade (Dias)</label>
                    <input
                      type="number"
                      value={daysValid}
                      onChange={(e) => setDaysValid(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20"
                  >
                    Gerar e Assinar Licença
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
