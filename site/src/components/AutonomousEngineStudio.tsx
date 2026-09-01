import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Globe, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  Zap, 
  Database, 
  Code, 
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Server,
  Download,
  Filter
} from 'lucide-react';

interface SubdomainResult {
  subdomain: string;
  ip: string | null;
  active: boolean;
  sources: string[];
}

interface ProbeResult {
  url: string;
  status: number;
  title: string;
  server: string;
  responseTime: number;
  technologies: string[];
  missingHeaders: string[];
  presentHeaders: string[];
}

interface RuleItem {
  id: string;
  title: string;
  cwe: string;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  score: number;
  path: string;
  matchType: string;
  description: string;
}

const MOCK_SUBDOMAINS: SubdomainResult[] = [
  { subdomain: 'api.exemplo.com.br', ip: '104.21.48.12', active: true, sources: ['crt.sh', 'Wayback', 'OTX'] },
  { subdomain: 'auth.exemplo.com.br', ip: '172.67.190.5', active: true, sources: ['crt.sh', 'HackerTarget'] },
  { subdomain: 'admin.exemplo.com.br', ip: '198.51.100.42', active: true, sources: ['crt.sh', 'Wayback'] },
  { subdomain: 'vpn.exemplo.com.br', ip: '203.0.113.19', active: true, sources: ['HackerTarget'] },
  { subdomain: 'dev.exemplo.com.br', ip: '10.0.1.5', active: false, sources: ['crt.sh'] },
  { subdomain: 'staging.exemplo.com.br', ip: '198.51.100.99', active: true, sources: ['Wayback', 'OTX'] },
  { subdomain: 'mail.exemplo.com.br', ip: '192.0.2.25', active: true, sources: ['HackerTarget'] },
  { subdomain: 'cdn.exemplo.com.br', ip: '104.21.48.99', active: true, sources: ['crt.sh'] },
  { subdomain: 'grafana.exemplo.com.br', ip: '198.51.100.150', active: true, sources: ['crt.sh', 'Wayback'] },
  { subdomain: 'legacy-app.exemplo.com.br', ip: null, active: false, sources: ['Wayback'] }
];

const MOCK_PROBE_DATA: ProbeResult[] = [
  {
    url: 'https://api.exemplo.com.br',
    status: 200,
    title: 'Enterprise API Gateway v2.4',
    server: 'nginx/1.24.0',
    responseTime: 84,
    technologies: ['Nginx', 'Express.js', 'Node.js', 'Docker'],
    missingHeaders: ['Content-Security-Policy', 'X-Frame-Options'],
    presentHeaders: ['Strict-Transport-Security', 'X-Content-Type-Options']
  },
  {
    url: 'https://auth.exemplo.com.br',
    status: 200,
    title: 'Single Sign-On Identity Portal',
    server: 'cloudflare',
    responseTime: 42,
    technologies: ['Cloudflare', 'React', 'Tailwind CSS', 'OAuth2'],
    missingHeaders: ['Permissions-Policy'],
    presentHeaders: ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options']
  },
  {
    url: 'https://admin.exemplo.com.br',
    status: 403,
    title: '403 Forbidden - Internal Access Only',
    server: 'Apache/2.4.52 (Ubuntu)',
    responseTime: 120,
    technologies: ['Apache', 'PHP 8.2', 'Laravel'],
    missingHeaders: ['Content-Security-Policy', 'Referrer-Policy'],
    presentHeaders: ['Strict-Transport-Security']
  },
  {
    url: 'https://grafana.exemplo.com.br',
    status: 200,
    title: 'Grafana - Metrics Dashboard',
    server: 'Envoy',
    responseTime: 110,
    technologies: ['Grafana', 'Go', 'React', 'Prometheus'],
    missingHeaders: ['Content-Security-Policy'],
    presentHeaders: ['X-Frame-Options', 'X-Content-Type-Options']
  }
];

