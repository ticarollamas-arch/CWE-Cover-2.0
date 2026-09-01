import { CWEInfo } from '../types';

export const CWES_DATA: CWEInfo[] = [
  {
    cwe: 'CWE-693',
    name: 'Ausência de Headers de Segurança',
    defaultSeverity: 'Médio',
    scoreBase: 5,
    description: 'Falta de cabeçalhos HTTP essenciais como Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy.',
    detectionMechanism: 'Inspeção passiva dos cabeçalhos na resposta HTTP para cada endpoint rastreado.',
    targetFilesOrHeaders: ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'Strict-Transport-Security', 'Referrer-Policy', 'Permissions-Policy'],
    falsePositiveRisks: 'Quase nulo em nível de detecção de cabeçalho, mas nem toda aplicação precisa de restrições extremas (avaliar contexto).',
    howToMitigate: 'Configurar o servidor web (Nginx, Apache, Cloudflare) para emitir cabeçalhos de segurança padronizados em todas as respostas HTTP.',
    hackerOneImpact: 'Permite ataques de Clickjacking, MIME-sniffing e facilita exploração de XSS por ausência de restrição de origens.'
  },
  {
    cwe: 'CWE-200',
    name: 'Exposição de Arquivo Sensível',
    defaultSeverity: 'Alta',
    scoreBase: 8,
    description: 'Arquivos críticos expostos publicamente na raiz ou caminhos previsíveis, tais como repositórios .git, arquivos .env, backups (.sql, .bak) ou logs.',
    detectionMechanism: 'Checagem de requisição GET para lista de paths sensíveis conhecidos (definidos em config/sensitive_paths.txt).',
    targetFilesOrHeaders: ['/.env', '/.git/config', '/.git/HEAD', '/backup.sql', '/app.log', '/admin/config.php', '/.aws/credentials'],
    falsePositiveRisks: 'Soft-404 (páginas de erro personalizadas que retornam status 200 OK com texto de erro genérico). Verifique sempre com curl -I.',
    howToMitigate: 'Bloquear acesso a arquivos ocultos (.dotfiles) e extensões de backup nas configurações do servidor web e remover arquivos sensíveis da raiz.',
    hackerOneImpact: 'Vazamento de credenciais de banco de dados, chaves de API, código-fonte proprietário ou segredos de infraestrutura.'
  },
  {
    cwe: 'CWE-22',
    name: 'Indício de Path Traversal / LFI',
    defaultSeverity: 'Médio',
    scoreBase: 5,
    description: 'Parâmetros de URL ou formulário que sugerem inclusão de arquivos ou caminhos locais (ex.: ?file=, ?page=, ?path=, ?doc=, ?folder=).',
    detectionMechanism: 'Análise léxica de parâmetros em URLs coletadas pelo crawler passivo.',
    targetFilesOrHeaders: ['?file=', '?path=', '?doc=', '?page=', '?template=', '?dir=', '?include='],
    falsePositiveRisks: 'O nome do parâmetro é apenas um indício arquitetural, NÃO é prova conclusiva de vulnerabilidade. Requer validação manual em lab.',
    howToMitigate: 'Utilizar listas de permissão (whitelists) estritas e abstrações de ID em vez de passar caminhos de arquivo diretamente na query string.',
    hackerOneImpact: 'Possibilidade de leitura de arquivos confidenciais do sistema operacional (/etc/passwd, configurações de backend) ou inclusão remota de código.'
  },
  {
    cwe: 'CWE-352',
    name: 'Ausência de Proteção CSRF',
    defaultSeverity: 'Médio',
    scoreBase: 5,
    description: 'Formulários HTML com métodos POST/PUT que não incluem campos de token anti-CSRF (_csrf, csrf_token, authenticity_token).',
    detectionMechanism: 'Parsing de elementos <form> no DOM das páginas HTML coletadas.',
    targetFilesOrHeaders: ['<form method="POST"> sem campos anti-csrf'],
    falsePositiveRisks: 'A aplicação pode utilizar headers customizados (ex: X-CSRF-Token via JavaScript), cookies SameSite=Strict ou validação de Origin/Referer.',
    howToMitigate: 'Implementar tokens CSRF criptograficamente seguros vinculados à sessão do usuário e configurar SameSite=Lax/Strict nos cookies de autenticação.',
    hackerOneImpact: 'Execução de ações involuntárias em nome do usuário autenticado (mudança de senha, transferências, alteração de e-mail).'
  },
  {
    cwe: 'CWE-615',
    name: 'Comentários com Informação Interna',
    defaultSeverity: 'Baixo',
    scoreBase: 3,
    description: 'Comentários HTML, JavaScript ou cabeçalhos de resposta que revelam caminhos internos do servidor, notas de desenvolvedores, versões ou dados de debug.',
    detectionMechanism: 'Extração de blocos <!-- ... --> e anotações inline no código-fonte retornado.',
    targetFilesOrHeaders: ['<!-- TODO: ... -->', '<!-- v1.4.2-staging -->', '<!-- /var/www/internal -->'],
    falsePositiveRisks: 'Geralmente informação de baixo impacto, requer verificar se as versões expostas possuem CVEs críticas associadas.',
    howToMitigate: 'Utilizar minificadores e processos de build de produção (strip comments) antes de realizar o deploy em ambiente público.',
    hackerOneImpact: 'Auxilia atacantes na enumeração precisa de tecnologias, frameworks e identificação de rotas administrativas não documentadas.'
  }
];

export const RISK_LEVELS = [
  { range: '0.0 - 2.0', label: 'Informativo / Especulação', color: 'text-slate-400', bg: 'bg-slate-800/60', border: 'border-slate-700' },
  { range: '2.1 - 4.0', label: 'Baixo Risco', color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-800/50' },
  { range: '4.1 - 6.5', label: 'Risco Médio', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50' },
  { range: '6.6 - 8.5', label: 'Risco Alto', color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/50' },
  { range: '8.6 - 10.0', label: 'Risco Crítico', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
];
