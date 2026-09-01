import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Fingerprint
} from 'lucide-react';
import { AgentStatus } from '../../types/product';

const FULL_AGENTS_DATA = [
  {
    id: 'AGT-ORCHESTRATOR',
    name: 'Agente Orchestrator',
    engine: 'ALL_17_ENGINES',
    role: 'Orquestração de grafo de tarefas e resolução de dependências assíncronas',
    confidence: 0.99,
    decisions: ['Execução paralela de DNS e Network', 'Trigger automático de validação diferencial'],
    inputs: 'Target URL, ScopePolicy, RateLimitConfig',
    outputs: 'CampaignState, UnifiedIntelligenceGraph'
  },
  {
    id: 'AGT-SCOPE',
    name: 'Agente de Escopo',
    engine: 'CH-SCOPE',
    role: 'Policiamento estrito de fronteiras, CIDRs e wildcards autorizados',
    confidence: 1.0,
    decisions: ['Bloqueio preventivo de 100% de domínios fora de autorização formal'],
    inputs: 'Parsed URL, AllowedSubdomains, StrictAuthorizedFlag',
    outputs: 'AuthorizedTargetsQueue'
  },
  {
    id: 'AGT-DNS',
    name: 'Agente DNS',
    engine: 'CH-DNS',
    role: 'Topologia de nomes, resolução A/AAAA/CNAME/MX/TXT e Certificate Transparency',
    confidence: 0.96,
    decisions: ['Resolução recursiva local', 'Mapeamento de SAN de certificados SSL'],
    inputs: 'Target Domain',
    outputs: 'AssetList (SUBDOMAIN, IP)'
  },
  {
    id: 'AGT-NETWORK',
    name: 'Agente de Rede',
    engine: 'CH-NET / CH-SPEEDNET',
    role: 'Superfície de portas e protocolos através de raw sockets TCP/UDP',
    confidence: 0.95,
    decisions: ['Varredura assíncrona não bloqueante', 'Zero dependências de binários externos'],
    inputs: 'IP List, Port Ranges',
    outputs: 'OpenPorts, ServiceBanners'
  },
  {
    id: 'AGT-HTTP',
    name: 'Agente HTTP',
    engine: 'CH-HTTP / CH-AUDIT',
    role: 'Parser RFC 7230, inspeção de cabeçalhos de segurança e cifras TLS',
    confidence: 0.97,
    decisions: ['Auditoria de HSTS, CSP, X-Frame-Options', 'Validação de certificados TLS 1.3'],
    inputs: 'Host, Port, Protocol',
    outputs: 'SecurityHeaderObservations, TLSProfile'
  },
  {
    id: 'AGT-CRAWLER',
    name: 'Agente Crawler',
    engine: 'CH-CRAWL',
    role: 'Mapeamento de rotas, assets estáticos, scripts JS e formulários',
    confidence: 0.92,
    decisions: ['Stream parsing do DOM HTML', 'Extração de endpoints em bundles JavaScript'],
    inputs: 'Base URL, CrawlDepth, MaxRoutes',
    outputs: 'DiscoveredRoutes, FormSignatures'
  },
  {
    id: 'AGT-FINGERPRINT',
    name: 'Agente Fingerprint',
    engine: 'CH-TECH',
    role: 'Reconhecimento passivo de frameworks, CMS, web servers e tecnologias',
    confidence: 0.94,
    decisions: ['Assinaturas heurísticas em headers e DOM', 'Detecção de Nginx, React, WordPress'],
    inputs: 'HTTP Responses, Cookies, HTML Tags',
    outputs: 'TechnologyStackProfile'
  },
  {
    id: 'AGT-DISCOVERY',
    name: 'Agente Discovery',
    engine: 'CH-CONTENT',
    role: 'Sondagem de consoles de administração, Swagger, Git e arquivos sensíveis',
    confidence: 0.93,
    decisions: ['Detecção de .env exposto', 'Verificação de repositórios .git abertos'],
    inputs: 'RouteList, SensitiveWordlist',
    outputs: 'ExposedContentFindings'
  },
  {
    id: 'AGT-DETECTION',
    name: 'Agente Detection',
    engine: 'CH-DETECT',
    role: 'Avaliação de árvores de regras declarativas para identificação de falhas',
    confidence: 0.91,
    decisions: ['Trigger de hipóteses de vulnerabilidade', 'Envio imediato para Agente de Validação'],
    inputs: 'DiscoveredEndpoints, TechStack',
    outputs: 'VulnerabilityHypotheses'
  },
  {
    id: 'AGT-VALIDATION',
    name: 'Agente Validation',
    engine: 'CH-VERIFY',
    role: 'Triangulação diferencial de hipóteses e confirmação de anomalias',
    confidence: 0.98,
    decisions: ['Baseline vs Controle vs Teste', 'Descarte ativo de anomalias sem comprovação'],
    inputs: 'VulnerabilityHypotheses',
    outputs: 'ValidatedFindings'
  },
  {
    id: 'AGT-FP-REJECT',
    name: 'Agente False Positive Rejector',
    engine: 'CH-VERIFY',
    role: 'Filtro semântico de ruído de WAF, Soft 404 e respostas estáticas',
    confidence: 0.96,
    decisions: ['Rejeição de páginas falsas de sucesso', 'Classificação de honeypots e WAF challenges'],
    inputs: 'ValidationResults',
    outputs: 'CleanFindingsList'
  },
  {
    id: 'AGT-CORRELATION',
    name: 'Agente Correlation',
    engine: 'CH-CORRELATE',
    role: 'Fusão de inteligência no grafo e deduplicação de vulnerabilidades',
    confidence: 0.95,
    decisions: ['Unificação de múltiplos vetores para o mesmo ativo', 'Construção da árvore de ataque'],
    inputs: 'CleanFindingsList, AssetGraph',
    outputs: 'UnifiedAttackSurfaceGraph'
  },
  {
    id: 'AGT-CWE',
    name: 'Agente CWE',
    engine: 'CH-CWE',
    role: 'Enquadramento oficial na taxonomia MITRE CWE Top 25',
    confidence: 0.98,
    decisions: ['Mapeamento de CWE-200, CWE-79, CWE-89, CWE-918'],
    inputs: 'CorrelatedFindings',
    outputs: 'ClassifiedFindings (CWE Enriched)'
  },
  {
    id: 'AGT-OWASP',
    name: 'Agente OWASP',
    engine: 'CH-OWASP',
    role: 'Mapeamento nos critérios regulatórios do OWASP Top 10 e ASVS',
    confidence: 0.98,
    decisions: ['Classificação em A01 (Broken Access Control), A05 (Misconfiguration)'],
    inputs: 'ClassifiedFindings',
    outputs: 'RegulatoryComplianceMatrix'
  },
  {
    id: 'AGT-IMPACT',
    name: 'Agente Impact',
    engine: 'CH-IMPACT',
    role: 'Cálculo de vetor CVSS v3.1 e determinação de risco ao negócio',
    confidence: 0.97,
    decisions: ['Cálculo matemático de Base Score, Temporal e Risco Ponderado'],
    inputs: 'ClassifiedFindings, AssetCriticality',
    outputs: 'RiskScores, CVSSVectors'
  },
  {
    id: 'AGT-EVIDENCE',
    name: 'Agente Evidence',
    engine: 'CH-EVIDENCE',
    role: 'Sanitização rigorosa de tokens e montagem de PoCs auditáveis',
    confidence: 1.0,
    decisions: ['Substituição de senhas/tokens por [REDACTED]', 'Montagem de cURL reprodutível'],
    inputs: 'RawRequests, RawResponses',
    outputs: 'SanitizedEvidenceChain'
  },
  {
    id: 'AGT-REPORT',
    name: 'Agente Report',
    engine: 'CH-REPORT',
    role: 'Geração de relatórios executivos e técnicos em múltiplos formatos',
    confidence: 0.99,
    decisions: ['Compilação de Markdown, HTML interativo, JSON e JSONL'],
    inputs: 'UnifiedCampaignState',
    outputs: 'FinalReports'
  },
  {
    id: 'AGT-LOCAL-AI',
    name: 'Agente de IA Local',
    engine: 'CH-OLLAMA (Local/Opcional)',
    role: 'Síntese contextual com modelos locais de LLM (Ollama)',
    confidence: 0.90,
    decisions: ['Resumo executivo em linguagem natural', 'Operação 100% offline se habilitado'],
    inputs: 'FindingContext',
    outputs: 'ExecutiveSummaryText'
  }
];

