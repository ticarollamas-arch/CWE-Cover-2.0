import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Loader2, 
  X, 
  Cpu, 
  Download,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import CyberLogo from '../CyberLogo';
import { downloadLicenseHtmlFile } from '../../utils/licenseDownload';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (licenseData: any) => void;
  installationId?: string;
  onOpenPricing?: () => void;
  blockedRouteMessage?: string | null;
}

export default function LicenseActivationModal({
  isOpen,
  onClose,
  onSuccess,
  installationId = 'CHL-NODE-984F-71EA-B392-501D',
  onOpenPricing,
  blockedRouteMessage
}: LicenseActivationModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationResult, setActivationResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setError('Por favor, insira sua chave de ativação.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey.trim().toUpperCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao ativar a instalação.');
      }

      setActivationResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar a chave de ativação no host local.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    if (!activationResult) return;
    downloadLicenseHtmlFile({
      key: activationResult.license_key || licenseKey.trim().toUpperCase(),
      client_name: activationResult.client || 'Operador Licenciado',
      client_email: activationResult.client_email,
      plan: activationResult.plan || 'Cyber Hunter Lab',
      expires_at: activationResult.expires_at,
      installation_id: activationResult.installation_id || installationId,
      issued_at: new Date().toISOString()
    });
  };

  const handleContinueToWorkspace = () => {
    if (activationResult) {
      onSuccess(activationResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Decorator */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-3">
              <CyberLogo size="md" subtitle="Autonomous Security Platform" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {activationResult ? 'Instalação Ativada com Sucesso' : 'ATIVAÇÃO DO CYBER HUNTER LAB'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
              {activationResult 
                ? 'Sua instalação local está autenticada e pronta para operações autônomas.'
                : 'Acesse sua instalação informando exclusivamente a chave de ativação fornecida após a aquisição.'}
            </p>
          </div>

          {/* Installation ID Badge */}
          <div className="mb-6 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Nó de Instalação:</span>
            </div>
            <span className="text-cyan-300 font-semibold truncate max-w-[200px]" title={installationId}>
              {installationId}
            </span>
          </div>

          {/* Blocked direct route alert if applicable */}
          {blockedRouteMessage && !activationResult && (
            <div className="mb-5 p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>{blockedRouteMessage}</p>
            </div>
          )}

          {!activationResult ? (
            /* FORMULÁRIO SIMPLES E SEGURO DE ATIVAÇÃO POR CHAVE */
            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  CHAVE DE ATIVAÇÃO
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    placeholder="[ INSIRA SUA CHAVE DE ATIVAÇÃO ]"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition tracking-wider"
                    autoFocus
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 font-mono">
                  <span>Padrão: CHL-XXXX-XXXX-XXXX-XXXX</span>
                  {onOpenPricing && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPricing();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 underline font-sans"
                    >
                      Ainda não possui uma chave?
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Validando Chave no Host...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>[ ATIVAR ]</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TELA PÓS-ATIVAÇÃO COM ALERTA OBRIGATÓRIO E DOWNLOAD DE BACKUP HTML */
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Alerta de Segurança Obrigatório */}
              <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>GUARDE SUA CHAVE DE ATIVAÇÃO</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Essa chave é necessária para identificar e recuperar a instalação conforme as regras de licença do produto.
                </p>
              </div>

              {/* Detalhes da Licença Ativa */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Titular:</span>
                  <span className="text-slate-100 font-semibold">{activationResult.client || 'Cliente Oficial'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Plano Ativo:</span>
                  <span className="text-emerald-300 font-semibold">{activationResult.plan || 'Cyber Hunter Lab'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ativa no Nó Local</span>
                  </span>
                </div>
              </div>

              {/* Botão de Download HTML do Backup */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-3 px-4 bg-slate-850 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs font-mono"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>[ BAIXAR CHAVE ]</span>
              </button>

              {/* Botão de Entrada no Workspace */}
              <button
                type="button"
                onClick={handleContinueToWorkspace}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>ACESSAR WORKSPACE OPERACIONAL</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          )}

          {/* Rodapé de Conformidade */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2 font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-500/60" />
            <span>Execução local no Debian / Kali Linux • Zero credenciais remotas</span>
          </div>

        </div>
      </div>
    </div>
  );
}
