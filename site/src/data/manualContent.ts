import { Chapter } from '../types';

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    slug: 'o-que-e-cwe-discover',
    title: '1. O que é o cwe-discover',
    category: 'fundamentos',
    summary: 'Suite de reconhecimento passivo e mapeamento de superfície de ataque para Bug Bounty e laboratórios de segurança.',
    content: [
      'cwe-discover é uma suite de reconhecimento passivo desenvolvida especificamente para pesquisadores de segurança que participam de programas de bug bounty ou gerenciam laboratórios próprios.',
      'A ferramenta atua em quatro frentes principais:',
      '• Reconhecimento Passivo: segue links, formulários, robots.txt, sitemap.xml e referências de API já expostas pelo alvo, sem realizar brute force agressivo por padrão.',
      '• Detecção Indicativa: analisa cabeçalhos de resposta, parâmetros suspeitos e arquivos públicos conhecidos, sinalizando indícios de vulnerabilidade sem enviar nenhum payload de ataque.',
      '• Priorização por Risk Score: cada achado recebe uma severidade associada a um índice de confiança calibrado, combinados para ordenar o relatório pelas falhas mais críticas.',
      '• Relatórios Multiformato: gera relatórios em Markdown, HTML visual, JSON, CSV ou no formato oficial de rascunho para HackerOne/Bugcrowd (Summary, Steps, Impact, Fix).',
      '🧠 Filosofia Central: a ferramenta NÃO valida vulnerabilidades ativamente (não envia injeções SQL, XSS, Path Traversal, SSRF, etc.). Isso é uma decisão arquitetural de design: segurança, discrição e zero risco de derrubar serviços de produção. Para validação ativa, utilize a integração nativa com Nuclei ou OWASP ZAP.'
    ],
    tips: [
      'Público-alvo: Caçadores de recompensas (bug bounty), Pentesters que precisam de triagem preliminar e Estudantes de segurança ofensiva e defensiva.'
    ]
  },
  {
    id: 2,
    slug: 'instalacao-termux-linux',
    title: '2. Instalação no Termux & Linux/macOS',
    category: 'fundamentos',
    summary: 'Instalação passo a passo no ambiente Android (Termux) e em distribuições Linux e macOS.',
    content: [
      'O cwe-discover é 100% compatível e otimizado para o Termux no Android, permitindo reconhecimento diretamente pelo smartphone com consumo ultra baixo de bateria e memória.',
      'Pré-requisitos: Termux atualizado, Python 3.8+, pip e git.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Passo a passo no Termux',
        code: `# 1. Atualizar os pacotes do Termux
pkg update && pkg upgrade -y

# 2. Instalar git, python e pip
pkg install git python python-pip -y

# 3. Clonar o repositório
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git

# 4. Entrar na pasta do projeto
cd CWE-Cover-2.0

# 5. Instalar as dependências Python
pip install -r requirements.txt

# Verificação:
python cwe_discover.py -h`
      },
      {
        language: 'bash',
        caption: 'Instalação no Linux (Ubuntu/Debian) e macOS',
        code: `# Ubuntu / Debian
sudo apt update && sudo apt install python3 python3-pip git -y

# macOS (Homebrew)
brew install python git

# Clonar e rodar
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0
pip3 install -r requirements.txt`
      }
    ],
    tips: [
      'Se o comando python cwe_discover.py -h exibir a lista completa de flags e opções, o ambiente está pronto para uso.'
    ]
  },
  {
    id: 3,
    slug: 'regra-de-ouro',
    title: '3. Regra de Ouro (--i-have-authorization)',
    category: 'etica',
    summary: 'A flag obrigatória de autorização e o compromisso ético do pesquisador.',
    content: [
      '⚠️ A flag --i-have-authorization é OBRIGATÓRIA em todas as execuções. Sem ela, a ferramenta se recusa imediatamente a iniciar qualquer requisição.',
      'Essa flag não realiza uma checagem criptográfica externa — ela serve como um lembrete e compromisso ético formal de que você possui permissão explícita para auditar o alvo (escopo ativo de bug bounty ou lab próprio).'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Execução Correta vs Incorreta',
        code: `# ❌ ERRADO — o scanner falha imediatamente e bloqueia a execução
python cwe_discover.py -u https://alvo-qualquer.com

# ✅ CORRETO — confirmação consciente de autorização no escopo
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization`
      }
    ],
    warnings: [
      'A ferramenta não substitui a responsabilidade legal do usuário. Nunca execute ferramentas de reconhecimento contra alvos fora de escopo.'
    ]
  },
  {
    id: 4,
    slug: 'primeiro-scan',
    title: '4. Primeiro Scan & Interpretação da Saída',
    category: 'pratica',
    summary: 'Comandos fundamentais para inicializar varreduras e entender o formato padrão de saída.',
    content: [
      'Para realizar sua primeira varredura passiva, utilize o comando base apontando para o alvo autorizado com protocolo explícito (https:// ou http://).',
      'Estrutura da saída padrão do relatório:',
      '• Cabeçalho: URL alvo, data/hora da execução e parâmetros do crawler.',
      '• Resumo Geral: Total de páginas/URLs rastreadas e contadores por nível de severidade.',
      '• Lista de Achados: Ordenada rigorosamente por Risk Score decrescente (do mais crítico para o mais leve).',
      '• Cada achado contém: Título, descrição, CWE associada, severidade, confiança, risk score numérico, URLs/parâmetros afetados e orientações de correção.',
      '• Apêndice: Tabela detalhada de headers inspecionados e inventário de arquivos sensíveis testados.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Comandos de Execução Básica',
        code: `# Exibir diretamente no terminal (Markdown)
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization

# Salvar a saída em arquivo Markdown
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization -o relatorio.md

# Visualizar todas as opções
python cwe_discover.py -h`
      }
    ]
  },
  {
    id: 5,
    slug: 'referencia-de-flags',
    title: '5. Referência Completa de Flags',
    category: 'fundamentos',
    summary: 'Tabela de todas as opções de linha de comando com valores padrão e descrições detalhadas.',
    content: [
      'O cwe-discover possui flags flexíveis para controle minucioso do crawler, limites de taxa (rate limiting), formatos de exportação e fusão com scanners ativos.'
    ],
    table: {
      headers: ['Flag', 'Tipo / Opções', 'Padrão', 'Descrição'],
      rows: [
        ['-u, --url', 'string (URL)', 'Obrigatório', 'URL base do alvo autorizado'],
        ['--i-have-authorization', 'flag booleana', 'Obrigatório', 'Confirmação de autorização legal e ética para o alvo'],
        ['--format', 'markdown, md, hackerone, json, csv, html', 'markdown', 'Formato de exportação do relatório principal'],
        ['--json', 'atalho booleano', 'desativado', 'Atalho para --format json'],
        ['-o, --output', 'caminho de arquivo', 'cwe_report.md', 'Arquivo de saída do relatório'],
        ['--max-depth', 'inteiro', '2', 'Profundidade de navegação do crawler'],
        ['--max-urls', 'inteiro', '60', 'Limite de páginas a verificar'],
        ['--delay', 'float (segundos)', '0.2', 'Delay entre requisições em segundos (Anti-WAF)'],
        ['--timeout', 'float (segundos)', '7.0', 'Timeout por requisição em segundos'],
        ['--threads', 'inteiro', '1', 'Reservado para paralelismo futuro — não usado pelo crawler sequencial atual'],
        ['--nuclei-json', 'caminho de arquivo .jsonl', 'nenhum', 'Arquivo .jsonl gerado pelo Nuclei, para mesclar no relatório final'],
        ['--platform', 'hackerone, bugcrowd, intigriti, yeswehack, generic', 'hackerone', 'Rótulo/plataforma usada no cabeçalho do relatório --format hackerone'],
        ['--ai-narrative', 'flag booleana', 'desativado', 'Reescreve via IA (Ollama) apenas o texto de apoio da PoC — nunca os comandos'],
        ['--ai-config', 'caminho de arquivo', 'ai_config.json', 'Arquivo de configuração da camada de IA opcional'],
        ['--ollama-endpoint', 'string (URL)', 'do ai_config.json', 'Sobrescreve pontualmente o endpoint do Ollama'],
        ['--ollama-model', 'string', 'do ai_config.json', 'Sobrescreve pontualmente o modelo do Ollama'],
        ['--gdrive-folder-id', 'string', 'nenhum', 'ID da pasta no Google Drive para onde o relatório é enviado automaticamente'],
        ['--gdrive-credentials', 'caminho de arquivo', 'credentials.json', 'Arquivo de credenciais do Google Drive (Service Account ou OAuth)'],
        ['--gdrive-auth-mode', 'service_account, oauth', 'service_account', 'Modo de autenticação usado no upload ao Google Drive'],
        ['-v, --verbose', 'flag booleana', 'desativado', 'Exibe logs detalhados durante o rastreamento'],
        ['--agents', 'flag booleana', 'desativado', 'Ativa o pipeline multiagente opcional (capítulo 31) — aditivo, não altera o relatório legado'],
        ['--scope-file', 'caminho de arquivo JSON', 'nenhum (SCOPE_UNKNOWN)', 'Arquivo de escopo/autorização consumido pelo pipeline multiagente'],
        ['--mode', 'passive, safe, authorized_active, lab', 'passive', 'Modo de operação do pipeline multiagente'],
        ['--agents-output', 'caminho de arquivo', '<output>_agents.md', 'Caminho do relatório gerado pelo pipeline multiagente'],
        ['-h, --help', 'flag booleana', '—', 'Exibe a mensagem de ajuda com todas as opções']
      ]
    },
    tips: [
      'A lista acima reflete exatamente o parser em cwe_discover.py (função main()). Rode python cwe_discover.py --help a qualquer momento para conferir a versão instalada no seu ambiente.'
    ]
  },
  {
    id: 6,
    slug: 'formatos-de-relatorio',
    title: '6. Formatos de Relatório (MD, HTML, JSON, CSV, HackerOne)',
    category: 'pratica',
    summary: 'Como gerar e escolher entre os 5 formatos de relatório com tabela comparativa.',
    content: [
      'A flexibilidade de relatórios permite integrar o cwe-discover tanto ao fluxo diário de submissão de bug bounty quanto a pipelines automáticos de CI/CD e análise em planilhas.',
      'O formato "hackerone" é, na prática, um exportador genérico de rascunho de bug bounty: o rótulo da plataforma que aparece no cabeçalho do relatório (HackerOne, Bugcrowd, Intigriti, YesWeHack ou um rótulo genérico) é controlado separadamente pela flag --platform, e não por uma opção própria em --format.'
    ],
    table: {
      headers: ['Formato (--format)', 'Leitura Humana', 'Edição Rápida', 'Integração Automática', 'Melhor Caso de Uso'],
      rows: [
        ['markdown / md', '✅ Excelente', '✅ Fácil (texto)', '❌ Baixa', 'Leitura rápida no terminal ou notas no Obsidian/VSCode'],
        ['html', '✅ Visual rico', '❌ Difícil', '❌ Baixa', 'Apresentação formal para clientes ou equipes de gestão'],
        ['json', '❌ Ruim (bruto)', '❌ Complexo', '✅ Perfeita (APIs)', 'Pipelines com jq, Python, ElasticSearch ou bancos NoSQL'],
        ['csv', '❌ Tabela plana', '✅ Simples (Excel)', '✅ Planilhas / BI', 'Triagem em massa e dashboards executivos'],
        ['hackerone', '✅ Formatado', '✅ Copiar/Colar', '✅ Rascunho', 'Submissão direta no formulário do HackerOne (default de --platform)']
      ]
    },
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Exemplos de geração em cada formato',
        code: `# Markdown (aceita "markdown" ou o atalho "md")
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format md -o relatorio.md

# HTML (visual)
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format html -o relatorio.html

# JSON
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format json -o relatorio.json

# CSV
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format csv -o relatorio.csv

# Rascunho de bug bounty para HackerOne (default de --platform)
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format hackerone -o rascunho_hackerone.md

# O mesmo rascunho, mas rotulado para Bugcrowd em vez de HackerOne
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format hackerone --platform bugcrowd -o rascunho_bugcrowd.md`
      }
    ]
  },
  {
    id: 7,
    slug: 'ajustando-o-crawler',
    title: '7. Ajustando o Crawler (Profundidade, Limites e Velocidade)',
    category: 'pratica',
    summary: 'Calibração dos parâmetros de profundidade, limites de URL e temporização para cada tipo de alvo.',
    content: [
      '7.1 Crawling Raso (Rápido, superfície pequena): --max-depth 1 --max-urls 20',
      '7.2 Crawling Padrão (Recomendado): --max-depth 3 --max-urls 500',
      '7.3 Crawling Profundo (Maior cobertura): --max-depth 5 --max-urls 1000',
      '7.4 Crawling Ultra Profundo com Delay: --max-depth 6 --max-urls 2000 --delay 1',
      '7.5 Scan Rápido e Agressivo (Apenas em laboratório local): --delay 0 --max-urls 50',
      '7.6 Scan Lento e Discreto (Alvos com WAF e rate limiting): --delay 2 --timeout 30',
      '7.7 Limitar Teto de URLs em sites gigantes: --max-urls 100'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Exemplo de calibração fina',
        code: `python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization \\
  --max-depth 4 \\
  --max-urls 300 \\
  --delay 0.5 \\
  --timeout 15`
      }
    ]
  },
  {
    id: 8,
    slug: 'integracao-com-nuclei',
    title: '8. Integração com Nuclei (Validação Ativa)',
    category: 'integracoes',
    summary: 'Instalação completa do Go e Nuclei no Termux e fusão com o relatório do cwe-discover.',
    content: [
      'O cwe-discover faz apenas recon passivo. Para validar vulnerabilidades ativamente (CVEs conhecidas, exposições de painéis, misconfigurations), integre com o Nuclei.',
      '8.1 Instalação detalhada do Nuclei no Termux:',
      'O Nuclei é compilado em Go, permitindo rodar nativamente no Android através do Termux.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Instalação do Nuclei no Termux',
        code: `# 1. Instalar o Go (Golang) no Termux
pkg install golang -y

# 2. Instalar o Nuclei mais recente
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 3. Adicionar o diretório bin ao PATH
export PATH=$PATH:~/go/bin
echo 'export PATH=$PATH:~/go/bin' >> ~/.bashrc
source ~/.bashrc

# 4. Atualizar os templates oficiais
nuclei -update-templates`
      },
      {
        language: 'bash',
        caption: 'Executando Nuclei e Mesclando Resultados',
        code: `# Rodar Nuclei sozinho e salvar em JSONL
nuclei -u https://alvo-autorizado.com -severity critical,high,medium -jsonl -o nuclei.jsonl

# Mesclar no relatório visual do cwe-discover
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization \\
  --nuclei-json nuclei.jsonl \\
  --format html -o relatorio_completo.html`
      }
    ],
    warnings: [
      'Achados originados do Nuclei entram no cwe-discover com confiança = SUSPEITA por padrão. Exigem sempre confirmação manual antes de qualquer reporte.'
    ]
  },
  {
    id: 9,
    slug: 'recon-de-subdominios',
    title: '9. Recon de Subdomínios (Subfinder + Httpx + cwe-discover)',
    category: 'integracoes',
    summary: 'Pipeline escalável para descobrir subdomínios, filtrar ativos e rodar varreduras em lote.',
    content: [
      'Para ampliar o escopo de um domínio *.exemplo.com, combine fontes passivas de subdomínios e filtre serviços HTTP ativos antes de invocar o cwe-discover.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Pipeline de Subdomínios',
        code: `# 1. Instalar subfinder e httpx
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install github.com/projectdiscovery/httpx/cmd/httpx@latest

# 2. Descobrir subdomínios passivamente
subfinder -d alvo-autorizado.com -silent -o subs.txt

# 3. Filtrar apenas os que respondem HTTP/HTTPS
cat subs.txt | httpx -silent -o subs_vivos.txt

# 4. Rodar cwe-discover em loop contra cada subdomínio vivo
mkdir -p reports
for url in $(cat subs_vivos.txt); do
  python cwe_discover.py -u "$url" --i-have-authorization \\
    --format json -o "reports/$(echo $url | sed 's|https\\?://||;s|/|_|g').json"
done

# 5. Mesclar todos os relatórios JSON em um único arquivo com jq
jq -s '. | add' reports/*.json > merged_all_subs.json`
      }
    ]
  },
  {
    id: 10,
    slug: 'fluxo-completo-automacao',
    title: '10. Fluxo Completo de Automação (full_scan.sh)',
    category: 'integracoes',
    summary: 'Script Bash completo unificando enumeração de subdomínios, Nuclei e relatórios HackerOne.',
    content: [
      'Este script condensa todo o ciclo de vida do reconhecimento em um único comando executável no terminal do Linux ou Termux.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Script de automação full_scan.sh',
        code: `#!/bin/bash
DOMAIN=$1
if [ -z "$DOMAIN" ]; then
  echo "Uso: ./full_scan.sh dominio.com"
  exit 1
fi

subfinder -d "$DOMAIN" -silent -o subs.txt
cat subs.txt | httpx -silent -o subs_vivos.txt
nuclei -l subs_vivos.txt -severity critical,high,medium -jsonl -o nuclei.jsonl

python cwe_discover.py -u "https://$DOMAIN" --i-have-authorization \\
  --nuclei-json nuclei.jsonl --max-depth 4 \\
  --format hackerone -o "report_$DOMAIN.md"`
      },
      {
        language: 'bash',
        caption: 'Permissão e Execução',
        code: `chmod +x full_scan.sh
./full_scan.sh alvo-autorizado.com`
      }
    ]
  },
  {
    id: 11,
    slug: 'laboratorios-locais',
    title: '11. Testando em Laboratórios Locais (Zero Risco)',
    category: 'pratica',
    summary: 'Como testar o cwe-discover contra OWASP Juice Shop, DVWA e máquinas vulneráveis.',
    content: [
      'Ambientes de laboratório permitem calibrar a ferramenta sem receio de penalidades ou rate-limits.',
      '11.1 OWASP Juice Shop com Docker: container pronto contendo dezenas de falhas web.',
      '11.2 Ambiente DVWA local (Damn Vulnerable Web Application).',
      '11.3 Máquinas locais no VulnHub ou HackTheBox.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Comandos para Laboratórios Locais',
        code: `# OWASP Juice Shop com Docker
docker run -d -p 3000:3000 bkimminich/juice-shop

# Rodar cwe-discover com delay zero contra o laboratório
python cwe_discover.py -u http://localhost:3000 --i-have-authorization --delay 0 --format html -o lab_juice.html

# Testando DVWA local
python cwe_discover.py -u http://localhost/dvwa --i-have-authorization -v`
      }
    ]
  },
  {
    id: 12,
    slug: 'testes-automatizados',
    title: '12. Testes Automatizados da Ferramenta',
    category: 'avancado',
    summary: 'Execução da suite de testes unitários com pytest e medição de cobertura de código.',
    content: [
      'O projeto possui suite completa de testes com pytest para assegurar integridade de cada módulo:',
      '• test_redaction.py: valida a função de ofuscação de dados e segredos sensíveis.',
      '• test_crawler.py: valida o crawler passivo e filtros de escopo.',
      '• test_detectors.py: garante que os detectores de CWE encontrem os padrões esperados.',
      '• test_reporters.py: assegura a geração correta dos 5 formatos de relatório.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Executando testes com pytest',
        code: `# Instalar pytest e pytest-cov
pip install pytest pytest-cov

# Rodar todos os testes
pytest -v

# Verificar cobertura de testes
pytest --cov=. --cov-report=term-missing`
      }
    ]
  },
  {
    id: 13,
    slug: 'git-manter-repositorio-atualizado',
    title: '13. Git — Manter o Repositório Atualizado',
    category: 'avancado',
    summary: 'Comandos Git essenciais para atualizar a ferramenta e enviar contribuições via Pull Request.',
    content: [
      'Mantenha seu repositório sincronizado com as melhorias upstream e aprenda a submeter novos detectores.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Workflow de Git e Contribuição',
        code: `# Atualizar a cópia local
git pull origin main

# Criar fork e branch para novo detector
git checkout -b feature/novo-detector
git add .
git commit -m "feat(detectors): adiciona detector passivo para CWE-XYZ"
git push origin feature/novo-detector`
      }
    ]
  },
  {
    id: 14,
    slug: 'combinacoes-por-cenario',
    title: '14. Combinações por Cenário (Guia Rápido)',
    category: 'pratica',
    summary: '6 receitas práticas prontas de linha de comando para necessidades imediatas do dia a dia.',
    content: [
      '14.1 "Preciso de um relatório rápido pra revisar agora": python cwe_discover.py -u https://alvo.com --i-have-authorization',
      '14.2 "Preciso enviar pra alguém ler bonito": --format html -o relatorio.html',
      '14.3 "Preciso montar um report pro HackerOne": --format hackerone -o rascunho.md',
      '14.4 "Preciso processar os dados em outro script": --format json -o dados.json',
      '14.5 "Alvo é sensível, preciso ser bem discreto": --delay 2 --max-urls 30',
      '14.6 "Quero cobertura máxima de recon + validação": --max-depth 6 --max-urls 1500 --nuclei-json nuclei_full.jsonl --format html -o relatorio_completo.html'
    ]
  },
  {
    id: 15,
    slug: 'cwes-cobertas',
    title: '15. CWEs Cobertas (Detecção Passiva)',
    category: 'fundamentos',
    summary: 'Detalhamento das falhas detectadas: CWE-693, CWE-200, CWE-22, CWE-352 e CWE-615.',
    content: [
      'As detecções passivas são desenhadas para identificar vetores e superfícies expostas sem disparar alarmes ou payloads maliciosos.',
      '• CWE-693 (Médio): Ausência de headers de segurança (CSP, X-Frame-Options, HSTS, etc.).',
      '• CWE-200 (Alto): Exposição de arquivos sensíveis (.git, .env, backups .sql, arquivos de log).',
      '• CWE-22 (Médio): Indício de parâmetro relacionado a manipulação de caminhos (?file=, ?path=).',
      '• CWE-352 (Médio): Formulários sem proteção de token CSRF.',
      '• CWE-615 (Baixo): Comentários HTML revelando informações de infraestrutura ou versões.'
    ]
  },
  {
    id: 16,
    slug: 'limitacoes-e-falsos-positivos',
    title: '16. Limitações Conhecidas & Como Mitigar',
    category: 'fundamentos',
    summary: 'Comportamento com JavaScript, soft-404, parâmetros suspeitos e métodos de validação.',
    content: [
      '• Falsos positivos: Podem ocorrer em CWE-200 quando o servidor responde com "Soft-404" (página de erro personalizada com status 200 HTTP). Sempre verifique com curl -I.',
      '• Parâmetros suspeitos (CWE-22): O nome ?file= indica uma oportunidade de teste, mas não garante que o backend seja vulnerável a traversal.',
      '• SPA / JavaScript: O crawler padrão não renderiza JavaScript complexo em tempo de execução. Para alvos 100% SPA, utilize o Katana ou OWASP ZAP em conjunto.',
      '• Autenticação: Por padrão é não-autenticado, mas você pode injetar Cookies e Tokens Bearer facilmente.'
    ]
  },
  {
    id: 17,
    slug: 'uso-responsavel-etica',
    title: '17. Uso Responsável & Ética de Divulgação',
    category: 'etica',
    summary: 'Diretrizes éticas, regras de programas de Bug Bounty e política de Responsible Disclosure.',
    content: [
      'Use esta ferramenta APENAS contra:',
      '1. Alvos explicitamente no escopo de um programa de bug bounty do qual você participa, respeitando rigorosamente as diretrizes (rate limit, endpoints proibidos, janelas de teste).',
      '2. Ambientes de laboratório que você mesmo controla.',
      '🔒 Política de Divulgação Responsável: Se encontrar uma vulnerabilidade legítima, reporte exclusivamente pelo canal oficial da organização. Nunca divulgue detalhes publicamente antes da correção e sem consentimento formal.'
    ]
  },
  {
    id: 18,
    slug: 'estrutura-do-projeto',
    title: '18. Estrutura do Projeto & Arquitetura',
    category: 'avancado',
    summary: 'Árvore de diretórios do código-fonte e divisão modular de responsabilidades.',
    content: [
      'Diferente de frameworks divididos em muitos pacotes, o motor clássico do cwe-discover (capítulos 1-30) é intencionalmente concentrado em um único arquivo — cwe_discover.py — para facilitar a auditoria manual do código por quem for usá-lo em alvos sensíveis. A única camada de fato modularizada em um pacote Python é o pipeline multiagente opcional (agents/, capítulo 31).',
      'Dentro de cwe_discover.py, a classe CWEDiscover concentra a lógica: check_security_headers() e check_sensitive_files() fazem a auditoria passiva inicial; analyze_dom() inspeciona formulários, links e comentários já coletados pelo crawler; extract_links() alimenta a fila de URLs respeitando --max-depth e --max-urls; add_finding() calcula o Risk Score e monta cada achado; e export() decide qual _export_* interno chamar conforme --format.',
      'A base de conhecimento de CWEs (título, severidade, peso e mitigação de CWE-693, CWE-200, CWE-22, CWE-352 e CWE-615) fica no dicionário CWE_DATABASE, no topo do próprio cwe_discover.py — não existe um arquivo de configuração separado para isso.'
    ],
    codeSnippets: [
      {
        language: 'text',
        caption: 'Estrutura real de diretórios do repositório (CWE-Cover-2.0)',
        code: `CWE-Cover-2.0/
├── cwe_discover.py           # Ponto de entrada CLI, CWE_DATABASE e classe CWEDiscover (motor clássico)
├── gdrive_integration.py     # Upload opcional de relatórios ao Google Drive (--gdrive-folder-id)
├── ai_config.json            # Configuração da camada de IA opcional (Ollama + referência CrewAI)
├── AI_SETUP.md               # Guia de configuração da IA (Ollama/CrewAI)
├── GDRIVE_SETUP.md           # Guia de configuração do upload ao Google Drive
├── requirements.txt          # Dependências obrigatórias (requests, beautifulsoup4)
├── requirements-gdrive.txt   # Dependências opcionais do Google Drive
├── examples/
│   └── scope_example.json    # Modelo de arquivo de escopo para --scope-file
├── agents/                   # Pipeline multiagente opcional (--agents), veja o capítulo 31
│   ├── __init__.py
│   ├── models.py              # Enums/estruturas de status (INFO, HYPOTHESIS, CONFIRMED, ...)
│   ├── orchestrator.py        # Orquestra a ordem dos agentes e o escopo/modo
│   ├── recon.py                # Converte sinais brutos do crawler em hipóteses
│   ├── http_analyst.py         # HTTP Analyst — evidência objetiva adicional
│   ├── analysts.py             # CWE Analyst e OWASP Analyst
│   ├── validation.py           # Validation Agent
│   ├── false_positive.py       # False-Positive Analyst
│   ├── impact.py                # Impact Analyst
│   ├── mapping.py               # Mapeamento auxiliar CWE ↔ OWASP
│   ├── report_agent.py          # Report Agent (FACT / EVIDENCE / HYPOTHESIS / CONCLUSION)
│   └── pipeline.py              # Encadeia todos os agentes acima
├── tests/
│   └── test_agents_pipeline.py # Testes de regressão do pipeline multiagente
├── cli/                       # Cópia espelhada do pacote acima usada para empacotamento/distribuição
└── site/                      # Código-fonte deste site de documentação (Vite + React + TypeScript)`
      }
    ],
    warnings: [
      'Não existem as pastas detectors/, core/, reporters/ ou models/ soltas na raiz do projeto — toda a lógica de detecção, geração de PoC e exportação do modo clássico vive dentro de cwe_discover.py. Referências a esses diretórios em versões anteriores desta documentação estavam incorretas e foram corrigidas aqui.'
    ]
  },
  {
    id: 19,
    slug: 'configuracao-e-personalizacao',
    title: '19. Configuração & Personalização (cwe_discover.py e ai_config.json)',
    category: 'avancado',
    summary: 'Como customizar caminhos sensíveis, cabeçalhos verificados e a base de CWEs editando diretamente o código-fonte, e como usar ai_config.json para a camada de IA opcional.',
    content: [
      'O cwe-discover não possui um arquivo config/settings.py separado nem listas externas de caminhos/headers — essas são duas camadas de configuração realmente existentes no projeto: (1) constantes dentro de cwe_discover.py, editáveis diretamente no código; e (2) ai_config.json, na raiz do projeto, para a camada de IA opcional (ver capítulo 30).',
      'A lista de cabeçalhos de segurança obrigatórios está embutida no método check_security_headers() da classe CWEDiscover, e a lista de arquivos/caminhos sensíveis verificados está embutida no método check_sensitive_files(). Para personalizar, edite essas listas diretamente no arquivo — não é necessário criar nenhum arquivo novo.',
      'A base de conhecimento de CWEs (severidade, peso usado no Risk Score, impacto e mitigação de cada CWE) fica no dicionário CWE_DATABASE, também em cwe_discover.py. Adicionar uma nova entrada nesse dicionário é o que permite que add_finding() reconheça e pontue um novo CWE.'
    ],
    codeSnippets: [
      {
        language: 'python',
        caption: '19.1 Cabeçalhos verificados — dentro de check_security_headers() em cwe_discover.py',
        code: `required = [
    "Strict-Transport-Security",
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options"
    # Adicione aqui outros headers que você queira exigir, ex:
    # "Referrer-Policy",
    # "Permissions-Policy",
]`
      },
      {
        language: 'python',
        caption: '19.2 Caminhos sensíveis verificados — dentro de check_sensitive_files() em cwe_discover.py',
        code: `targets = ["/robots.txt", "/.git/HEAD", "/.env"]
# Para adicionar um novo caminho, inclua-o na lista acima e trate o
# resultado no bloco if/elif logo abaixo, definindo qual CWE e qual
# nível de confiança correspondem a esse caminho quando ele responder
# com status 200.`
      },
      {
        language: 'python',
        caption: '19.3 Adicionar um novo CWE à base — dicionário CWE_DATABASE em cwe_discover.py',
        code: `CWE_DATABASE = {
    # ... entradas existentes (CWE-693, CWE-200, CWE-22, CWE-352, CWE-615) ...
    "CWE-XXX": {
        "title": "Nome descritivo da vulnerabilidade",
        "severity": "MEDIUM",   # LOW, MEDIUM, HIGH ou CRITICAL
        "weight": 5.0,          # usado em Risk Score = weight * confidence
        "impact": "Descrição objetiva do impacto real desse achado.",
        "mitigation": "Recomendação de correção alinhada à taxonomia MITRE CWE."
    }
}`
      }
    ],
    tips: [
      'Depois de editar CWE_DATABASE, chame self.add_finding("CWE-XXX", url, confidence, evidence) no ponto do código (ex: um novo bloco em check_security_headers(), check_sensitive_files() ou analyze_dom()) onde a condição para esse novo CWE for detectada — é assim que um achado passa a aparecer no relatório final.',
      'Para a camada de IA opcional (reescrita de texto de PoC via Ollama), a personalização correta é editar ai_config.json, não o código Python — veja o capítulo 30.'
    ]
  },
  {
    id: 20,
    slug: 'criando-novo-detector',
    title: '20. Adicionando uma Nova Verificação Passiva (CWE)',
    category: 'avancado',
    summary: 'Guia prático, baseado no código real, para estender o cwe-discover com uma nova regra de detecção passiva — não existe um sistema de plugins/detectors separado; a extensão é feita diretamente na classe CWEDiscover.',
    content: [
      'O motor clássico não usa um sistema de plugins com classes abstratas tipo BaseDetector — cada verificação é um bloco de código dentro de um dos três métodos de análise da classe CWEDiscover: check_security_headers() (cabeçalhos HTTP), check_sensitive_files() (arquivos/caminhos conhecidos) ou analyze_dom() (formulários, links e comentários já coletados pelo crawler).',
      'Para adicionar uma nova verificação: 1) registre o novo CWE em CWE_DATABASE (capítulo 19); 2) escreva a condição de detecção dentro do método mais adequado; 3) quando a condição bater, chame self.add_finding("CWE-XXX", url, confidence, evidence) — essa chamada já cuida de calcular o Risk Score, gerar a PoC e (se --ai-narrative estiver ativo) enriquecer o texto de apoio via Ollama.',
      'Se a nova verificação exigir uma requisição HTTP extra (e não apenas reaproveitar dados já coletados), lembre-se de respeitar self.delay e self.timeout, do mesmo jeito que check_sensitive_files() já faz — isso mantém a filosofia anti-WAF/rate-limit da ferramenta.'
    ],
    codeSnippets: [
      {
        language: 'python',
        caption: 'Exemplo real: nova verificação dentro de check_sensitive_files()',
        code: `def check_sensitive_files(self):
    targets = ["/robots.txt", "/.git/HEAD", "/.env", "/config.yml"]  # caminho novo adicionado
    for path in targets:
        try:
            full_url = urljoin(self.target_url, path)
            resp = self.session.get(full_url, timeout=min(self.timeout, 5))
            if resp.status_code == 200 and len(resp.text) > 0:
                if path == "/.env" and "=" in resp.text:
                    self.add_finding("CWE-200", full_url, 0.99, "Arquivo .env público contendo credenciais/chaves.")
                elif path == "/.git/HEAD" and "ref:" in resp.text:
                    self.add_finding("CWE-200", full_url, 0.99, "Repositório .git exposto no diretório web.")
                elif path == "/robots.txt":
                    self.add_finding("CWE-615", full_url, 0.60, "Arquivo robots.txt acessível contendo rotas do sistema.")
                elif path == "/config.yml":
                    # Nova verificação: config.yml público é indício de CWE-200
                    self.add_finding("CWE-200", full_url, 0.85, "Arquivo config.yml público, possível vazamento de configuração.")
        except Exception:
            pass`
      },
      {
        language: 'python',
        caption: 'Exemplo real: nova verificação dentro de analyze_dom() (padrão em links)',
        code: `for a in soup.find_all("a", href=True):
    href = a['href']
    if any(p in href.lower() for p in ["file=", "page=", "doc=", "path=", "template=", "load="]):  # "load=" adicionado
        self.add_finding("CWE-22", urljoin(url, href), 0.70, f"Parâmetro com padrão de manipulação de arquivo detectado: {href}")`
      }
    ],
    tips: [
      'Se a sua verificação for uma reprodução do sinal detectado, use um nível de confidence conservador (0.5-0.7) e deixe o Validation/False-Positive Agent do pipeline --agents (capítulo 31) reforçar ou derrubar essa hipótese — não force confidence alto só para o achado aparecer no topo do relatório.'
    ]
  },
  {
    id: 21,
    slug: 'entendendo-o-risk-score',
    title: '21. Entendendo a Fórmula do Risk Score',
    category: 'fundamentos',
    summary: 'A matemática por trás do Risk Score: risk = severity_score * confidence.',
    content: [
      'O Risk Score permite priorizar com precisão os achados no relatório, evitando perder tempo com falsos positivos de baixa probabilidade.',
      'Fórmula: risk = severity_score * confidence',
      '• Severidade Base: Crítica (10), Alta (8), Média (5), Baixa (3), Info (1).',
      '• Confiança: valor calibrado entre 0.0 e 1.0 indicando a certeza da evidência.',
      'Exemplo de cálculo: Severidade Alta (8) com confiança Forte (0.8) → Risk Score = 6.4.'
    ],
    table: {
      headers: ['Nível de Confiança', 'Faixa', 'Significado Prático', 'Exemplo'],
      rows: [
        ['Forte', '0.9 – 1.0', 'Evidência inequívoca e determinística', 'Header de segurança ausente comprovado'],
        ['Moderada', '0.6 – 0.8', 'Indício arquitetural com alta probabilidade', 'Parâmetro com nome ?file= ou ?path='],
        ['Fraca', '0.3 – 0.5', 'Informação contextual que requer investigação', 'Comentário com número de versão'],
        ['Especulação', '0.0 – 0.2', 'Baixíssima certeza (não utilizado por padrão)', 'Palavras genéricas em texto']
      ]
    }
  },
  {
    id: 22,
    slug: 'como-interpretar-achados',
    title: '22. Como Interpretar os Achados na Prática',
    category: 'pratica',
    summary: 'Guia de triagem manual para cada tipo de indicador detectado pelo scanner.',
    content: [
      'Nem todo achado é uma vulnerabilidade explorável. O cwe-discover fornece o mapa da mina; a validação manual é seu dever.'
    ],
    table: {
      headers: ['Indicador', 'Ação de Investigação Manual Recomendada'],
      rows: [
        ['Header de segurança ausente', 'Verificar se é aplicável ao contexto da rota (ex: APIs REST não precisam de X-Frame-Options).'],
        ['Arquivo sensível (.git, .env)', 'Testar se o arquivo realmente contém dados ou se é um soft-404 (usar curl -I e curl -s).'],
        ['Parâmetro com nome "file" ou "path"', 'Em laboratório autorizado, testar caracteres de traversão e verificar reflexão.'],
        ['Formulário sem CSRF token', 'Verificar se a aplicação utiliza headers personalizados (ex: X-Requested-With) ou SameSite=Strict.'],
        ['Comentário com versão', 'Pesquisar bases de CVE e advisories conhecidos para a versão indicada.']
      ]
    }
  },
  {
    id: 23,
    slug: 'boas-praticas-para-relatorios',
    title: '23. Boas Práticas para Relatórios de Bug Bounty',
    category: 'etica',
    summary: 'Como redigir relatórios claros, com evidências limpas e sugestões viáveis no HackerOne e Bugcrowd.',
    content: [
      '• Seja Claro e Objetivo: descreva a falha em termos precisos e sem rodeios.',
      '• Forneça Evidências Sanitizadas: nunca envie tokens, senhas ou dados de outros usuários. Redija informações sensíveis.',
      '• Demonstre o Impacto Real: explique exatamente qual risco o negócio corre se a falha for explorada.',
      '• Sugira a Correção: adicione referências de código e mitigação recomendada.'
    ]
  },
  {
    id: 24,
    slug: 'ferramentas-complementares',
    title: '24. Ferramentas Complementares no Recon',
    category: 'integracoes',
    summary: 'Integrações com Subfinder, Httpx, Gau, Katana, Nmap e OWASP ZAP.',
    content: [
      '• Nuclei: validação de vulnerabilidades ativas por templates.',
      '• Subfinder: enumeração passiva de subdomínios.',
      '• Httpx: validação de portas e serviços web ativos.',
      '• Gau (GetAllUrls): busca de URLs históricas no Wayback Machine e CommonCrawl.',
      '• Katana: crawling dinâmico com suporte a headless browser e JavaScript.',
      '• OWASP ZAP: proxy de interceptação e auditoria web.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Coletando URLs históricas com Gau',
        code: `# Instalar Gau
go install github.com/lc/gau/v2/cmd/gau@latest

# Coletar histórico do domínio
gau alvo-autorizado.com > urls_historicas.txt`
      }
    ]
  },
  {
    id: 25,
    slug: 'autenticacao-e-sessoes',
    title: '25. Autenticação e Sessões (Cookies & Bearer)',
    category: 'avancado',
    summary: 'Como fornecer credenciais e tokens autenticados para rastrear áreas restritas.',
    content: [
      'Para rastrear painéis que exigem login, configure os headers de autorização ou cookies de sessão no cliente HTTP.'
    ],
    codeSnippets: [
      {
        language: 'python',
        caption: 'Configurando Cookie ou Token no core/client.py',
        code: `# 25.1 Usando Cookie de Sessão
self.session.headers.update({
    'Cookie': 'sessionid=seu_cookie_autenticado_aqui'
})

# 25.2 Usando Token Bearer
self.session.headers.update({
    'Authorization': 'Bearer seu_jwt_token_aqui'
})`
      }
    ],
    warnings: [
      'Nunca compartilhe tokens ou cookies em logs ou relatórios públicos. Revise sempre seus rascunhos antes de exportar.'
    ]
  },
  {
    id: 26,
    slug: 'owasp-zap-no-termux',
    title: '26. Instalação e Uso do OWASP ZAP no Termux',
    category: 'integracoes',
    summary: 'Instalação completa do Java 11 (OpenJDK) e execução do OWASP ZAP em modo headless no Termux.',
    content: [
      'O OWASP ZAP (Zed Attack Proxy) é um scanner e proxy de segurança. No Termux, pode ser executado em modo headless (-cmd) para testes rápidos.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Instalação do ZAP no Termux',
        code: `# 1. Instalar OpenJDK 11 no Termux
pkg install openjdk-11 -y
java -version

# 2. Baixar e descompactar o ZAP
mkdir ~/zap && cd ~/zap
wget https://github.com/zaproxy/zaproxy/releases/download/v2.14.0/ZAP_2.14.0_Linux.tar.gz
tar -xzf ZAP_2.14.0_Linux.tar.gz
mv ZAP_2.14.0 zap

# 3. Configurar no PATH
export PATH=$PATH:~/zap/zap
echo 'export PATH=$PATH:~/zap/zap' >> ~/.bashrc
source ~/.bashrc

# 4. Executar Scan Headless rápido e exportar
./zap.sh -cmd -quickurl https://alvo-autorizado.com -quickprogress -quickout report_zap.html`
      }
    ],
    tips: [
      'Você pode exportar os alertas do ZAP em formato JSON (-quickout zap_alerts.json) e correlacionar com o cwe-discover.'
    ]
  },
  {
    id: 27,
    slug: 'instalacao-completa-dependencias',
    title: '27. Instalação Completa de Todas as Dependências (Linux, Termux, Go, Nuclei & Python)',
    category: 'fundamentos',
    summary: 'Tutorial universal para instalar todas as ferramentas do ecossistema cwe-discover em qualquer sistema operacional.',
    content: [
      'Para usufruir de 100% dos recursos do cwe-discover (crawler assíncrono, parser BeautifulSoup4, validação com Nuclei e ZAP), siga o checklist de instalação para sua plataforma.',
      'Abaixo estão os comandos prontos para Ubuntu/Debian, Arch Linux, Termux (Android), macOS e ambientes virtuais isolados (venv).'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: '1. Linux (Ubuntu / Debian / Kali)',
        code: `# Atualizar repositórios e instalar base
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git curl wget golang-go openjdk-17-jre

# Configurar ambiente virtual Python (Recomendado)
mkdir -p ~/cwe-workspace && cd ~/cwe-workspace
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0
python3 -m venv venv
source venv/bin/activate

# Instalar dependências Python
pip install --upgrade pip
pip install requests beautifulsoup4 urllib3 rich tabulate pytest

# Instalar ProjectDiscovery Nuclei (via Go)
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
export PATH=$PATH:$(go env GOPATH)/bin
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
nuclei -update-templates`
      },
      {
        language: 'bash',
        caption: '2. Android (Termux)',
        code: `# Atualizar Termux
pkg update && pkg upgrade -y
pkg install -y git python python-pip golang openjdk-17 curl wget

# Clonar repositório
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0

# Instalar pacotes Python
pip install --upgrade pip
pip install requests beautifulsoup4 urllib3 rich tabulate

# Instalar Nuclei no Termux
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
export PATH=$PATH:$HOME/go/bin
echo 'export PATH=$PATH:$HOME/go/bin' >> ~/.bashrc
nuclei -update-templates`
      }
    ],
    tips: [
      'Usar um virtualenv (python3 -m venv venv) evita conflitos com o gerenciador de pacotes do sistema (PEP 668 no Debian/Ubuntu moderno).'
    ]
  },
  {
    id: 28,
    slug: 'crewai-agentes-ia-automacao',
    title: '28. Integração Multi-Agente com CrewAI & cwe-discover',
    category: 'avancado',
    summary: 'Como criar um enxame de agentes de IA autônomos (CrewAI) para orquestrar varredura passiva, triagem e escrita de relatórios.',
    content: [
      'O cwe-discover possui saídas JSON e Markdown puras e determinísticas, tornando-o o motor de reconhecimento perfeito para agentes autônomos do CrewAI.',
      'Nesta arquitetura, configuramos 4 agentes especializados:',
      '1. 🕵️ Reconnaissance Orchestrator: define alvos autorizados e dispara o cwe-discover.',
      '2. ⚖️ Triage & Risk Analyst: ingere o JSON, analisa os scores de confiança e elimina falsos positivos.',
      '3. 🛡️ Remediation Engineer: elabora orientações técnicas de correção para o time de desenvolvimento.',
      '4. 📝 Bug Bounty Report Writer: gera relatórios formatados para HackerOne ou Bugcrowd prontos para submissão.'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Instalação do CrewAI e Ferramentas de IA',
        code: `# Instalar o CrewAI e ferramentas de LLM
pip install crewai crewai-tools langchain-google-genai pydantic

# Configurar chave de API (Google Gemini ou OpenAI)
export GEMINI_API_KEY="sua_chave_aqui"`
      },
      {
        language: 'python',
        caption: 'crew_recon.py - Pipeline Completo de Agentes com cwe-discover',
        code: `import os
import subprocess
import json
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

@tool("Run cwe-discover Scan")
def run_cwe_discover(target_url: str) -> str:
    """Executes passive cwe-discover scan on authorized target and returns JSON output."""
    cmd = [
        "python", "cwe_discover.py",
        "-u", target_url,
        "--i-have-authorization",
        "--format", "json",
        "-o", "output_finding.json"
    ]
    subprocess.run(cmd, check=True)
    with open("output_finding.json", "r") as f:
        return f.read()

# 1. Agente de Triagem e Reconhecimento
recon_analyst = Agent(
    role="AppSec Reconnaissance & Triage Specialist",
    goal="Analyze passive security telemetry and prioritize critical CWE risks",
    backstory="You are an expert offensive security researcher specialized in MITRE CWE taxonomy and Bug Bounty triage.",
    tools=[run_cwe_discover],
    verbose=True
)

# 2. Agente Redator de Relatórios HackerOne
report_writer = Agent(
    role="Senior Bug Bounty Report Writer",
    goal="Draft high-impact, professional vulnerability submissions for HackerOne",
    backstory="You craft clear, reproducible, and impactful reports with curl PoCs, root-cause explanations, and remediations.",
    verbose=True
)

# Definir Tarefas
task_scan = Task(
    description="Run cwe-discover against {target_url} and evaluate all identified CWEs by risk score.",
    expected_output="Structured analysis of top vulnerabilities ranked by Risk Score.",
    agent=recon_analyst
)

task_report = Task(
    description="Convert the findings into a complete HackerOne Markdown submission draft.",
    expected_output="HackerOne ready report with Summary, Steps, Impact, PoC, and Remediation.",
    agent=report_writer
)

# Executar a Equipe
crew = Crew(
    agents=[recon_analyst, report_writer],
    tasks=[task_scan, task_report],
    process=Process.sequential
)

result = crew.kickoff(inputs={"target_url": "https://alvo-autorizado.com"})
print(result)`
      }
    ],
    tips: [
      'Agentes autônomos com cwe-discover reduzem o tempo de triagem de horas para segundos, mantendo zero envio de payloads hostis.'
    ]
  },
  {
    id: 29,
    slug: 'configurando-upload-google-drive',
    title: '29. Configurando o Upload Automático para o Google Drive',
    category: 'integracoes',
    summary: 'Passo a passo para criar a Service Account no Google Cloud, compartilhar a pasta de destino e rodar o cwe-discover com --gdrive-folder-id.',
    content: [
      'O cwe-discover pode enviar automaticamente cada relatório gerado (Markdown, HTML, CSV) direto para uma pasta específica no Google Drive, útil para manter os achados de cada cliente/alvo isolados em pastas separadas.',
      'O método recomendado é autenticação via Service Account: uma conta de robô do Google Cloud que não exige login interativo, ideal para automação, cron jobs e CI/CD. A alternativa OAuth (login com sua própria conta Google) também é suportada com --gdrive-auth-mode oauth, mas exige abrir o navegador na primeira execução.',
      'Passo 1 — Criar o projeto e ativar a API: acesse console.cloud.google.com, crie um projeto (ou use um existente) e ative a "Google Drive API" em "APIs e Serviços" → "Biblioteca".',
      'Passo 2 — Criar a Service Account: em "APIs e Serviços" → "Credenciais" → "Criar Credenciais" → "Conta de Serviço". Dê um nome (ex: cwe-discover-bot) e conclua sem atribuir papéis de projeto (não são necessários — o acesso é dado diretamente na pasta do Drive).',
      'Passo 3 — Gerar a chave JSON: abra a Service Account criada → aba "Chaves" → "Adicionar Chave" → "Criar nova chave" → formato JSON. O arquivo baixado é a sua credencial — renomeie para credentials.json e guarde na pasta do projeto (NUNCA versione esse arquivo no Git).',
      'Passo 4 — Compartilhar a pasta do Drive com a Service Account: a Service Account tem um e-mail próprio, no formato nome@projeto.iam.gserviceaccount.com (visível na tela da conta de serviço criada). Abra a pasta de destino no Google Drive, clique em "Compartilhar" e adicione esse e-mail com permissão de "Editor".',
      'Passo 5 — Pegar o ID da pasta: com a pasta aberta no navegador, o ID é o trecho final da URL — https://drive.google.com/drive/folders/SEU_ID_AQUI. Esse é o valor usado em --gdrive-folder-id.',
      'Passo 6 — Instalar as dependências e rodar: pip install -r requirements-gdrive.txt, depois execute o scan normalmente adicionando os parâmetros do Drive.',
      'Isolamento por cliente/alvo: crie uma pasta por cliente no Drive, compartilhe cada uma com a mesma Service Account, e passe o --gdrive-folder-id correspondente em cada execução. A ferramenta valida antes do upload que o ID informado é realmente uma pasta acessível com permissão de editor — se a checagem falhar, o upload é abortado (sem enviar em pasta errada nem silenciosamente).'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Instalação das dependências opcionais do Drive',
        code: `pip install -r requirements-gdrive.txt
# ou diretamente:
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib`
      },
      {
        language: 'bash',
        caption: 'Rodando o scan com upload automático (Service Account)',
        code: `python cwe_discover.py \\
  -u https://alvo-autorizado.com \\
  --i-have-authorization \\
  --format markdown \\
  -o cwe_report.md \\
  --gdrive-folder-id 1AbCDeFGhijKLmnOPqrsTUVwxyz \\
  --gdrive-credentials credentials.json`
      },
      {
        language: 'bash',
        caption: 'Alternativa: autenticação OAuth (conta pessoal)',
        code: `python cwe_discover.py \\
  -u https://alvo-autorizado.com \\
  --i-have-authorization \\
  -o cwe_report.md \\
  --gdrive-folder-id 1AbCDeFGhijKLmnOPqrsTUVwxyz \\
  --gdrive-credentials oauth_client_secret.json \\
  --gdrive-auth-mode oauth
# Na primeira execução abre o navegador para login;
# depois disso reusa o token salvo em gdrive_token.json`
      }
    ],
    table: {
      headers: ['Parâmetro', 'Obrigatório', 'Descrição'],
      rows: [
        ['--gdrive-folder-id', 'Sim (para ativar o upload)', 'ID da pasta de destino no Drive'],
        ['--gdrive-credentials', 'Não (default: credentials.json)', 'Caminho do JSON de credenciais'],
        ['--gdrive-auth-mode', 'Não (default: service_account)', "'service_account' ou 'oauth'"]
      ]
    },
    tips: [
      'Guarde credentials.json fora do repositório Git — adicione ao .gitignore.',
      'Se o upload falhar (pasta errada, sem permissão, rede fora), o script avisa no terminal mas não apaga nem impede a geração do relatório local.'
    ],
    warnings: [
      'Nunca compartilhe uma pasta de um cliente com a Service Account de outro projeto/ambiente — mantenha uma pasta isolada por alvo para evitar vazamento cruzado de relatórios.'
    ]
  },
  {
    id: 30,
    slug: 'configurando-ia-crewai-ollama',
    title: '30. Configurando a Camada de IA (Ollama & CrewAI) via ai_config.json',
    category: 'integracoes',
    summary: 'Como editar o arquivo ai_config.json para ajustar endpoint, modelo e o prompt anti-alucinação do Ollama, e como configurar o pipeline CrewAI que consome a saída do cwe-discover.',
    content: [
      'Toda a camada de IA do cwe-discover é opcional e fica fora do código Python, num arquivo editável chamado ai_config.json na raiz do projeto. Isso significa que dá pra trocar modelo, endpoint e até o prompt anti-alucinação sem tocar em nenhuma linha de .py.',
      'O arquivo tem duas seções: "ollama" (usada pela flag --ai-narrative, que só reescreve o texto de apoio da PoC — nunca os comandos técnicos) e "crewai" (referência de configuração para quem monta o pipeline multi-agente externo descrito no capítulo 28).',
      'Campo "system_prompt": é a regra anti-alucinação. Se você editar, mantenha as 5 restrições originais (não inventar evidência, não confirmar exploração, não atribuir severidade/CVSS, citar só OWASP/MITRE oficiais, só reescrever o texto de apoio sem tocar nos comandos) — remover essas regras aumenta o risco de a IA gerar PoC especulativa.',
      'Ollama precisa estar rodando localmente (ou em um host acessível) antes de usar --ai-narrative. Se o endpoint estiver offline ou der timeout, o script cai de volta pra PoC 100% determinística — o relatório nunca fica sem PoC por causa disso.',
      'CrewAI não roda dentro do cwe-discover: ele é o motor de dados determinístico (JSON/Markdown) que alimenta um pipeline CrewAI separado. A seção "crewai" do ai_config.json serve como referência centralizada de qual provedor/modelo/agentes usar nesse pipeline externo (ver script completo no capítulo 28).'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Instalar e subir o Ollama localmente',
        code: `# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Baixar um modelo (ex: llama3)
ollama pull llama3

# Subir o servidor local (fica ouvindo em localhost:11434)
ollama serve`
      },
      {
        language: 'json',
        caption: 'ai_config.json — seção do Ollama (edite estes valores)',
        code: `{
  "ollama": {
    "endpoint": "http://localhost:11434/api/generate",
    "model": "llama3",
    "timeout_seconds": 20,
    "system_prompt": "Regras anti-alucinação: nunca invente evidência, nunca confirme exploração, nunca atribua severidade/CVSS, cite só OWASP/MITRE oficiais, só reescreva o texto de apoio sem alterar os comandos da PoC."
  }
}`
      },
      {
        language: 'bash',
        caption: 'Rodando o scan com narrativa via IA',
        code: `python cwe_discover.py \\
  -u https://alvo-autorizado.com \\
  --i-have-authorization \\
  -o cwe_report.md \\
  --ai-narrative \\
  --ai-config ai_config.json

# Ou apontando para outro arquivo de config / outro host de Ollama:
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization \\
  --ai-narrative --ai-config configs/cliente_x.json \\
  --ollama-endpoint http://192.168.0.10:11434/api/generate`
      },
      {
        language: 'json',
        caption: 'ai_config.json — seção do CrewAI (referência para o pipeline externo)',
        code: `{
  "crewai": {
    "provider": "gemini",
    "api_key_env_var": "GEMINI_API_KEY",
    "model": "gemini/gemini-1.5-flash",
    "agents": {
      "recon_analyst": {
        "role": "AppSec Reconnaissance & Triage Specialist",
        "goal": "Analisar a telemetria de segurança passiva e priorizar riscos CWE críticos"
      },
      "report_writer": {
        "role": "Senior Bug Bounty Report Writer",
        "goal": "Redigir submissões de vulnerabilidade profissionais e de alto impacto"
      }
    }
  }
}`
      }
    ],
    table: {
      headers: ['Parâmetro CLI', 'Descrição'],
      rows: [
        ['--ai-narrative', 'Ativa a reescrita do texto de apoio da PoC via IA (desligado por padrão)'],
        ['--ai-config <arquivo>', 'Caminho do JSON de configuração (default: ai_config.json)'],
        ['--ollama-endpoint <url>', 'Sobrescreve pontualmente o endpoint definido no arquivo de config'],
        ['--ollama-model <nome>', 'Sobrescreve pontualmente o modelo definido no arquivo de config']
      ]
    },
    tips: [
      'Mantenha um ai_config.json por cliente/contexto se quiser prompts ou modelos diferentes por engajamento — basta apontar com --ai-config.',
      'A chave da API do CrewAI (ex: GEMINI_API_KEY) fica em variável de ambiente, nunca no ai_config.json, para não vazar credencial em relatórios ou commits.'
    ],
    warnings: [
      'Não remova as restrições do system_prompt achando que vai deixar a PoC "mais completa" — é exatamente essa regra que impede a IA de inventar payload, confirmar exploração sem validação ou citar CVSS que não foi calculado pelo motor determinístico.'
    ]
  },
  {
    id: 31,
    slug: 'pipeline-multiagente-evidence-first',
    title: '31. Pipeline Multiagente Evidence-First (pacote agents/)',
    category: 'avancado',
    summary: 'Como a camada opcional --agents reprocessa os sinais do scanner atraves de 9 agentes especializados (Orchestrator, Recon, HTTP/CWE/OWASP Analyst, Validation, False-Positive, Impact e Report) antes de qualquer achado poder ser chamado de CONFIRMADO.',
    content: [
      'Diferente do motor classico (capitulos 1-30), que ja entrega achados prontos com severidade e Risk Score, o pipeline multiagente trata cada sinal do scanner como uma HIPOTESE ate que sobreviva a uma cadeia de verificacoes explicitas. Ele e 100% aditivo: so roda quando voce passa a flag --agents, e nunca altera o relatorio legado (-o relatorio.md continua identico).',
      'Principio central, repetido em todo o pacote agents/: "Evidencia primeiro. Classificacao depois. Conclusao por ultimo." Nenhum agente pode declarar uma vulnerabilidade confirmada so porque um endpoint parece suspeito, um parametro se chama "file" ou o CWE existe na base MITRE.',
      'Escada de status: INFO -> OBSERVATION -> HYPOTHESIS -> POTENTIAL -> CONFIRMED, com desvios para NOT_CONFIRMED, FALSE_POSITIVE, INSUFFICIENT_EVIDENCE e UNCERTAIN. So o Validation Agent e o False-Positive Agent podem mover confidence/confirmed — nenhum outro agente tem essa permissao.',
      'Os 9 agentes, na ordem em que atuam: (1) Orchestrator — verifica autorizacao, define escopo/modo e consolida sem duplicar; (2) Recon — organiza os sinais brutos do crawler existente como hipoteses, nunca como vulnerabilidades; (3) HTTP Analyst — coleta evidencia objetiva adicional (rechecagem de reprodutibilidade, indicios de WAF/CDN), sempre respeitando o modo de operacao; (4) CWE Analyst — rotula o comportamento observado com um CWE candidato; (5) OWASP Analyst — mapeia a categoria OWASP de referencia e explicita qual evidencia falta; (6) Validation Agent — so evidencia + reprodutibilidade + escopo confirmado sustentam confianca; (7) False-Positive Analyst — busca explicacoes alternativas (WAF, comportamento normal, endpoint publico legitimo) antes de deixar algo como CONFIRMED; (8) Impact Analyst — nunca inventa dados, usuarios ou execucao de codigo: sem demonstracao, o campo Impact e sempre "Not demonstrated"; (9) Report Agent — gera o relatorio final separando FACT / EVIDENCE / HYPOTHESIS / CONCLUSION.',
      'Regra de honestidade por familia de CWE: achados baseados em fato diretamente observavel (headers ausentes — CWE-693; arquivo publico com conteudo sensivel — CWE-200/CWE-615) PODEM chegar a CONFIRMED se sobreviverem a checagem de falso positivo. Achados baseados em padrao estrutural sem exploracao real (nome de parametro sugerindo path traversal — CWE-22; ausencia de campo de token — CWE-352) NUNCA sao auto-confirmados pelo pipeline, porque nenhuma exploracao foi de fato tentada — eles ficam travados em POTENTIAL, no maximo.',
      'Controle de escopo obrigatorio: sem um --scope-file, o pipeline trata o alvo como SCOPE_UNKNOWN e nunca assume autorizacao implicita — nada pode virar CONFIRMED nesse estado, mesmo que a evidencia pareca forte. O modo AUTHORIZED_ACTIVE se recusa a rodar sem um arquivo de escopo explicito.',
      'Modos de operacao (--mode): PASSIVE (default; usa so o que o crawler ja coletou, zero requisicao extra), SAFE (permite uma rechecagem GET adicional para testar reprodutibilidade), AUTHORIZED_ACTIVE (exige --scope-file com authorization: true) e LAB (ambientes locais/CTF).'
    ],
    codeSnippets: [
      {
        language: 'bash',
        caption: 'Rodando o scan classico + pipeline multiagente lado a lado',
        code: `python cwe_discover.py \\
  -u https://alvo-autorizado.com \\
  --i-have-authorization \\
  -o relatorio.md \\
  --agents \\
  --mode safe \\
  --scope-file examples/scope_example.json \\
  --agents-output relatorio_agentes.md`
      },
      {
        language: 'json',
        caption: 'examples/scope_example.json — formato do arquivo de escopo',
        code: `{
  "target": "https://example.com",
  "allowed_domains": ["example.com"],
  "authorization": true,
  "allowed_methods": ["GET"],
  "rate_limit_per_sec": 2,
  "exclusions": ["/logout", "/admin/delete"]
}`
      },
      {
        language: 'json',
        caption: 'Trecho de saida — hipotese travada em SCOPE_UNKNOWN (sem --scope-file)',
        code: `{
  "status": "HYPOTHESIS",
  "cwe": "CWE-693",
  "confidence": 0.25,
  "confirmed": false,
  "in_scope": null,
  "reproduction_info": "Validation not performed due to safety/impact constraints (SCOPE_UNKNOWN: nenhum arquivo de escopo fornecido).",
  "impact": "Impact: Not demonstrated (hipotese ainda nao validada/confirmada)."
}`
      }
    ],
    table: {
      headers: ['Flag', 'Descricao'],
      rows: [
        ['--agents', 'Ativa o pipeline multiagente (opcional; nada muda sem ela)'],
        ['--scope-file <arquivo>', 'JSON de escopo/autorizacao. Sem ele: SCOPE_UNKNOWN, nada vira CONFIRMED'],
        ['--mode <passive|safe|authorized_active|lab>', 'Controla quais verificacoes ativas o HTTP Analyst pode fazer (default: passive)'],
        ['--agents-output <arquivo>', 'Caminho do relatorio multiagente (default: <output>_agents.md)']
      ]
    },
    tips: [
      'Use --mode passive em qualquer alvo cuja autorizacao voce ainda nao formalizou por escrito — ele nunca faz uma requisicao alem das que o crawler ja fez.',
      'Os testes de regressao do pipeline ficam em tests/test_agents_pipeline.py — rode-os com `python3 -m unittest tests.test_agents_pipeline -v` sempre que editar um agente.'
    ],
    warnings: [
      'Nunca trate "confidence alta" como sinonimo de "vulnerabilidade real". Para CWE-22 e CWE-352, o teto e POTENTIAL por design — confirmar isso manualmente (com uma tentativa de exploracao real, fora deste pipeline) continua sendo responsabilidade humana antes de qualquer submissao a programa de bug bounty.'
    ]
  }
];