const NATIVE_RULES_CATALOG: RuleItem[] = [
  {
    id: 'cwe-200-env',
    title: 'Exposição de Arquivo .env / Credenciais',
    cwe: 'CWE-200',
    severity: 'ALTO',
    score: 8.0,
    path: '/.env',
    matchType: 'Status 200 + words (DB_PASSWORD, AWS_KEY)',
    description: 'Verifica exposição pública do arquivo de configuração .env em texto plano.'
  },
  {
    id: 'cwe-200-git',
    title: 'Repositório Git Exposto (.git/config)',
    cwe: 'CWE-200',
    severity: 'ALTO',
    score: 8.0,
    path: '/.git/config',
    matchType: 'Status 200 + words ([core], repositoryformatversion)',
    description: 'Valida se diretórios de controle de versão permitem download do código-fonte.'
  },
  {
    id: 'cwe-651-swagger',
    title: 'Catálogo de APIs Swagger / OpenAPI',
    cwe: 'CWE-651',
    severity: 'BAIXO',
    score: 3.0,
    path: '/swagger-ui.html',
    matchType: 'Status 200 + words (swagger-ui, openapi)',
    description: 'Identifica documentação de rotas e parâmetros REST expostos sem autenticação.'
  },
  {
    id: 'cwe-693-csp',
    title: 'Ausência de Content-Security-Policy',
    cwe: 'CWE-693',
    severity: 'MÉDIO',
    score: 5.0,
    path: '/',
    matchType: 'Negative Matcher (Header content-security-policy)',
    description: 'Audita cabeçalho defensivo essencial contra XSS e injeções de script.'
  },
  {
    id: 'cwe-22-traversal',
    title: 'Parâmetro de Path Traversal (?file=)',
    cwe: 'CWE-22',
    severity: 'ALTO',
    score: 7.5,
    path: '/download?file=../../../../etc/passwd',
    matchType: 'Regex (root:x:0:0) com filtro Soft-404',
    description: 'Verifica leitura arbitrária de arquivos do sistema eliminando falsos positivos.'
  },
  {
    id: 'cwe-352-csrf',
    title: 'Formulário POST Sem Token Anti-CSRF',
    cwe: 'CWE-352',
    severity: 'MÉDIO',
    score: 5.0,
    path: '/api/v1/user/settings',
    matchType: 'Form Analysis (No csrf/xsrf hidden field)',
    description: 'Detecta ações de escrita no backend sem validação de tokens de sincronismo.'
  }
];

