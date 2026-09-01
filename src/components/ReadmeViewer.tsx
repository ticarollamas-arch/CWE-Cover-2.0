import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Bot, 
  BookOpen,
  GitBranch,
  Github
} from 'lucide-react';

const RAW_README_CONTENT = `# 🛡️ cwe-discover

> **Intelligent Passive Reconnaissance, Deterministic CWE Mapping & Bug Bounty Triage Suite**  
> *Zero Hostile Payloads • Zero Cloudflare/WAF Ban Risk • Native Termux & Linux Support • CrewAI Multi-Agent Ready*  
>
> **Website:** https://cyberhuntlab.com.br/

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg?style=flat-square&logo=python)](https://python.org)
[![Platform](https://img.shields.io/badge/platform-Termux%20%7C%20Linux%20%7C%20macOS%20%7C%20Docker-emerald.svg?style=flat-square)](https://github.com/ticarollamas-arch/CWE-Cover-2.0)
[![License](https://img.shields.io/badge/license-MIT-purple.svg?style=flat-square)](LICENSE)
[![MITRE CWE](https://img.shields.io/badge/taxonomy-MITRE%20CWE-cyan.svg?style=flat-square)](https://cwe.mitre.org)
[![Bug Bounty](https://img.shields.io/badge/bounty-HackerOne%20%7C%20Bugcrowd-orange.svg?style=flat-square)](https://hackerone.com)
[![AI Integration](https://img.shields.io/badge/AI%20Agents-CrewAI%20%7C%20Gemini-pink.svg?style=flat-square)](https://crewai.com)

---

## 📖 Visão Geral & Filosofia

O **cwe-discover** é uma suite de reconhecimento web passivo e mapeamento de superfície de ataque projetada para **pesquisadores de segurança, caçadores de recompensas (bug bounty) e auditores de AppSec**.

Diferente de scanners ativos tradicionais que disparam milhares de injeções e acabam bloqueados por WAFs (Cloudflare, Akamai), o **cwe-discover** adota uma abordagem estritamente passiva e cirúrgica:

1. **Reconhecimento Passivo e Não Intrusivo**: Analisa links, formulários DOM, cabeçalhos de resposta HTTP, \`robots.txt\`, \`sitemap.xml\` e referências de API sem disparar payloads de ataque.
2. **Classificação Determinística por CWE**: Mapeia anomalias para os padrões formais do **MITRE CWE** (CWE-693, CWE-200, CWE-22, CWE-352, CWE-615).
3. **Motor Matemático de Risk Score**: Cada achado recebe uma pontuação calculada por \`Risk Score = Severity × Confidence\`, ordenando automaticamente as falhas mais críticas no topo.
4. **Relatórios Prontos para Submissão**: Exporta rascunhos estruturados para **HackerOne**, **Bugcrowd VRT**, Markdown, HTML visual, JSON e CSV.
5. **Pipeline Multiagente Evidence-First (\`--agents\`)**: 9 agentes internos (Orchestrator, Recon, HTTP/CWE/OWASP Analyst, Validation, False-Positive, Impact, Report) só confirmam um achado com evidência reproduzível dentro do escopo autorizado.
6. **Automação Multi-Agente com CrewAI**: Saída estruturada ideal para ser consumida por enxames de agentes de Inteligência Artificial autônomos externos.

---

## 🚀 Instalação Rápida de Todas as Dependências

### 1. Android (Termux) — 100% Otimizado para Mobile
\`\`\`bash
# 1. Atualizar repositórios do Termux
pkg update && pkg upgrade -y

# 2. Instalar ferramentas base e interpretadores
pkg install -y git python python-pip curl wget

# 3. Clonar o repositório oficial
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0

# 4. Instalar as dependências Python
pip install --upgrade pip
pip install requests beautifulsoup4 urllib3 rich tabulate
\`\`\`

### 2. Linux (Ubuntu / Debian / Kali)
\`\`\`bash
# Instalar pacotes de sistema
sudo apt update && sudo apt install -y python3 python3-pip python3-venv git curl wget

# Clonar e configurar ambiente virtual
git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install --upgrade pip
pip install -r cli/requirements.txt
\`\`\`

---

## 🧩 Pipeline Multiagente Evidence-First (interno, \`--agents\`)

Além da automação externa via CrewAI (seção abaixo), o próprio \`cwe_discover.py\` agora inclui um pacote \`agents/\` opcional com 9 agentes especializados que reprocessam os achados do scanner antes de qualquer coisa ser chamada de "confirmada":

**Orchestrator** (autorização + escopo) → **Recon** → **HTTP Analyst** → **CWE Analyst** → **OWASP Analyst** → **Validation Agent** → **False-Positive Analyst** → **Impact Analyst** → **Report Agent**

> Princípio: **Evidência primeiro. Classificação depois. Conclusão por último.**

Escada de status: \`INFO → OBSERVATION → HYPOTHESIS → POTENTIAL → CONFIRMED\` (com \`NOT_CONFIRMED\`, \`FALSE_POSITIVE\` e \`INSUFFICIENT_EVIDENCE\` como desvios). Sem um \`--scope-file\`, o escopo é \`SCOPE_UNKNOWN\` e **nada** pode virar \`CONFIRMED\`.

\`\`\`bash
python cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization \\
  --agents --mode safe --scope-file examples/scope_example.json \\
  -o relatorio.md --agents-output relatorio_agentes.md
\`\`\`

| Flag | Descrição |
|---|---|
| \`--agents\` | Ativa o pipeline multiagente (opcional; sem ela, nada muda) |
| \`--scope-file\` | JSON de escopo/autorização (\`target\`, \`allowed_domains\`, \`authorization\`, \`exclusions\`...) |
| \`--mode\` | \`passive\` (default) / \`safe\` / \`authorized_active\` / \`lab\` |
| \`--agents-output\` | Caminho do relatório multiagente (default: \`<output>_agents.md\`) |

---

## 🤖 Automação Multi-Agente com CrewAI & cwe-discover

\`\`\`bash
pip install crewai crewai-tools langchain-google-genai pydantic
\`\`\`

\`\`\`python
# crew_recon.py - Enxame de Agentes de Triagem
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
import subprocess

@tool("Run cwe-discover")
def run_cwe_discover(target_url: str) -> str:
    """Executa varredura passiva com cwe-discover em formato JSON."""
    subprocess.run(["python", "cwe_discover.py", "-u", target_url, "--i-have-authorization", "--format", "json", "-o", "scan.json"], check=True)
    with open("scan.json", "r") as f:
        return f.read()

recon_analyst = Agent(
    role="AppSec Reconnaissance & Triage Specialist",
    goal="Analyze passive security telemetry and prioritize critical CWE risks",
    backstory="Senior AppSec researcher specialized in MITRE CWE classification.",
    tools=[run_cwe_discover],
    verbose=True
)

report_writer = Agent(
    role="Senior Bug Bounty Report Writer",
    goal="Draft high-impact vulnerability submissions for HackerOne",
    backstory="Expert in crafting reproducible bug bounty reports with curl PoCs.",
    verbose=True
)

task1 = Task(description="Run scan on {target_url} and rank CWE risks.", expected_output="CWE risk summary.", agent=recon_analyst)
task2 = Task(description="Draft a full HackerOne markdown report.", expected_output="HackerOne ready report.", agent=report_writer)

crew = Crew(agents=[recon_analyst, report_writer], tasks=[task1, task2], process=Process.sequential)
result = crew.kickoff(inputs={"target_url": "https://alvo-autorizado.com"})
print(result)
\`\`\`
`;

