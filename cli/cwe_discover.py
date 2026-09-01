#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cwe-discover • Suite Profissional de Triagem & Reconhecimento Passivo
Autor: Carol Lamas (CyberHuntLab)
Website: https://cwe-discover.cyberhuntlab.com.br
Blog: https://cyberhuntlab.com.br
Licença: MIT License
"""

import argparse
import sys
import os
import json
import csv
import time
import shutil
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Any, Optional

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    requests = None
    BeautifulSoup = None

# Import local agent pipeline
try:
    from agents.models import ScopeConfig, ScopeMode, FindingStatus
    from agents.pipeline import AgentPipeline
    from agents.report_agent import ReportAgent
except ImportError:
    try:
        from cli.agents.models import ScopeConfig, ScopeMode, FindingStatus
        from cli.agents.pipeline import AgentPipeline
        from cli.agents.report_agent import ReportAgent
    except ImportError:
        ScopeConfig = None
        AgentPipeline = None
        ReportAgent = None

# Import Packager & External Tool Integrator
try:
    from engine.packager import EvidencePackager, check_external_tool, audit_external_tools
except ImportError:
    try:
        from cli.engine.packager import EvidencePackager, check_external_tool, audit_external_tools
    except ImportError:
        EvidencePackager = None
        check_external_tool = None
        audit_external_tools = None

# Import 100% Native & Autonomous Engines (Zero Go/External Binary Dependencies)
try:
    from recon.subdomains import NativeSubdomainFinder
    from recon.http_probe import NativeHttpProber
    from engine.matcher import NativeRuleEngine
    from crawler.extractor import NativeEndpointCrawler
except ImportError:
    try:
        from cli.recon.subdomains import NativeSubdomainFinder
        from cli.recon.http_probe import NativeHttpProber
        from cli.engine.matcher import NativeRuleEngine
        from cli.crawler.extractor import NativeEndpointCrawler
    except ImportError:
        NativeSubdomainFinder = None
        NativeHttpProber = None
        NativeRuleEngine = None
        NativeEndpointCrawler = None

# Cores ANSI seguras e universais (Termux, Linux, macOS, WSL)
GREEN = "\033[1;32m"
CYAN = "\033[1;36m"
YELLOW = "\033[1;33m"
RED = "\033[1;31m"
GRAY = "\033[0;90m"
BOLD = "\033[1m"
RESET = "\033[0m"

# BANNER COMPACTO 3D (LARGURA FIXA: 40 COLUNAS - ZERO QUEBRA NO MOBILE)
BANNER = f"""{CYAN}
 ┌──────────────────────────────────────┐
 │ {GREEN}█▀▀ █░█░█ █▀▀{CYAN} ─ {YELLOW}DISCOVER{CYAN} v2.0          │
 │ {GREEN}█▄▄ ▀▄▀▄▀ ██▄{CYAN} ─ {GRAY}MITRE Triage Engine{CYAN}   │
 └──────────────────────────────────────┘{RESET}
 {GRAY}» Autor:{RESET} Carol Lamas {GRAY}(CyberHuntLab){RESET}
 {GRAY}» Site:{RESET}  https://cyberhuntlab.com.br