export default function AutonomousEngineStudio() {
  const [activeModule, setActiveModule] = useState<'subdomains' | 'probe' | 'rules' | 'crawler' | 'code'>('subdomains');
  const [targetDomain, setTargetDomain] = useState('exemplo.com.br');
  const [subFilter, setSubFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [subSearch, setSubSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered subdomains
  const filteredSubdomains = useMemo(() => {
    return MOCK_SUBDOMAINS.filter(s => {
      const matchText = s.subdomain.toLowerCase().includes(subSearch.toLowerCase());
      if (subFilter === 'active') return matchText && s.active;
      if (subFilter === 'inactive') return matchText && !s.active;
      return matchText;
    });
  }, [subSearch, subFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="autonomous-suite" className="py-10 sm:py-16 bg-slate-950 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-400 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>SUITE 100% NATIVA • ZERO DEPENDÊNCIAS DE GO / BINÁRIOS EXTERNOS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              Arquitetura Autônoma Sem Ferramentas Externas
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
              Eliminamos completamente a dependência de <span className="text-rose-400 font-mono font-semibold">Subfinder</span>, <span className="text-rose-400 font-mono font-semibold">Nuclei</span>, <span className="text-rose-400 font-mono font-semibold">httpx</span> e <span className="text-rose-400 font-mono font-semibold">Katana</span>. Todos os motores rodam em Python puro nativo, com máxima velocidade, sem direitos autorais de terceiros.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Original & Open Source</span>
            </span>
          </div>
        </div>

        {/* Engine Module Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
          
          {/* Tab 1: Subdomain Recon */}
          <button
            onClick={() => setActiveModule('subdomains')}
            className={`p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between ${
              activeModule === 'subdomains'
                ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40 text-cyan-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">OSINT</span>
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-100">Subdomínios</div>
              <div className="text-[10px] sm:text-xs text-slate-400 truncate">Sem Subfinder</div>
            </div>
          </button>

          {/* Tab 2: HTTP Prober & Fingerprint */}
          <button
            onClick={() => setActiveModule('probe')}
            className={`p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between ${
              activeModule === 'probe'
                ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">HTTPX</span>
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-100">Prober & Tech</div>
              <div className="text-[10px] sm:text-xs text-slate-400 truncate">Sem httpx</div>
            </div>
          </button>

          {/* Tab 3: Matchers & Rules Engine */}
          <button
            onClick={() => setActiveModule('rules')}
            className={`p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between ${
              activeModule === 'rules'
                ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40 text-amber-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">RULES</span>
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-100">Regras Declarativas</div>
              <div className="text-[10px] sm:text-xs text-slate-400 truncate">Sem Nuclei</div>
            </div>
          </button>

          {/* Tab 4: JS & Route Crawler */}
          <button
            onClick={() => setActiveModule('crawler')}
            className={`p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between ${
              activeModule === 'crawler'
                ? 'bg-slate-900 border-purple-500/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40 text-purple-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">CRAWL</span>
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-100">JS & Rotas</div>
              <div className="text-[10px] sm:text-xs text-slate-400 truncate">Sem Katana/GAU</div>
            </div>
          </button>

          {/* Tab 5: Python Source Code */}
          <button
            onClick={() => setActiveModule('code')}
            className={`p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between ${
              activeModule === 'code'
                ? 'bg-slate-900 border-fuchsia-500/80 shadow-lg shadow-fuchsia-500/10 ring-1 ring-fuchsia-500/40 text-fuchsia-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileCode className="w-4 h-4 text-fuchsia-400" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-bold">SOURCE</span>
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-100">Código Nativo</div>
              <div className="text-[10px] sm:text-xs text-slate-400 truncate">Scripts em Python</div>
            </div>
          </button>

        </div>

        {/* Dynamic Interactive Module Panes */}
        <div className="bg-slate-900/80 rounded-xl sm:rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
          
          {/* 1. SUBDOMAINS MODULE PANE */}
          {activeModule === 'subdomains' && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Motor Nativo de Descoberta de Subdomínios (Subfinder Replacement)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Coleta passiva via Certificate Transparency (crt.sh), Wayback CDX API, AlienVault OTX e HackerTarget.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={subSearch}
                      onChange={(e) => setSubSearch(e.target.value)}
                      placeholder="Filtrar subdomínio..."
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                    <button
                      onClick={() => setSubFilter('all')}
                      className={`px-2 py-1 rounded ${subFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSubFilter('active')}
                      className={`px-2 py-1 rounded ${subFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
                    >
                      Ativos
                    </button>
                    <button
                      onClick={() => setSubFilter('inactive')}
                      className={`px-2 py-1 rounded ${subFilter === 'inactive' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'}`}
                    >
                      Inativos
                    </button>
                  </div>
                </div>
              </div>

              {/* Subdomain Explorer Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Subdomínio Encontrado</th>
                      <th className="p-2.5">Resolução DNS (IP)</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Fontes de Coleta OSINT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredSubdomains.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40 transition">
                        <td className="p-2.5 font-bold text-slate-100">
                          {sub.subdomain}
                        </td>
                        <td className="p-2.5 text-slate-300">
                          {sub.ip ? <code>{sub.ip}</code> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="p-2.5">
                          {sub.active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ATIVO (200/403)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px]">
                              INATIVO / SEM DNS
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="flex flex-wrap gap-1">
                            {sub.sources.map((src, sIdx) => (
                              <span key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-400">
                                {src}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CLI Command Example */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-bold mr-2">CLI Nativo:</span>
                  <code className="text-cyan-300">python cwe_discover.py -u {targetDomain} --subdomains --i-have-authorization</code>
                </div>
                <button
                  onClick={() => handleCopy(`python cwe_discover.py -u ${targetDomain} --subdomains --i-have-authorization`, 'sub-cli')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] transition flex items-center gap-1 shrink-0"
                >
                  {copiedCode === 'sub-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'sub-cli' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. HTTP PROBE & TECH FINGERPRINT PANE */}
          {activeModule === 'probe' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Prober HTTP & Fingerprinter de Tecnologias (HTTPX Replacement)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspeção assíncrona de status HTTP, headers de segurança (CWE-693), títulos de páginas e stack de tecnologias.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_PROBE_DATA.map((probe, pIdx) => (
                  <div key={pIdx} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            probe.status === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            probe.status === 403 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            HTTP {probe.status}
                          </span>
                          <span className="text-slate-500 text-xs font-mono">{probe.responseTime}ms</span>
                        </div>
                        <h4 className="font-mono font-bold text-slate-100 text-xs sm:text-sm mt-1 truncate max-w-xs sm:max-w-md">
                          {probe.url}
                        </h4>
                        <p className="text-slate-400 text-xs truncate">"{probe.title}"</p>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {probe.server}
                      </span>
                    </div>

                    {/* Tech Badges */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">Tecnologias Identificadas:</span>
                      <div className="flex flex-wrap gap-1">
                        {probe.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Security Headers Missing */}
                    <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Headers Faltantes (CWE-693):</span>
                      <div className="flex flex-wrap gap-1">
                        {probe.missingHeaders.map((mh, mIdx) => (
                          <span key={mIdx} className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px]">
                            {mh}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CLI Command Example */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-bold mr-2">CLI Nativo:</span>
                  <code className="text-emerald-300">python cwe_discover.py -u https://{targetDomain} --probe --i-have-authorization</code>
                </div>
                <button
                  onClick={() => handleCopy(`python cwe_discover.py -u https://${targetDomain} --probe --i-have-authorization`, 'probe-cli')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] transition flex items-center gap-1 shrink-0"
                >
                  {copiedCode === 'probe-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'probe-cli' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. NATIVE RULES & MATCHERS PANE */}
          {activeModule === 'rules' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Motor de Regras Declarativas & Matchers (Nuclei Replacement)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Catálogo nativo de regras em JSON/YAML com suporte a matchers por status, palavras-chave (AND/OR), regex e operadores negativos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {NATIVE_RULES_CATALOG.map((rule) => (
                  <div key={rule.id} className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-cyan-400">{rule.cwe}</span>
                        <span className={`px-2 py-0.2 text-[10px] font-mono font-bold rounded ${
                          rule.severity === 'ALTO' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          rule.severity === 'MÉDIO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {rule.severity} ({rule.score}.0)
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{rule.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-1">{rule.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-900 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-400">
                        <span>Path:</span>
                        <code className="text-amber-300">{rule.path}</code>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Lógica Matcher:</span>
                        <span className="text-slate-300 truncate max-w-[160px]">{rule.matchType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CLI Command Example */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-bold mr-2">CLI Nativo:</span>
                  <code className="text-amber-300">python cwe_discover.py -u https://{targetDomain} --rules --i-have-authorization</code>
                </div>
                <button
                  onClick={() => handleCopy(`python cwe_discover.py -u https://${targetDomain} --rules --i-have-authorization`, 'rule-cli')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] transition flex items-center gap-1 shrink-0"
                >
                  {copiedCode === 'rule-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'rule-cli' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. JS & CRAWLER PANE */}
          {activeModule === 'crawler' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Crawler de Rotas, Scripts JS & Parâmetros (Katana / GAU Replacement)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extração nativa de endpoints em tags HTML, scripts JS, rotas de API REST, formulários sem Anti-CSRF e mineração de parâmetros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Extracted API Routes */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">Rotas REST Identificadas</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">JS Extractor</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="p-1.5 rounded bg-slate-900 text-purple-300">/api/v2/auth/token</div>
                    <div className="p-1.5 rounded bg-slate-900 text-purple-300">/api/v1/users/export</div>
                    <div className="p-1.5 rounded bg-slate-900 text-purple-300">/admin/reports/download</div>
                    <div className="p-1.5 rounded bg-slate-900 text-purple-300">/graphql</div>
                  </div>
                </div>

                {/* Sensitive Parameters */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">Parâmetros Minerados</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">CWE-22 / SSRF</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="p-1.5 rounded bg-slate-900 text-amber-300">?file= (Path Traversal)</div>
                    <div className="p-1.5 rounded bg-slate-900 text-amber-300">?redirect= (Open Redirect)</div>
                    <div className="p-1.5 rounded bg-slate-900 text-amber-300">?token= (Auth Leak)</div>
                    <div className="p-1.5 rounded bg-slate-900 text-amber-300">?url= (SSRF Candidate)</div>
                  </div>
                </div>

                {/* Forms CSRF Analysis */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">Formulários & CSRF</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">CWE-352</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="p-1.5 rounded bg-slate-900 text-rose-300 flex items-center justify-between">
                      <span>POST /change-password</span>
                      <span className="text-[10px] text-red-400">Sem CSRF</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 text-emerald-300 flex items-center justify-between">
                      <span>POST /login</span>
                      <span className="text-[10px] text-emerald-400">CSRF OK</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 text-rose-300 flex items-center justify-between">
                      <span>POST /settings/update</span>
                      <span className="text-[10px] text-red-400">Sem CSRF</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CLI Command Example */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-bold mr-2">CLI Nativo:</span>
                  <code className="text-purple-300">python cwe_discover.py -u https://{targetDomain} --crawl-native --i-have-authorization</code>
                </div>
                <button
                  onClick={() => handleCopy(`python cwe_discover.py -u https://${targetDomain} --crawl-native --i-have-authorization`, 'crawl-cli')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] transition flex items-center gap-1 shrink-0"
                >
                  {copiedCode === 'crawl-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'crawl-cli' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. PYTHON SOURCE CODE ARCHITECTURE PANE */}
          {activeModule === 'code' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-fuchsia-400" />
                  <span>Estrutura dos Módulos Nativos Criados no Repositório</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arquivos independentes em Python 3 prontos para execução em Termux, Linux, macOS e Windows sem instalar Go.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Module 1 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">recon/subdomains.py</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">CT & OSINT</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Implementa a classe <code className="text-slate-200">NativeSubdomainFinder</code> com consultas assíncronas a crt.sh, Wayback CDX, HackerTarget e OTX com resolução DNS concorrente via socket.
                  </p>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-slate-300">
                    python recon/subdomains.py exemplo.com.br
                  </div>
                </div>

                {/* Module 2 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">recon/http_probe.py</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">HTTP & Tech</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Implementa a classe <code className="text-slate-200">NativeHttpProber</code> com identificação de mais de 15 stacks tecnológicas (Nginx, React, PHP, Laravel) e auditoria de Security Headers (CWE-693).
                  </p>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-slate-300">
                    python recon/http_probe.py https://exemplo.com.br
                  </div>
                </div>

                {/* Module 3 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">engine/matcher.py</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Declarative Rules</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Implementa o interpretador <code className="text-slate-200">NativeRuleEngine</code> capaz de processar regras declarativas de segurança sem precisar de binários externos ou Go.
                  </p>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-slate-300">
                    python engine/matcher.py https://exemplo.com.br
                  </div>
                </div>

                {/* Module 4 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">crawler/extractor.py</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">JS & Endpoints</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Implementa a classe <code className="text-slate-200">NativeEndpointCrawler</code> com extração de rotas em arquivos JavaScript, formulários sensíveis e detecção de tokens anti-CSRF.
                  </p>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-slate-300">
                    python crawler/extractor.py https://exemplo.com.br
                  </div>
                </div>

              </div>

              {/* All-in-One Autonomous Execution */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Executar Pipeline Completo 100% Autônomo
                  </span>
                  <span className="text-slate-400 text-[10px]">Zero Dependências</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 flex items-center justify-between">
                  <code className="truncate">python cwe_discover.py -u https://alvo.com --subdomains --probe --rules --crawl-native --i-have-authorization</code>
                  <button
                    onClick={() => handleCopy(`python cwe_discover.py -u https://alvo.com --subdomains --probe --rules --crawl-native --i-have-authorization`, 'all-cli')}
                    className="ml-2 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs transition shrink-0"
                  >
                    {copiedCode === 'all-cli' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
