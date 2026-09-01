import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Loader2, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import CyberLogo from '../CyberLogo';
import { PlanItem, PaymentItem } from '../../types/product';
import { downloadLicenseHtmlFile } from '../../utils/licenseDownload';

interface PixCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivatedSuccessfully: (licenseData: any) => void;
  initialPlanId?: string;
}

export default function PixCheckoutModal({
  isOpen,
  onClose,
  onActivatedSuccessfully,
  initialPlanId
}: PixCheckoutModalProps) {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [step, setStep] = useState<'FORM' | 'PIX_PAY' | 'SUCCESS'>('FORM');
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [generatedLicense, setGeneratedLicense] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca planos dinâmicos do backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
          const current = data.plans.find((p: PlanItem) => p.id === initialPlanId) || data.plans[0];
          setSelectedPlan(current);
        }
      } catch {
        // Fallback default
        const fallback: PlanItem = {
          id: 'plan-chl-monthly',
          name: 'Cyber Hunter Lab',
          price: 47.00,
          currency: 'BRL',
          period: 'monthly',
          period_label: 'mês',
          status: 'ACTIVE',
          description: 'Acesso autônomo completo aos 17 motores próprios e 18 agentes em Debian / Kali Linux.',
          features: [
            '17 Motores Nativos Integrados',
            '18 Agentes Autônomos em Grafo DAG',
            'Auditoria Web, Rede, DNS e AppSec',
            'Triangulação e Eliminação de Falsos Positivos',
            'Zero dependências externas de scanners'
          ]
        };
        setPlans([fallback]);
        setSelectedPlan(fallback);
      }
    };

    fetchPlans();
    setStep('FORM');
    setError(null);
    setPayment(null);
    setGeneratedLicense(null);
  }, [isOpen, initialPlanId]);

  if (!isOpen) return null;

  // 1. Gera cobrança Pix no Backend
  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Por favor, informe seu nome ou razão social.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setError('Por favor, informe um e-mail válido para vincular sua licença.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: selectedPlan?.id || 'plan-chl-monthly',
          client_name: clientName.trim(),
          client_email: clientEmail.trim().toLowerCase()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar cobrança Pix.');
      }

      setPayment(data.payment);
      setStep('PIX_PAY');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar requisição de pagamento Pix.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Confirmação do Pagamento Pix pelo Backend
  const handleConfirmPixPayment = async () => {
    if (!payment) return;
    setIsConfirming(true);
    setError(null);

    try {
      const res = await fetch(`/api/payments/${payment.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível confirmar o pagamento Pix.');
      }

      setGeneratedLicense(data.license);
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Erro na validação do pagamento Pix.');
    } finally {
      setIsConfirming(false);
    }
  };

  // 3. Download do Backup HTML da Licença
  const handleDownloadBackup = () => {
    if (!generatedLicense) return;
    downloadLicenseHtmlFile({
      key: generatedLicense.key,
      client_name: generatedLicense.client_name || clientName,
      client_email: generatedLicense.client_email || clientEmail,
      plan: generatedLicense.plan || selectedPlan?.name || 'Cyber Hunter Lab',
      price: selectedPlan?.price || 47,
      period_label: selectedPlan?.period_label || 'mês',
      expires_at: generatedLicense.expires_at,
      issued_at: generatedLicense.created_at
    });
  };

  // 4. Ativação Direta no Host e Acesso ao Workspace
  const handleActivateAndOpenWorkspace = async () => {
    if (!generatedLicense) return;
    setIsActivating(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: generatedLicense.key })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao ativar no nó local.');
      }

      onActivatedSuccessfully(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao vincular licença ao hardware local.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCopyPix = () => {
    if (payment?.pix_code) {
      navigator.clipboard.writeText(payment.pix_code);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  const currentPrice = selectedPlan?.price !== undefined ? selectedPlan.price : 47;
  const currentPeriod = selectedPlan?.period_label || 'mês';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-2">
              <CyberLogo size="sm" subtitle="Checkout Oficial Pix" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {step === 'FORM' && 'Assinatura Cyber Hunter Lab'}
              {step === 'PIX_PAY' && 'Pagamento via Pix Instantâneo'}
              {step === 'SUCCESS' && 'Pagamento Confirmado & Chave Emitida'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {step === 'FORM' && 'Acesso aos 17 motores próprios e 18 agentes autônomos sem necessidade de cartão.'}
              {step === 'PIX_PAY' && 'Escaneie o QR Code ou copie a chave Pix para liberação imediata da sua chave.'}
              {step === 'SUCCESS' && 'Sua chave de ativação oficial foi gerada e registrada com sucesso.'}
            </p>
          </div>

          {/* STEP 1: FORMULÁRIO DO CLIENTE & SELEÇÃO DE PLANO */}
          {step === 'FORM' && (
            <form onSubmit={handleGeneratePix} className="space-y-4">
              
              {/* Plan Card Summary */}
              <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{selectedPlan?.name || 'Cyber Hunter Lab'}</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    17 Motores Nativos • 18 Agentes • Debian/Kali
                  </span>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xl font-extrabold text-slate-100">
                    R$ {currentPrice.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-emerald-400">/{currentPeriod} (Pix)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Nome Completo ou Empresa
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex.: Rodrigo Santos ou SecOps Lab"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  E-mail para Recebimento da Chave
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com.br"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  A chave de ativação criptográfica é vinculada a este endereço.
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {error}
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
                    <span>Gerando Cobrança Pix...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>PAGAR COM PIX (R$ {currentPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: TELA DO PIX (QR CODE + COPIA E COLA) */}
          {step === 'PIX_PAY' && payment && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Box do QR Code */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  {/* QR Code SVG Visual Representation */}
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0h35v35H0zM5 5v25h25V5zm5 5h15v15H10zM65 0h35v35H65zM70 5v25h25V5zm5 5h15v15H75zM0 65h35v35H0zM5 70v25h25V70zm5 5h15v15H10zM45 10h10v10H45zM45 35h10v15H45zM65 45h15v10H65zM50 65h15v15H50zM80 65h15v15H80zM65 85h20v15H65zM40 85h15v15H40zM40 50h10v15H40z" />
                  </svg>
                </div>
                
                <div className="space-y-0.5 font-mono">
                  <div className="text-xs text-slate-400">Valor a transferir via Pix:</div>
                  <div className="text-xl font-extrabold text-emerald-400">
                    R$ {payment.amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">Identificador: {payment.id}</div>
                </div>
              </div>

              {/* Pix Copia e Cola */}
              <div className="space-y-1.5 font-mono">
                <label className="text-[11px] text-slate-400 block uppercase font-semibold">
                  Código Pix Copia e Cola:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={payment.pix_code}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 font-mono select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Botão de Confirmação pelo Gateway Backend */}
              <button
                type="button"
                onClick={handleConfirmPixPayment}
                disabled={isConfirming}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verificando no Gateway Pix...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>CONFIRMAR PAGAMENTO PIX</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: SUCESSO - EXIBIÇÃO DA CHAVE & DOWNLOAD HTML OBRIGATÓRIO */}
          {step === 'SUCCESS' && generatedLicense && (
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

              {/* Chave de Ativação Emitida */}
              <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl text-center space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase block">
                  Sua Chave de Ativação Oficial
                </span>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 tracking-wider break-all select-all">
                  {generatedLicense.key}
                </div>
              </div>

              {/* Botão [ BAIXAR CHAVE ] */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-3 px-4 bg-slate-850 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs font-mono"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>[ BAIXAR CHAVE ]</span>
              </button>

              {/* Botão [ ATIVAR AGORA NO WORKSPACE ] */}
              <button
                type="button"
                onClick={handleActivateAndOpenWorkspace}
                disabled={isActivating}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Ativando no Nó Local...</span>
                  </>
                ) : (
                  <>
                    <span>ATIVAR NO WORKSPACE AGORA</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