"""

CWE_DATABASE = {
    "CWE-693": {
        "title": "Mecanismos de Proteção Ausentes (Security Headers)",
        "severity": "MEDIUM",
        "weight": 5.0,
        "impact": "Aumenta a exposição a enquadramento de tela (clickjacking) e ataques de injeção em contextos vulneráveis.",
        "mitigation": "Configurar cabeçalhos HSTS com preload, Content-Security-Policy, X-Frame-Options e X-Content-Type-Options."
    },
    "CWE-200": {
        "title": "Exposição de Informações Sensíveis / Vazamento de Metadados",
        "severity": "LOW",
        "weight": 3.0,
        "impact": "Facilita o reconhecimento de versões e tecnologias por atacantes para busca de exploits públicos.",
        "mitigation": "Desabilitar cabeçalhos Server e X-Powered-By desnecessários e remover arquivos de configuração (.env, .git)."
    },
    "CWE-22": {
        "title": "Indício de Manipulação de Caminho ('Path Traversal')",
        "severity": "HIGH",
        "weight": 7.5,
        "impact": "Potencial leitura de arquivos sensíveis do servidor caso parâmetros sejam repassados sem sanitização.",
        "mitigation": "Utilizar whitelists estritas para parâmetros de arquivos e restringir acesso direto ao filesystem."
    },
    "CWE-352": {
        "title": "Formulário Vulnerável a Cross-Site Request Forgery (CSRF)",
        "severity": "MEDIUM",
        "weight": 6.0,
        "impact": "Possibilidade de submissão não autorizada de ações por usuários autenticados via requisições cross-origin.",
        "mitigation": "Implementar tokens Anti-CSRF criptográficos em todas as requisições de alteração de estado (POST/PUT/DELETE)."
    },
    "CWE-615": {
        "title": "Comentários ou Arquivos com Informações Sensíveis",
        "severity": "LOW",
        "weight": 2.5,
        "impact": "Vazamento de notas internas de desenvolvimento ou endpoints de API não documentados no DOM.",
        "mitigation": "Limpar comentários e notas de depuração nos scripts de build para o ambiente de produção."
    }
}


class CWEDiscover:
    def __init__(
        self,
        target_url: str,
        max_depth: int = 2,
        max_urls: int = 60,
        delay: float = 0.2,
        verbose: bool = False,
        platform: Optional[str] = None,
        scope_file: Optional[str] = None,
        run_agents: bool = False,
        agents_output: Optional[str] = None,
        ai_narrative: bool = False,
    ):
        self.target_url = target_url.rstrip('/')
        self.domain = urlparse(self.target_url).netloc
        self.max_depth = max_depth
        self.max_urls = max_urls
        self.delay = delay
        self.verbose = verbose
        self.platform = platform
        self.scope_file = scope_file
        self.run_agents = run_agents
        self.agents_output = agents_output or "scan_agents.json"
        self.ai_narrative = ai_narrative

        # Initialize Scope
        self.scope = self._load_scope()

        self.visited_urls = set()
        self.urls_queue = [(self.target_url, 0)]
        self.findings: List[Dict[str, Any]] = []
        self.headers_seen: Dict[str, Dict[str, str]] = {}
        self.execution_logs: List[str] = []
        self.packager = EvidencePackager(self.target_url) if EvidencePackager else None

        if requests is None or BeautifulSoup is None:
            print("[!] Dependências ausentes para execução do scanner. Execute: pip install requests beautifulsoup4")
            sys.exit(1)

        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 cwe-discover/2.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        })

    def _load_scope(self) -> Any:
        """Loads and parses ScopeConfig from scope-file or defaults to target domain."""
        if self.scope_file and os.path.exists(self.scope_file):
            try:
                with open(self.scope_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if ScopeConfig:
                    return ScopeConfig(
                        target=data.get("target", self.target_url),
                        allowed_domains=data.get("allowed_domains", [self.domain]),
                        authorization=data.get("authorization", True),
                        allowed_methods=data.get("allowed_methods", ["GET"]),
                        rate_limit_per_sec=data.get("rate_limit_per_sec", 1.0),
                        exclusions=data.get("exclusions", []),
                        platform=self.platform or data.get("platform"),
                        program=data.get("program"),
                        mode=ScopeMode.PASSIVE
                    )
            except Exception as e:
                if self.verbose:
                    print(f"{YELLOW}[!] Aviso: Erro ao carregar arquivo de escopo:{RESET} {e}")

        if ScopeConfig:
            return ScopeConfig(
                target=self.target_url,
                allowed_domains=[self.domain],
                authorization=True,
                allowed_methods=["GET"],
                platform=self.platform,
                mode=ScopeMode.PASSIVE
            )
        return None

    def run(self):
        print(BANNER)
        print(f"{CYAN}[*]{RESET} Alvo: {BOLD}{self.target_url}{RESET}")
        print(f"{CYAN}[*]{RESET} Escopo: {GRAY}{self.domain}{RESET} | Max Depth: {self.max_depth}")
        if self.platform:
            print(f"{CYAN}[*]{RESET} Contexto de Plataforma: {YELLOW}{self.platform.upper()}{RESET}")
        print(f"{CYAN}[*]{RESET} Validação Multi-Agente & Explainer PoC: {GREEN}ATIVADO{RESET}")
        print()

        start_time_str = time.strftime('%Y-%m-%d %H:%M:%S')
        self.execution_logs.append(f"[{start_time_str}] Início da varredura passiva em {self.target_url}")

        # 1. Auditoria passiva de cabeçalhos HTTP
        self.check_security_headers(self.target_url)

        # 2. Varredura de arquivos e metadados sensíveis comuns
        self.check_sensitive_files()

        # 3. Crawler passivo respeitando limites de escopo
        while self.urls_queue and len(self.visited_urls) < self.max_urls:
            url, depth = self.urls_queue.pop(0)
            if url in self.visited_urls or depth > self.max_depth:
                continue

            self.visited_urls.add(url)
            log_msg = f"Verificando: {url}"
            self.execution_logs.append(log_msg)
            if self.verbose:
                print(f"{GRAY}[+] [{len(self.visited_urls)}/{self.max_urls}] Verificando:{RESET} {url[:45]}...")

            try:
                time.sleep(self.delay)
                resp = self.session.get(url, timeout=7, allow_redirects=True)
                self.headers_seen[url] = dict(resp.headers)
                if "text/html" in resp.headers.get("Content-Type", ""):
                    soup = BeautifulSoup(resp.text, "html.parser")
                    self.analyze_dom(url, soup)

                    if depth < self.max_depth:
                        self.extract_links(soup, depth + 1)
            except Exception as e:
                err_msg = f"Falha na rota {url}: {str(e)}"
                self.execution_logs.append(err_msg)
                if self.verbose:
                    print(f"{RED}[!] Falha na rota:{RESET} {str(e)[:40]}")

        # 4. Processar achados pelo Pipeline de Validação & PoC Explainer
        processed_findings_dict: List[Dict[str, Any]] = self.findings
        pipeline_result = None

        if AgentPipeline and self.scope:
            pipeline = AgentPipeline(self.target_url, self.scope, self.platform)
            pipeline_result = pipeline.process(self.findings, list(self.visited_urls))
            processed_findings_dict = [f.to_dict() for f in pipeline_result.findings]
            self.findings = processed_findings_dict

        # 5. Gerar pacote de evidências estruturado e arquivo ZIP
        if self.packager:
            self.packager.setup_directories()

            # Exportar bugcrowd_triage.md e scan_agents.json para a pasta de execução
            bugcrowd_path = os.path.join(self.packager.run_dir, "bugcrowd_triage.md")
            scan_agents_path = os.path.join(self.packager.run_dir, "scan_agents.json")

            if pipeline_result:
                reporter = ReportAgent(pipeline_result)
                reporter.export_bugcrowd(bugcrowd_path)
                reporter.export_json(scan_agents_path)
            else:
                # Fallback manual export if pipeline not available
                with open(scan_agents_path, "w", encoding="utf-8") as f:
                    json.dump({
                        "target": self.target_url,
                        "platform": self.platform,
                        "total_urls": len(self.visited_urls),
                        "findings": processed_findings_dict
                    }, f, indent=2, ensure_ascii=False)
                self._export_markdown(bugcrowd_path)

            # Também exporta o agents_output se especificado no CLI
            if self.agents_output and self.agents_output != "scan_agents.json":
                try:
                    shutil.copy2(scan_agents_path, self.agents_output)
                except Exception:
                    pass

            # Finaliza a estrutura de pastas e gera o ZIP
            pkg_info = self.packager.finalize_package(
                list(self.visited_urls),
                processed_findings_dict,
                self.execution_logs
            )

            print(f"\n{GREEN}[✓] Varredura finalizada{RESET}")
            print(f"{GREEN}[✓]{RESET} Relatório Markdown: {BOLD}{pkg_info['bugcrowd_report']}{RESET}")
            print(f"{GREEN}[✓]{RESET} Relatório dos agentes: {BOLD}{pkg_info['scan_agents_json']}{RESET}")
            print(f"{GREEN}[✓]{RESET} Screenshots: {BOLD}{pkg_info['screenshots_dir']}{RESET}")
            print(f"{GREEN}[✓]{RESET} Evidências: {BOLD}{pkg_info['evidence_dir']}{RESET}")
            print(f"{GREEN}[✓]{RESET} POCs: {BOLD}{pkg_info['findings_dir']}{RESET}")
            print(f"{GREEN}[✓]{RESET} Pacote completo criado\n")

            print(f"{GREEN}[✓]{RESET} {BOLD}ZIP confirmado:{RESET}")
            print(f"    {CYAN}{pkg_info['abs_zip_path']}{RESET}")
            print(f"    {GRAY}Tamanho: {pkg_info['size_str']}{RESET}\n")
        else:
            print(f"\n{GREEN}[✓] Varredura finalizada!{RESET}")
            print(f"    • URLs auditadas: {len(self.visited_urls)}")
            print(f"    • Achados detectados: {len(self.findings)}\n")

        return self.findings

    def add_finding(self, cwe_id: str, url: str, confidence: float, evidence: str):
        cwe_info = CWE_DATABASE.get(cwe_id, {
            "title": "Anomalia de Segurança",
            "severity": "LOW",
            "weight": 2.0,
            "impact": "Exposição potencial de superfície de ataque.",
            "mitigation": "Seguir as boas práticas da taxonomia MITRE CWE."
        })

        # Precision adjustment: Avoid over-inflating generic Server headers
        if cwe_id == "CWE-200" and "server:" in evidence.lower() and not any(k in evidence.lower() for k in [".env", ".git", "password"]):
            confidence = min(0.45, confidence)

        risk_score = round(cwe_info["weight"] * confidence, 2)
        color = RED if cwe_info["severity"] == "HIGH" else YELLOW if cwe_info["severity"] == "MEDIUM" else CYAN

        print(f" {color}▶ [{cwe_info['severity']}] {cwe_id}:{RESET} {cwe_info['title'][:34]}")
        print(f"   {GRAY}↳ Risco: {risk_score}/10 | Confiança: {int(confidence*100)}%{RESET}")

        self.findings.append({
            "cwe_id": cwe_id,
            "title": cwe_info["title"],
            "severity": cwe_info["severity"],
            "confidence": confidence,
            "risk_score": risk_score,
            "url": url,
            "evidence": evidence,
            "impact": cwe_info["impact"],
            "mitigation": cwe_info["mitigation"],
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })

    def check_security_headers(self, url: str):
        try:
            resp = self.session.get(url, timeout=5)
            headers = resp.headers
            self.headers_seen[url] = dict(headers)

            required = [
                "Strict-Transport-Security",
                "Content-Security-Policy",
                "X-Frame-Options",
                "X-Content-Type-Options"
            ]
            missing = [h for h in required if h not in headers]
            if missing:
                self.add_finding("CWE-693", url, 0.90, f"Headers ausentes: {', '.join(missing)}")

            exposed = [f"{h}: {headers[h]}" for h in ["Server", "X-Powered-By", "X-AspNet-Version"] if h in headers]
            if exposed:
                self.add_finding("CWE-200", url, 0.45, f"Banners informativos expostos: {'; '.join(exposed)}")
        except Exception:
            pass

    def check_sensitive_files(self):
        targets = ["/robots.txt", "/.git/HEAD", "/.env"]
        for path in targets:
            try:
                full_url = urljoin(self.target_url, path)
                resp = self.session.get(full_url, timeout=3)
                if resp.status_code == 200 and len(resp.text) > 0:
                    if path == "/.env" and "=" in resp.text:
                        self.add_finding("CWE-200", full_url, 0.99, "Arquivo .env público contendo credenciais/chaves.")
                    elif path == "/.git/HEAD" and "ref:" in resp.text:
                        self.add_finding("CWE-200", full_url, 0.99, "Repositório .git exposto no diretório web.")
                    elif path == "/robots.txt":
                        self.add_finding("CWE-615", full_url, 0.60, "Arquivo robots.txt acessível contendo rotas do sistema.")
            except Exception:
                pass

    def analyze_dom(self, url: str, soup: BeautifulSoup):
        for form in soup.find_all("form"):
            if form.get("method", "get").upper() == "POST":
                inputs = form.find_all("input")
                has_csrf = any("csrf" in inp.get("name", "").lower() or "token" in inp.get("name", "").lower() for inp in inputs)
                if not has_csrf:
                    self.add_finding("CWE-352", url, 0.65, "Formulário POST detectado sem campo evidente de token Anti-CSRF.")

        for a in soup.find_all("a", href=True):
            href = a['href']
            if any(p in href.lower() for p in ["file=", "page=", "doc=", "path=", "template="]):
                self.add_finding("CWE-22", urljoin(url, href), 0.60, f"Parâmetro com padrão de manipulação de arquivo detectado: {href}")

        comments = soup.find_all(string=lambda text: isinstance(text, type(soup.string)) and text.strip().startswith("<!--"))
        for comment in comments:
            text = str(comment).lower()
            if any(k in text for k in ["todo", "fixme", "api_key", "password", "secret", "admin", "debug"]):
                self.add_finding("CWE-615", url, 0.80, f"Comentário de desenvolvimento no DOM: {str(comment)[:80]}...")

    def extract_links(self, soup: BeautifulSoup, next_depth: int):
        for link in soup.find_all("a", href=True):
            href = link['href']
            full_url = urljoin(self.target_url, href)
            parsed = urlparse(full_url)
            if parsed.netloc == self.domain:
                clean_url = parsed._replace(fragment="").geturl()
                if clean_url not in self.visited_urls and clean_url not in [u[0] for u in self.urls_queue]:
                    self.urls_queue.append((clean_url, next_depth))

    def export(self, output_path: str, format_type: str = "markdown"):
        self.findings.sort(key=lambda x: x["risk_score"], reverse=True)

        if format_type == "json":
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump({
                    "target": self.target_url,
                    "platform": self.platform,
                    "total_urls": len(self.visited_urls),
                    "total_findings": len(self.findings),
                    "findings": self.findings
                }, f, indent=2, ensure_ascii=False)
        elif format_type == "csv":
            with open(output_path, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=["cwe_id", "title", "severity", "risk_score", "url", "evidence", "mitigation"])
                writer.writeheader()
                for item in self.findings:
                    writer.writerow({k: item[k] for k in ["cwe_id", "title", "severity", "risk_score", "url", "evidence", "mitigation"]})
        elif format_type == "hackerone":
            self._export_hackerone(output_path)
        elif format_type == "html":
            self._export_html(output_path)
        else:
            self._export_markdown(output_path)

        print(f"{GREEN}[✓]{RESET} Relatório gerado em: {BOLD}{output_path}{RESET} ({format_type.upper()})")

    def _export_html(self, path: str):
        findings_html = ""
        for item in self.findings:
            sev_color = "#ef4444" if item['severity'] == "HIGH" else "#f59e0b" if item['severity'] == "MEDIUM" else "#06b6d4"
            findings_html += f"""
            <div style="background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:20px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="background:{sev_color}22; color:{sev_color}; border:1px solid {sev_color}66; padding:4px 10px; border-radius:6px; font-weight:bold; font-size:12px;">[{item['severity']}] {item['cwe_id']}</span>
                    <span style="color:#94a3b8; font-size:13px;">Score: <strong style="color:#f8fafc;">{item['risk_score']}/10</strong> (Confiança: {int(item['confidence']*100)}%)</span>
                </div>
                <h3 style="color:#f8fafc; margin:0 0 8px 0; font-size:18px;">{item['title']}</h3>
                <p style="color:#cbd5e1; font-size:14px; margin:4px 0;"><strong>URL Afetada:</strong> <code style="background:#020617; padding:2px 6px; border-radius:4px; color:#38bdf8;">{item['url']}</code></p>
                <p style="color:#cbd5e1; font-size:14px; margin:4px 0;"><strong>Evidência:</strong> {item['evidence']}</p>
                <div style="margin-top:12px; padding-top:12px; border-top:1px solid #1e293b; color:#94a3b8; font-size:13px;">
                    <p style="margin:2px 0;"><strong style="color:#f1f5f9;">Impacto:</strong> {item['impact']}</p>
                    <p style="margin:2px 0;"><strong style="color:#10b981;">Remediação:</strong> {item['mitigation']}</p>
                </div>
            </div>
            """

        html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Triagem CWE - {self.domain}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #020617; color: #f8fafc; margin: 0; padding: 24px; }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        .header {{ background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 24px; }}
        .badge {{ background: #10b98122; color: #10b981; border: 1px solid #10b98155; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="badge">CWE-DISCOVER v2.0</span>
            <h1 style="margin: 12px 0 6px 0; color:#38bdf8;">Relatório Executivo de Triagem CWE</h1>
            <p style="color: #94a3b8; margin: 0 0 16px 0;">Alvo: <strong>{self.target_url}</strong> | Plataforma: <strong>{self.platform or 'Padrão / Privada'}</strong> | Gerado em: {time.strftime('%Y-%m-%d %H:%M:%S')}</p>
            <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:14px; color:#cbd5e1;">
                <div>URLs Auditadas: <strong>{len(self.visited_urls)}</strong></div>
                <div>Achados de Segurança: <strong style="color:#f59e0b;">{len(self.findings)}</strong></div>
                <div>Autor: <strong>Carol Lamas (CyberHuntLab)</strong></div>
            </div>
        </div>
        <h2>Vulnerabilidades & Anomalias Identificadas</h2>
        {findings_html if self.findings else '<p style="color:#10b981;">Nenhuma vulnerabilidade ou anomalia evidente identificada na amostragem passiva.</p>'}
    </div>
</body>
</html>"""
        with open(path, "w", encoding="utf-8") as f:
            f.write(html_content)

    def _export_markdown(self, path: str):
        with open(path, "w", encoding="utf-8") as f:
            f.write(f"# 🛡️ Relatório de Triagem CWE — {self.domain}\n\n")
            f.write(f"- **Alvo:** `{self.target_url}`\n")
            f.write(f"- **Plataforma / Programa:** `{self.platform or 'Custom / Bug Bounty Privado'}`\n")
            f.write(f"- **Data:** `{time.strftime('%Y-%m-%d %H:%M:%S')}`\n")
            f.write(f"- **Total de URLs Auditadas:** `{len(self.visited_urls)}`\n")
            f.write(f"- **Achados Identificados:** `{len(self.findings)}`\n\n---\n\n")
            for item in self.findings:
                f.write(f"### [{item['severity']}] {item['cwe_id']} — {item['title']}\n")
                f.write(f"- **Pontuação de Risco:** `{item['risk_score']} / 10.0` (Confiança: {int(item['confidence']*100)}%)\n")
                f.write(f"- **URL Afetada:** `{item['url']}`\n")
                f.write(f"- **Evidência:** `{item['evidence']}`\n")
                f.write(f"- **Impacto de Negócio:** {item['impact']}\n")
                f.write(f"- **Remediação Recomendada:** {item['mitigation']}\n\n---\n\n")

    def _export_hackerone(self, path: str):
        with open(path, "w", encoding="utf-8") as f:
            f.write(f"# Vulnerability Triage Report — {self.domain}\n\n")
            f.write(f"**Program / Platform:** {self.platform or 'HackerOne'}\n\n")
            f.write(f"## Summary\nTriagem automatizada via ferramenta passiva **cwe-discover** desenvolvida por Carol Lamas (CyberHuntLab).\n\n")
            f.write(f"## Steps To Reproduce\n")
            for idx, item in enumerate(self.findings[:5], 1):
                f.write(f"{idx}. Acessar o endpoint `{item['url']}`.\n")
                f.write(f"   - Anomalia identificada: {item['evidence']}\n")
                f.write(f"   - Classificação: **{item['cwe_id']}** ({item['title']})\n\n")
            f.write(f"## Impact\nA ausência de controles e a exposição de metadados aumentam a superfície de ataque para adversários.\n\n")
            f.write(f"## Remediation Guidance\nImplementar os cabeçalhos de segurança da OWASP e validações de Anti-CSRF no backend.\n")