export default function AgentsCatalogView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  const filteredAgents = FULL_AGENTS_DATA.filter(agent => {
    return agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agent.engine.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Catálogo dos 18 Agentes Especializados</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Arquitetura multi-agente autoral operando em grafo DAG sem dependência de scanners externos.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar agente ou motor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {agent.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {agent.engine}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition">
                {agent.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {agent.role}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[11px]">Confiança Média:</span>
              <span className="text-emerald-400 font-bold">{Math.round(agent.confidence * 100)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes do Agente */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">{selectedAgent.id}</span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{selectedAgent.name}</h3>
                <span className="text-xs font-mono text-slate-400">Motor: {selectedAgent.engine}</span>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-mono block text-[11px]">Função & Responsabilidade:</span>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 mt-1">
                  {selectedAgent.role}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-mono block text-[11px]">Entradas / Inputs:</span>
                <code className="text-cyan-300 font-mono block bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-1">
                  {selectedAgent.inputs}
                </code>
              </div>

              <div>
                <span className="text-slate-500 font-mono block text-[11px]">Saídas / Outputs:</span>
                <code className="text-emerald-300 font-mono block bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-1">
                  {selectedAgent.outputs}
                </code>
              </div>

              <div>
                <span className="text-slate-500 font-mono block text-[11px]">Regras de Decisão Autônomas:</span>
                <ul className="list-disc list-inside text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 mt-1 space-y-1">
                  {selectedAgent.decisions.map((d: string, idx: number) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
