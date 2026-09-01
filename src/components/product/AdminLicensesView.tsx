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
  Fingerprint
} from 'lucide-react';
import { LicenseItem } from '../../types/product';

export default function AdminLicensesView() {
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [plan, setPlan] = useState<'Standard' | 'Professional' | 'Enterprise'>('Professional');
  const [daysValid, setDaysValid] = useState(365);
  const [maxTargets, setMaxTargets] = useState(10);
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
          features: ['ALL_ENGINES', 'ALL_AGENTS', 'REPORT_EXPORT', 'UNLIMITED_CAMPAIGNS']
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
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span>Gerenciamento Administrativo de Licenças</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Geração de chaves criptográficas com vínculo único de instalação e revogação instantânea.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>GERAR NOVA LICENÇA</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, e-mail ou chave de licença..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Cliente / Organização</th>
                <th className="py-3.5 px-4">Chave Criptográfica</th>
                <th className="py-3.5 px-4">Plano</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Installation ID</th>
                <th className="py-3.5 px-4">Expira em</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLicenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-sans">
                    <span className="font-bold text-slate-200 block">{lic.client_name}</span>
                    <span className="text-slate-500 text-[11px] font-mono">{lic.client_email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">{lic.key}</span>
                      <button
                        onClick={() => handleCopy(lic.key)}
                        className="p-1 text-slate-500 hover:text-slate-200 transition rounded"
                        title="Copiar Chave"
                      >
                        {copiedKey === lic.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 font-semibold">{lic.plan}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lic.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      lic.status === 'Suspended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {lic.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-cyan-300 truncate max-w-[150px]" title={lic.installation_id || 'Não vinculado'}>
                    {lic.installation_id || 'Pendente'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(lic.expires_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-sans">
                      {lic.status !== 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Active')}
                          className="px-2 py-1 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 rounded text-[11px] border border-emerald-800 transition"
                        >
                          Ativar
                        </button>
                      )}
                      {lic.status === 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Suspended')}
                          className="px-2 py-1 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60 rounded text-[11px] border border-amber-800 transition"
                        >
                          Suspender
                        </button>
                      )}
                      {lic.status !== 'Revoked' && (
                        <button
                          onClick={() => handleUpdateStatus(lic.id, 'Revoked')}
                          className="px-2 py-1 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 rounded text-[11px] border border-rose-800 transition"
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

      {/* Modal: Gerar Nova Licença */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Gerar Nova Licença Criptográfica</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateLicense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Nome do Cliente / Empresa</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: SecOps Enterprise S/A"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">E-mail do Responsável Técnico</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="secops@cliente.com.br"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 font-sans">Plano</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 font-sans">Validade (Dias)</label>
                  <input
                    type="number"
                    value={daysValid}
                    onChange={(e) => setDaysValid(Number(e.target.value))}
                    min={30}
                    max={1825}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>EMITIR CHAVE</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