def main():
    parser = argparse.ArgumentParser(
        description="cwe-discover 2.0: Reconhecimento Passivo, Mapeamento MITRE CWE & Triagem Multi-Agente (CyberHuntLab)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Exemplos de uso:
  1. Scan básico passivo:
     python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization

  2. Scan com contexto de plataforma Bug Bounty:
     python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization --platform hackerone --format markdown -o report.md

  3. Scan com Pipeline Multi-Agente Evidence-First:
     python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization --platform bugcrowd --scope-file examples/scope_example.json --agents --format json -o scan.json
"""
    )

    parser.add_argument("-u", "--url", required=True, help="URL base do alvo autorizado")
    parser.add_argument("--i-have-authorization", action="store_true", required=True, help="Confirmação de autorização legal e ética do operador")
    parser.add_argument("--platform", type=str, default=None, help="Nome da plataforma/programa de Bug Bounty para contexto de triagem (ex: hackerone, bugcrowd, intigriti)")
    parser.add_argument("--scope-file", type=str, default=None, help="Caminho para arquivo JSON de definição de escopo")
    parser.add_argument("--agents", action="store_true", help="Ativa o pipeline multi-agente evidence-first de validação e triagem")
    parser.add_argument("--agents-output", type=str, default="scan_agents.json", help="Arquivo de saída estruturado dos agentes (Default: scan_agents.json)")
    parser.add_argument("--subdomains", action="store_true", help="Executa motor nativo de enumeração passiva de subdomínios (Subfinder-Free via CT Logs e OSINT)")
    parser.add_argument("--probe", action="store_true", help="Executa motor nativo de HTTP Probing e fingerprint de tecnologias (HTTPX-Free)")
    parser.add_argument("--rules", action="store_true", help="Executa motor nativo de regras e matchers declarativos de segurança (Nuclei-Free)")
    parser.add_argument("--crawl-native", action="store_true", help="Executa crawler nativo de rotas REST, formulários e scripts JS (Katana-Free)")
    parser.add_argument("--standalone-all", action="store_true", help="Executa toda a suite autônoma nativa completa (Subdomínios + Probing + Regras + Crawler)")
    parser.add_argument("--format", choices=["markdown", "hackerone", "json", "csv", "html"], default="markdown", help="Formato de exportação do relatório")
    parser.add_argument("-o", "--output", default="cwe_report.md", help="Arquivo de saída do relatório")
    parser.add_argument("--max-depth", type=int, default=2, help="Profundidade de navegação do crawler (Default: 2)")
    parser.add_argument("--max-urls", type=int, default=60, help="Limite de páginas a verificar (Default: 60)")
    parser.add_argument("--delay", type=float, default=0.2, help="Delay entre requisições em segundos (Anti-WAF)")
    parser.add_argument("--ai-narrative", action="store_true", help="Enriquecimento opcional da narrativa com modelo local Ollama sem alterar evidências")
    parser.add_argument("-v", "--verbose", action="store_true", help="Exibe logs detalhados durante o rastreamento")

    args = parser.parse_args()

    # 1. Native Subdomain Recon Mode (Subfinder Replacement)
    if (args.subdomains or args.standalone_all) and NativeSubdomainFinder:
        print(f"\n{CYAN}{BOLD}┌── [ MOTOR PASSIVO DE SUBDOMÍNIOS (OSINT NATIVO) ]{RESET}")
        print(f"{GRAY}│ Alvo:{RESET} {args.url}")
        finder = NativeSubdomainFinder(args.url)
        subs = finder.discover(resolve_active=True)
        active_subs = [s for s in subs if s['active']]
        print(f"{GRAY}│ Descobertos:{RESET} {len(subs)} subdomínios ({GREEN}{len(active_subs)} ativos com DNS resolvido{RESET})")
        for s in subs[:15]:
            status = f"{GREEN}ATIVO ({s['ip']}){RESET}" if s['active'] else f"{GRAY}INATIVO{RESET}"
            print(f"{GRAY}│  ├─{RESET} {s['subdomain']:<32} {status}")
        if len(subs) > 15:
            print(f"{GRAY}│  └─ ... e mais {len(subs) - 15} subdomínios identificados.{RESET}")
        print(f"{CYAN}└── [ Fim da Enumeração de Subdomínios ]{RESET}\n")

    # 2. Native HTTP Prober & Fingerprinter Mode (HTTPX Replacement)
    if (args.probe or args.standalone_all) and NativeHttpProber:
        print(f"\n{GREEN}{BOLD}┌── [ PROBER HTTP & FINGERPRINTING DE TECNOLOGIAS ]{RESET}")
        prober = NativeHttpProber()
        probe_res = prober.probe(args.url)
        print(f"{GRAY}│ Status:{RESET} HTTP {probe_res['status_code']} | {GRAY}Latência:{RESET} {probe_res['response_time_ms']}ms | {GRAY}Servidor:{RESET} {probe_res['server'] or 'Oculto'}")
        if probe_res['title']:
            print(f"{GRAY}│ Título:{RESET} {probe_res['title']}")
        if probe_res['technologies']:
            print(f"{GRAY}│ Tecnologias:{RESET} {', '.join(probe_res['technologies'])}")
        if probe_res['missing_security_headers']:
            missing_h = [h['name'] for h in probe_res['missing_security_headers']]
            print(f"{GRAY}│ Headers Faltantes (CWE-693):{RESET} {YELLOW}{', '.join(missing_h)}{RESET}")
        print(f"{GREEN}└── [ Fim do Probing HTTP ]{RESET}\n")

    # 3. Native Rule & Matchers Engine (Nuclei Replacement)
    if (args.rules or args.standalone_all) and NativeRuleEngine:
        print(f"\n{YELLOW}{BOLD}┌── [ MOTOR DE REGRAS DECLARATIVAS DE SEGURANÇA ]{RESET}")
        rule_engine = NativeRuleEngine()
        rule_findings = rule_engine.scan_target(args.url)
        print(f"{GRAY}│ Regras Testadas:{RESET} {len(rule_engine.rules)} | {GRAY}Achados Confirmados:{RESET} {len(rule_findings)}")
        for rf in rule_findings:
            sev_color = RED if rf['severity'] == 'HIGH' else YELLOW
            print(f"{GRAY}│  ├─{RESET} [{sev_color}{rf['severity']}{RESET} | {CYAN}{rf['cwe']}{RESET}] {rf['title']} (Risco: {rf['risk_score']}) -> {rf['matched_url']}")
        print(f"{YELLOW}└── [ Fim da Execução de Regras ]{RESET}\n")

    # 4. Native Route & JS Crawler Mode (Katana Replacement)
    if (args.crawl_native or args.standalone_all) and NativeEndpointCrawler:
        print(f"\n{CYAN}{BOLD}┌── [ CRAWLER DE ROTAS & EXTRATOR JAVASCRIPT ]{RESET}")
        crawler = NativeEndpointCrawler(args.url)
        crawl_data = crawler.crawl()
        print(f"{GRAY}│ Total de Rotas Mapeadas:{RESET} {crawl_data['total_endpoints']} (Links: {crawl_data['live_links_count']}, APIs: {crawl_data['api_routes_count']})")
        if crawl_data['forms_without_csrf']:
            print(f"{GRAY}│ Formulários sem CSRF (CWE-352):{RESET} {RED}{len(crawl_data['forms_without_csrf'])}{RESET}")
        if crawl_data['sensitive_parameters']:
            print(f"{GRAY}│ Parâmetros Minerados:{RESET} {', '.join(crawl_data['sensitive_parameters'][:4])}")
        print(f"{CYAN}└── [ Fim do Rastreamento de Rotas ]{RESET}\n")

    scanner = CWEDiscover(
        target_url=args.url,
        max_depth=args.max_depth,
        max_urls=args.max_urls,
        delay=args.delay,
        verbose=args.verbose,
        platform=args.platform,
        scope_file=args.scope_file,
        run_agents=args.agents,
        agents_output=args.agents_output,
        ai_narrative=args.ai_narrative,
    )
    scanner.run()
    scanner.export(args.output, args.format)

if __name__ == "__main__":
    main()
