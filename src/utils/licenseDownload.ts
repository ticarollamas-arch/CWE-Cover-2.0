/**
 * Utilitário de geração e download seguro de backup HTML da Chave de Licença do Cyber Hunter Lab
 */

export interface LicenseDownloadData {
  key: string;
  client_name: string;
  client_email?: string;
  plan: string;
  price?: number;
  period_label?: string;
  expires_at?: string;
  installation_id?: string;
  issued_at?: string;
}

export function generateLicenseHtml(data: LicenseDownloadData): string {
  const issuedDate = data.issued_at ? new Date(data.issued_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
  const expiryDate = data.expires_at ? new Date(data.expires_at).toLocaleDateString('pt-BR') : '1 ano';
  const priceFormatted = data.price ? `R$ ${data.price.toFixed(2)}/${data.period_label || 'mês'}` : 'R$ 47,00/mês';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Hunter Lab — Chave de Ativação Oficial</title>
  <style>
    :root {
      --bg: #020617;
      --card: #0f172a;
      --border: #1e293b;
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.15);
      --cyan: #06b6d4;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 32px 16px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header-bar {
      height: 6px;
      background: linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6);
    }
    .content {
      padding: 32px 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      background: var(--emerald-glow);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--emerald);
      font-size: 11px;
      font-weight: 700;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 8px;
    }
    p.subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    .key-box {
      background: #020617;
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .key-label {
      font-size: 11px;
      font-family: monospace;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .key-value {
      font-size: 20px;
      font-weight: 800;
      font-family: monospace;
      color: var(--emerald);
      letter-spacing: 2px;
      word-break: break-all;
    }
    .alert-card {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .alert-title {
      font-size: 12px;
      font-weight: 800;
      color: #fbbf24;
      text-transform: uppercase;
      font-family: monospace;
      margin-bottom: 4px;
    }
    .alert-desc {
      font-size: 12px;
      color: #fde68a;
      line-height: 1.4;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    @media (max-width: 500px) {
      .details-grid { grid-template-columns: 1fr; }
    }
    .detail-item {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
    }
    .detail-label {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-family: monospace;
      margin-bottom: 2px;
    }
    .detail-val {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }
    .instructions {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .instructions h3 {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .instructions ol {
      padding-left: 18px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .instructions li {
      margin-bottom: 6px;
    }
    .footer {
      border-top: 1px solid var(--border);
      padding: 18px 24px;
      background: #020617;
      font-size: 11px;
      color: var(--text-muted);
      text-align: center;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-bar"></div>
    <div class="content">
      <div class="brand">
        <span class="badge">COMPROVANTE DE LICENCIAMENTO OFICIAL</span>
      </div>

      <h1>Cyber Hunter Lab</h1>
      <p class="subtitle">Plataforma Autônoma de Auditoria & Avaliação de Superfície de Segurança</p>

      <div class="key-box">
        <div class="key-label">Sua Chave de Ativação Criptográfica</div>
        <div class="key-value">${data.key}</div>
      </div>

      <div class="alert-card">
        <div class="alert-title">⚠️ GUARDE SUA CHAVE DE ATIVAÇÃO</div>
        <div class="alert-desc">
          Essa chave é necessária para identificar e recuperar a instalação conforme as regras de licença do produto.
          Armazene este arquivo em local seguro e nunca divulgue sua chave em locais públicos ou repositórios Git.
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Cliente / Titular</div>
          <div class="detail-val">${data.client_name}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">E-mail Cadastrado</div>
          <div class="detail-val">${data.client_email || 'Não informado'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Plano Contratado</div>
          <div class="detail-val">${data.plan} (${priceFormatted})</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Data de Emissão</div>
          <div class="detail-val">${issuedDate}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Validade / Expiração</div>
          <div class="detail-val">${expiryDate}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Nó de Instalação (Node ID)</div>
          <div class="detail-val" style="font-family: monospace; font-size: 11px;">${data.installation_id || 'Vinculado no primeiro setup'}</div>
        </div>
      </div>

      <div class="instructions">
        <h3>Como Ativar no seu Debian / Kali Linux:</h3>
        <ol>
          <li>Clone o repositório oficial e acesse o diretório do projeto.</li>
          <li>Inicie a interface web local (porta 3000).</li>
          <li>Abra a etapa de <strong>SETUP & INSTALAÇÃO</strong> ou clique em <strong>ATIVAR LICENÇA</strong>.</li>
          <li>Cole a chave acima: <code style="color: #10b981;">${data.key}</code></li>
          <li>Clique em <strong>[ ATIVAR ]</strong> para vincular a instalação ao seu hardware local e desbloquear os 17 motores autônomos.</li>
        </ol>
      </div>
    </div>

    <div class="footer">
      Cyber Hunter Lab • Carol Lamas • Autoral & 100% Nativo sem Binários Externos
    </div>
  </div>
</body>
</html>`;
}

export function downloadLicenseHtmlFile(data: LicenseDownloadData) {
  const htmlContent = generateLicenseHtml(data);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cyber_hunter_licenca_${data.key.replace(/[^A-Za-z0-9]/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