export default function ReadmeViewer() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw' | 'github-push'>('preview');

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_README_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([RAW_README_CONTENT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="readme-export" className="py-16 border-b border-slate-800/80 bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
              <Github className="w-3.5 h-3.5" />
              <span>EXPORTAÇÃO & DOCUMENTAÇÃO GITHUB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              README.md Oficial & Guia de Exportação
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Documento completo formatado para repositórios GitHub com badges, guia de instalação nos ambientes suportados (Linux, Termux) e arquitetura autoral de agentes.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-800 hover:border-slate-700 transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'README Copiado!' : 'Copiar README.md'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Baixar README.md</span>
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
                activeTab === 'preview' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visualização Renderizada
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
                activeTab === 'raw' ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Código Raw Markdown
            </button>
            <button
              onClick={() => setActiveTab('github-push')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
                activeTab === 'github-push' ? 'bg-slate-800 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comandos de Git Push
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Pronto para <code className="text-slate-400">github.com</code>
          </span>
        </div>

        {/* Tab Contents */}
        {activeTab === 'preview' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 text-slate-300 text-sm leading-relaxed">
            
            {/* Header & Badges */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 font-mono">cwe-discover</h3>
                  <p className="text-xs text-slate-400">Intelligent Passive Reconnaissance, Deterministic CWE Mapping & Bug Bounty Triage Suite</p>
                  <p className="text-xs font-mono text-cyan-400 mt-1">
                    Portal Oficial: <a href="https://cwe-discover.cyberhuntlab.com.br/" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">https://cwe-discover.cyberhuntlab.com.br/</a> • Website: <a href="https://cyberhuntlab.com.br" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">https://cyberhuntlab.com.br</a> • Repositório: <a href="https://github.com/ticarollamas-arch/CWE-Cover-2.0" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">https://github.com/ticarollamas-arch/CWE-Cover-2.0</a>
                  </p>
                </div>
              </div>

              {/* Badges preview */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-medium border border-blue-500/30">Python 3.8+</span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">Termux & Linux Native</span>
                <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-medium border border-purple-500/30">License: MIT</span>
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30">MITRE CWE Taxonomy</span>
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-medium border border-amber-500/30">HackerOne & Bugcrowd Ready</span>
                <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-300 text-xs font-mono font-medium border border-fuchsia-500/30">Pipeline Multiagente (--agents)</span>
                <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-mono font-medium border border-pink-500/30">CrewAI Multi-Agent AI</span>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-xs mb-1">01 • ZERO BAN RISK</div>
                <h4 className="text-slate-200 font-semibold text-sm mb-1">Reconhecimento 100% Passivo</h4>
                <p className="text-slate-400 text-xs">Inspeção de cabeçalhos, formulários DOM e arquivos públicos sem disparar injeções de ataque.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-cyan-400 font-mono font-bold text-xs mb-1">02 • MITRE TAXONOMY</div>
                <h4 className="text-slate-200 font-semibold text-sm mb-1">Classificação por CWE</h4>
                <p className="text-slate-400 text-xs">Associação direta com CWE-693, CWE-200, CWE-22, CWE-352 e CWE-615 com cálculo de Risk Score.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-fuchsia-400 font-mono font-bold text-xs mb-1">03 • EVIDENCE-FIRST</div>
                <h4 className="text-slate-200 font-semibold text-sm mb-1">Pipeline Multiagente (--agents)</h4>
                <p className="text-slate-400 text-xs">9 agentes internos só confirmam um achado com evidência reproduzível e escopo autorizado — nunca por hipótese.</p>
              </div>
            </div>

            {/* Quick installation code */}
            <div className="space-y-2">
              <span className="font-mono text-xs text-slate-400 font-semibold block">⚡ Instalação Express no Termux ou Linux:</span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
{`git clone https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
cd CWE-Cover-2.0
pip install -r cli/requirements.txt
python cli/cwe_discover.py -u https://alvo-autorizado.com --i-have-authorization --format hackerone`}
              </pre>
            </div>

          </div>
        )}

        {activeTab === 'raw' && (
          <div className="relative">
            <textarea
              readOnly
              value={RAW_README_CONTENT}
              className="w-full h-96 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:border-cyan-500 resize-y"
            />
          </div>
        )}

        {activeTab === 'github-push' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs">
              <GitBranch className="w-4 h-4" />
              <span>GUIA DE PUBLICAÇÃO NO GITHUB</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-100">
              Como subir o projeto para seu repositório no GitHub
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-mono font-medium block mb-1">1. Inicializar git local e adicionar o README:</span>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
{`git init
git add README.md cli/ src/ package.json LICENSE
git commit -m "feat: initial commit of cwe-discover passive recon suite"`}
                </pre>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-mono font-medium block mb-1">2. Vincular com seu repositório remoto no GitHub:</span>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
{`git remote add origin https://github.com/ticarollamas-arch/CWE-Cover-2.0.git
git branch -M main
git push -u origin main`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
