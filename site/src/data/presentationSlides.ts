import { SlideData } from '../types';

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    badge: 'SLIDE 01 // INTRODUÇÃO',
    title: 'cwe-discover',
    subtitle: 'Reconhecimento Passivo & Priorização Inteligente por CWE',
    bullets: [
      {
        title: 'Zero Payloads Agressivos',
        desc: 'Mapeamento seguro e 100% passivo: segue links, robots.txt, sitemaps e analisa headers sem disparar alertas de WAF ou derrubar serviços.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Priorização por Risk Score',
        desc: 'Ordena automaticamente os achados combinando severidade e índice de confiança (risk = severity × confidence).',
        icon: 'TrendingUp'
      },
      {
        title: 'Multiplataforma Nativo',
        desc: 'Otimizado para Termux (Android), Linux e macOS com consumo levíssimo de bateria e memória.',
        icon: 'Terminal'
      }
    ],
    codeBlock: {
      lang: 'bash',
      code: 'git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git\ncd CWE-Cover-2.0 && pip install -r requirements.txt\npython cwe_discover.py -u https://alvo.com --i-have-authorization',
      note: 'Instalação direta e execução em arquivo único no Termux/Linux'
    },
    keyTakeaway: 'Uma ferramenta pensada para caçadores de bug bounty que precisam de mapeamento rápido e seguro da superfície de ataque.'
  },
  {
    id: 2,
    badge: 'SLIDE 02 // FILOSOFIA & ARQUITETURA',
    title: 'Por Que Reconhecimento Passivo?',
    subtitle: 'Maximizando a inteligência antes de qualquer disparo ativo',
    bullets: [
      {
        title: 'Discrição Total',
        desc: 'Navega como um cliente legítimo, analisando respostas HTTP, comentários e formulários expostos.',
        icon: 'EyeOff'
      },
      {
        title: 'Sem Risco de Falso Positivo Destrutivo',
        desc: 'Identifica vetores arquiteturais (parâmetros de arquivo, falhas de headers, arquivos sensíveis) sem injeção de código.',
        icon: 'Layers'
      },
      {
        title: 'Compromisso Ético Embutido',
        desc: 'A flag obrigatória --i-have-authorization garante que os testes ocorram apenas em escopos autorizados.',
        icon: 'Lock'
      }
    ],
    codeBlock: {
      lang: 'text',
      code: `Crawler Passivo ────► Detectores de CWE (693, 200, 22, 352, 615)
                             │
                             ▼
                      Cálculo de Risk Score
                             │
                             ▼
                Fusão com Nuclei (Opcional)
                             │
                             ▼
        Relatórios: MD · HTML · JSON · CSV · HackerOne`,
      note: 'Pipeline desacoplado com suporte a novos detectores em Python'
    },
    keyTakeaway: 'O recon passivo poupa tempo e foca a atenção manual do pesquisador nos pontos de maior vulnerabilidade.'
  },
  {
    id: 3,
    badge: 'SLIDE 03 // MATRIZ DE CWES',
    title: 'Detecções Indicativas Padronizadas',
    subtitle: 'Mapeamento direto dos principais indícios de vulnerabilidade',
    bullets: [
      {
        title: 'CWE-693 (Médio)',
        desc: 'Ausência de cabeçalhos de segurança (CSP, X-Frame-Options, HSTS, Permissions-Policy).',
        icon: 'ShieldAlert'
      },
      {
        title: 'CWE-200 (Alto)',
        desc: 'Exposição de arquivos sensíveis (.env, repositórios .git, backups .sql, logs e configs).',
        icon: 'FileWarning'
      },
      {
        title: 'CWE-22 (Médio)',
        desc: 'Parâmetros suspeitos de Path Traversal / LFI (?file=, ?path=, ?template=).',
        icon: 'FolderSearch'
      },
      {
        title: 'CWE-352 (Médio)',
        desc: 'Formulários com ausência de tokens de proteção CSRF.',
        icon: 'FileCode'
      }
    ],
    codeBlock: {
      lang: 'python',
      code: `# Fórmula de Priorização
risk = severity_score * confidence

# Exemplo:
# Severidade Alta (8.0) com Confiança Forte (0.9)
# Risk Score = 7.2 (Prioridade no Relatório)`,
      note: 'Evita perder horas com avisos de baixa certeza'
    },
    keyTakeaway: 'Achados estruturados e mapeados conforme os padrões internacionais da MITRE CWE.'
  },
  {
    id: 4,
    badge: 'SLIDE 04 // ECOSSISTEMA & INTEGRAÇÕES',
    title: 'Poder de Integração no Termux',
    subtitle: 'Unindo Subfinder + Httpx + cwe-discover + Nuclei + ZAP',
    bullets: [
      {
        title: 'Descoberta em Massa',
        desc: 'Alimenta listas de subdomínios vivos diretamente nas rotinas de varredura passiva.',
        icon: 'Compass'
      },
      {
        title: 'Validação Ativa com Nuclei',
        desc: 'Fusão nativa via flag --nuclei-json, unindo recon passivo e validação de CVEs no mesmo relatório.',
        icon: 'Zap'
      },
      {
        title: 'Automação Bash (full_scan.sh)',
        desc: 'Um único script para descobrir, validar e gerar rascunho de submissão do HackerOne.',
        icon: 'Cpu'
      }
    ],
    codeBlock: {
      lang: 'bash',
      code: '# Execução Completa em 1 Linha:\n./full_scan.sh alvo-autorizado.com',
      note: 'Gera rascunho formatado pronto para copiar e colar no HackerOne'
    },
    keyTakeaway: 'O cwe-discover atua como o cérebro central de triagem dentro do seu arsenal de ferramentas.'
  },
  {
    id: 5,
    badge: 'SLIDE 05 // FORMATOS DE EXPORTAÇÃO',
    title: 'Relatórios Prontos para Ação',
    subtitle: '5 formatos projetados para desenvolvedores, clientes e plataformas de Bug Bounty',
    bullets: [
      {
        title: 'Formato HackerOne',
        desc: 'Rascunhos com Summary, Steps to Reproduce, Impact e Suggested Fix prontos para envio.',
        icon: 'Award'
      },
      {
        title: 'HTML Interativo',
        desc: 'Páginas modernas com tabelas de severidade, apêndices e badges de status para visualização no navegador.',
        icon: 'Globe'
      },
      {
        title: 'JSON & CSV Estruturados',
        desc: 'Ideal para pipelines de automação, ingestão em bancos de dados ou análise em planilhas.',
        icon: 'Database'
      }
    ],
    codeBlock: {
      lang: 'bash',
      code: '# Gerar Relatório Executivo HTML:\npython cwe_discover.py -u https://alvo.com --i-have-authorization --format html -o relatorio.html\n\n# Gerar Rascunho para Bug Bounty (HackerOne):\npython cwe_discover.py -u https://alvo.com --i-have-authorization --format hackerone -o draft.md',
      note: 'Suporta formatos: html, hackerone, markdown, json e csv'
    },
    keyTakeaway: 'Menos tempo formatando texto, mais tempo identificando falhas críticas.'
  },
  {
    id: 6,
    badge: 'SLIDE 06 // CONCLUSÃO & INÍCIO RÁPIDO',
    title: 'Comece a Usar Hoje',
    subtitle: 'Open-source, leve, extensível e focado na prática',
    bullets: [
      {
        title: 'Repositório Oficial',
        desc: 'git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git',
        icon: 'Github'
      },
      {
        title: 'Extensível em Python',
        desc: 'Crie seus próprios detectores de CWE em poucos minutos.',
        icon: 'Code2'
      },
      {
        title: 'Uso Ético Sempre',
        desc: 'Respeite as regras de disclosure e teste apenas alvos explicitamente no seu escopo.',
        icon: 'CheckCircle2'
      }
    ],
    codeBlock: {
      lang: 'bash',
      code: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format html -o relatorio.html\ntermux-open relatorio.html',
      note: 'Dica: Comece sempre com --max-depth 1 para entender a estrutura do alvo'
    },
    keyTakeaway: 'cwe-discover: Transformando dados brutos de rede em inteligência acionável de segurança.'
  }
];
