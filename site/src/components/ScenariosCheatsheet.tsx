import React, { useState } from 'react';
import { Zap, Copy, Check, Terminal, Code2, Smartphone, ShieldCheck, ExternalLink } from 'lucide-react';
import { SCENARIOS, FULL_AUTOMATION_SCRIPT, EXTENSION_DETECTOR_CODE } from '../data/scenariosData';

export default function ScenariosCheatsheet() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cenarios' | 'script' | 'detector' | 'termux-zap'>('cenarios');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="receitas" className="py-16 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>CAPÍTULOS 7, 10, 14, 20 & 26 • CHEATSHEET PRÁTICO</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Cenários, Automação & Extensibilidade
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Comandos prontos para cada situação de auditoria, scripts bash de automação completa e guias de integração avançada.
            </p>
          </div>

          {/* Navigation sub-tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('cenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'cenarios' ? 'bg-violet-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Receitas Rápidas
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'script' ? 'bg-violet-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              full_scan.sh (Bash)
            </button>
            <button
              onClick={() => setActiveTab('detector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'detector' ? 'bg-violet-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Criar Novo Detector (Python)
            </button>
            <button
              onClick={() => setActiveTab('termux-zap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'termux-zap' ? 'bg-violet-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ZAP & Nuclei no Termux
            </button>
          </div>
        </div>

        {/* Tab 1: Scenarios Grid */}
        {activeTab === 'cenarios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENARIOS.map(sc => (
              <div
                key={sc.id}
                className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {sc.category}
                    </span>
                    <div className="flex gap-1">
                      {sc.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-mono text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm mb-1">{sc.title}</h4>
                  <p className="text-xs text-slate-400 mb-3">{sc.explanation}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="text-emerald-400 truncate text-[11px]">{sc.command}</span>
                  <button
                    onClick={() => handleCopy(sc.id, sc.command)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
                    title="Copiar comando"
                  >
                    {copiedId === sc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Full Scan Script */}
        {activeTab === 'script' && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Script Bash de Recon + Validação + HackerOne (full_scan.sh)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automação ponta a ponta: descobre subdomínios (Subfinder), testa portas vivas (Httpx), roda Nuclei e gera rascunho com o cwe-discover.
                </p>
              </div>
              <button
                onClick={() => handleCopy('script', FULL_AUTOMATION_SCRIPT)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
              >
                {copiedId === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'script' ? 'Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
              {FULL_AUTOMATION_SCRIPT}
            </pre>
            <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="text-cyan-400 font-bold">$ chmod +x full_scan.sh && ./full_scan.sh alvo.com</span>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Detector Code */}
        {activeTab === 'detector' && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  Como Criar um Novo Detector Passivo em Python
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Basta herdar de <code className="text-cyan-300">BaseDetector</code> e registrar o arquivo em <code className="text-cyan-300">detectors/</code>.
                </p>
              </div>
              <button
                onClick={() => handleCopy('detector', EXTENSION_DETECTOR_CODE)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
              >
                {copiedId === 'detector' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'detector' ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
              {EXTENSION_DETECTOR_CODE}
            </pre>
          </div>
        )}

        {/* Tab 4: Termux, Nuclei & ZAP Setup */}
        {activeTab === 'termux-zap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nuclei Box */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Instalação do Nuclei no Termux
                </h4>
                <button
                  onClick={() => handleCopy('termux-nuclei', 'pkg install golang -y\ngo install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest\nexport PATH=$PATH:~/go/bin\nnuclei -update-templates')}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300"
                  title="Copiar comandos"
                >
                  {copiedId === 'termux-nuclei' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`# 1. Instalar Go no Termux
pkg install golang -y

# 2. Instalar o Nuclei
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 3. Adicionar bin ao PATH
export PATH=$PATH:~/go/bin

# 4. Atualizar templates
nuclei -update-templates`}
              </pre>
            </div>

            {/* OWASP ZAP Box */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  OWASP ZAP Headless no Termux
                </h4>
                <button
                  onClick={() => handleCopy('termux-zap', 'pkg install openjdk-11 -y\nmkdir ~/zap && cd ~/zap\nwget https://github.com/zaproxy/zaproxy/releases/download/v2.14.0/ZAP_2.14.0_Linux.tar.gz\ntar -xzf ZAP_2.14.0_Linux.tar.gz\nmv ZAP_2.14.0 zap')}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300"
                  title="Copiar comandos"
                >
                  {copiedId === 'termux-zap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
{`# 1. Instalar OpenJDK 11
pkg install openjdk-11 -y

# 2. Baixar ZAP Linux
mkdir ~/zap && cd ~/zap
wget https://github.com/zaproxy/zaproxy/releases/download/v2.14.0/ZAP_2.14.0_Linux.tar.gz
tar -xzf ZAP_2.14.0_Linux.tar.gz
mv ZAP_2.14.0 zap

# 3. Executar scan rápido em modo headless (-cmd)
./zap/zap.sh -cmd -quickurl https://alvo.com -quickout report.html`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
