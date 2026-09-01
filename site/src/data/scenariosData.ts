import { ScenarioPreset } from '../types';

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'quick-review',
    title: 'Relatório Rápido para Revisão Imediata',
    subtitle: 'Scan no terminal em formato Markdown',
    category: 'Básico',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization',
    explanation: 'Executa o crawler passivo com configurações padrão e imprime diretamente no terminal a tabela formatada em Markdown com o resumo de achados ordenados por Risk Score.',
    tags: ['Rápido', 'Terminal', 'Markdown']
  },
  {
    id: 'html-report',
    title: 'Relatório HTML Visual para Apresentação',
    subtitle: 'Pronto para abrir em navegadores e clientes',
    category: 'Relatórios',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format html -o relatorio.html',
    explanation: 'Gera um documento HTML completo com estilos modernos, tabela de severidade, apêndice de cabeçalhos e links para cada URL afetada. No Termux, abra com: termux-open relatorio.html',
    tags: ['HTML', 'Visual', 'Termux-Open']
  },
  {
    id: 'hackerone-draft',
    title: 'Rascunho Pronto para Submissão HackerOne',
    subtitle: 'Estruturado com Summary, Steps, Impact & Fix',
    category: 'Bug Bounty',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format hackerone -o rascunhos.md',
    explanation: 'Exporta cada achado identificado em seções individuais estruturadas no padrão oficial de relatórios de vulnerabilidade de plataformas de Bug Bounty (HackerOne / Bugcrowd).',
    tags: ['HackerOne', 'Bugcrowd', 'Triagem']
  },
  {
    id: 'json-pipeline',
    title: 'Exportação JSON para Pipelines & Scripts',
    subtitle: 'Integração com jq, Python ou bases de dados',
    category: 'Automação',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format json -o dados.json',
    explanation: 'Saída estruturada em formato JSON contendo todos os metadados brutos: URLs visitadas, parâmetros, confidence, risk score e detalhes de cabeçalhos capturados.',
    tags: ['JSON', 'Pipelines', 'API']
  },
  {
    id: 'stealth-scan',
    title: 'Scan Lento e Discreto (Alvos Sensíveis)',
    subtitle: 'Evita bloqueios de WAF e rate-limits severos',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --delay 2 --timeout 30 --max-urls 30',
    category: 'Estratégico',
    explanation: 'Introduz uma pausa de 2 segundos entre cada requisição HTTP, com limite restrito de 30 páginas e timeout de 30s para não saturar servidores frágeis.',
    tags: ['Stealth', 'WAF-Safe', 'Delay']
  },
  {
    id: 'max-recon-nuclei',
    title: 'Cobertura Máxima: Recon + Nuclei Ativo',
    subtitle: 'Varredura profunda mesclada em relatório único',
    category: 'Completo',
    command: 'python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --max-depth 6 --max-urls 1500 --nuclei-json nuclei_full.jsonl --format html -o relatorio_completo.html',
    explanation: 'Combina profundidade máxima de crawling com o arquivo de templates do Nuclei (.jsonl), gerando um relatório HTML unificado com achados passivos e ativos.',
    tags: ['Deep Crawl', 'Nuclei', 'HTML Master']
  },
  {
    id: 'local-lab-juice-shop',
    title: 'Laboratório Local: OWASP Juice Shop',
    subtitle: 'Sem restrições de delay em Docker local',
    category: 'Laboratório',
    command: 'docker run -d -p 3000:3000 bkimminich/juice-shop\npython cwe_discover.py -u http://localhost:3000 --i-have-authorization --delay 0 --max-urls 50 --format html -o teste_lab.html',
    explanation: 'Sobe uma instância vulnerável do OWASP Juice Shop em container Docker e roda o scanner com delay zero para testes imediatos de validação.',
    tags: ['Docker', 'Juice Shop', 'Zero Delay']
  }
];

export const FULL_AUTOMATION_SCRIPT = `#!/bin/bash
# full_scan.sh - Automação completa de Recon + Validação + HackerOne
DOMAIN=$1
if [ -z "$DOMAIN" ]; then
  echo "Uso: ./full_scan.sh dominio.com"
  exit 1
fi

echo "[1/4] Descobrindo subdomínios com Subfinder..."
subfinder -d "$DOMAIN" -silent -o subs.txt

echo "[2/4] Filtrando subdomínios ativos com Httpx..."
cat subs.txt | httpx -silent -o subs_vivos.txt

echo "[3/4] Executando Nuclei nos alvos vivos..."
nuclei -l subs_vivos.txt -severity critical,high,medium -jsonl -o nuclei.jsonl

echo "[4/4] Executando cwe-discover e mesclando achados em formato HackerOne..."
python cwe_discover.py -u "https://$DOMAIN" --i-have-authorization \\
  --nuclei-json nuclei.jsonl --max-depth 4 \\
  --format hackerone -o "report_$DOMAIN.md"

echo "✅ Concluído! Relatório gerado em report_$DOMAIN.md"`;

export const EXTENSION_DETECTOR_CODE = `# detectors/cwe_123.py
from .base import BaseDetector
from models.finding import Finding

class CWE123Detector(BaseDetector):
    def __init__(self):
        super().__init__(cwe_id='CWE-123', name='Exemplo de Detector Customizado')

    def check(self, url, response, context):
        # Lógica de inspeção passiva
        if 'token_secreto_exposto' in response.text:
            return Finding(
                title='Exposição de Token Customizado',
                description='Token interno identificado no corpo da resposta.',
                severity='Médio',
                confidence=0.8,
                url=url,
                cwe='CWE-123'
            )
        return None`;
