#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cwe-discover • Subdomain Recon Engine (100% Native & Autonomous)
Autor: Carol Lamas (CyberHuntLab)
Descrição: Módulo de enumeração passiva de subdomínios via OSINT e CT Logs,
sem dependência de ferramentas externas (Subfinder, Amass, etc.).
"""

import json
import re
import socket
import urllib.request
import urllib.parse
import ssl
from typing import List, Set, Dict, Any, Optional

class NativeSubdomainFinder:
    """Motor passivo de enumeração de subdomínios via Certificate Transparency e OSINT."""
    
    def __init__(self, target_domain: str, timeout: int = 10, user_agent: str = "cwe-discover/2.0 (+https://cyberhuntlab.com.br)"):
        self.target_domain = self._clean_domain(target_domain)
        self.timeout = timeout
        self.user_agent = user_agent
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE
        
    def _clean_domain(self, domain: str) -> str:
        """Limpa e normaliza o domínio base."""
        domain = domain.strip().lower()
        if "://" in domain:
            domain = urllib.parse.urlparse(domain).netloc
        domain = domain.split(":")[0]
        if domain.startswith("www."):
            domain = domain[4:]
        return domain

    def _fetch_url(self, url: str) -> Optional[str]:
        """Executa requisição HTTP segura sem bibliotecas de terceiros."""
        req = urllib.request.Request(
            url,
            headers={"User-Agent": self.user_agent, "Accept": "application/json, text/plain, */*"}
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception:
            return None

    def query_crt_sh(self) -> Set[str]:
        """Consulta logs de Certificate Transparency no crt.sh."""
        subdomains: Set[str] = set()
        url = f"https://crt.sh/?q=%25.{self.target_domain}&output=json"
        data = self._fetch_url(url)
        if not data:
            return subdomains
            
        try:
            entries = json.loads(data)
            for entry in entries:
                name_value = entry.get("name_value", "")
                for sub in name_value.split("\n"):
                    sub = sub.strip().lower()
                    if "*" in sub:
                        sub = sub.replace("*.", "")
                    if self._is_valid_subdomain(sub):
                        subdomains.add(sub)
        except Exception:
            pass
        return subdomains

    def query_hackertarget(self) -> Set[str]:
        """Consulta API pública de DNS do HackerTarget."""
        subdomains: Set[str] = set()
        url = f"https://api.hackertarget.com/hostsearch/?q={self.target_domain}"
        data = self._fetch_url(url)
        if not data or "error" in data.lower() or "no dns records" in data.lower():
            return subdomains
            
        for line in data.splitlines():
            parts = line.split(",")
            if parts and parts[0]:
                sub = parts[0].strip().lower()
                if self._is_valid_subdomain(sub):
                    subdomains.add(sub)
        return subdomains

    def query_wayback(self) -> Set[str]:
        """Consulta registros históricos indexados no Wayback Machine CDX."""
        subdomains: Set[str] = set()
        url = f"http://web.archive.org/cdx/search/cdx?url=*.{self.target_domain}/*&output=json&fl=original&collapse=urlkey&limit=1000"
        data = self._fetch_url(url)
        if not data:
            return subdomains
            
        try:
            entries = json.loads(data)
            if len(entries) > 1:
                for row in entries[1:]:
                    if row and row[0]:
                        parsed = urllib.parse.urlparse(row[0])
                        host = parsed.netloc.split(":")[0].strip().lower()
                        if self._is_valid_subdomain(host):
                            subdomains.add(host)
        except Exception:
            pass
        return subdomains

    def query_otx(self) -> Set[str]:
        """Consulta AlienVault Open Threat Exchange (OTX)."""
        subdomains: Set[str] = set()
        url = f"https://otx.alienvault.com/api/v1/indicators/domain/{self.target_domain}/passive_dns"
        data = self._fetch_url(url)
        if not data:
            return subdomains
            
        try:
            res = json.loads(data)
            records = res.get("passive_dns", [])
            for r in records:
                host = r.get("hostname", "").strip().lower()
                if self._is_valid_subdomain(host):
                    subdomains.add(host)
        except Exception:
            pass
        return subdomains

    def _is_valid_subdomain(self, host: str) -> bool:
        """Valida se o hostname pertence de fato ao domínio alvo."""
        if not host:
            return False
        host = host.strip().lower()
        if host == self.target_domain or host.endswith(f".{self.target_domain}"):
            # Elimina caracteres inválidos
            if re.match(r'^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$', host):
                return True
        return False

    def resolve_dns(self, host: str) -> Optional[str]:
        """Resolve o IP de um host usando socket nativo de alta velocidade."""
        try:
            return socket.gethostbyname(host)
        except (socket.gaierror, socket.herror, TimeoutError):
            return None

    def discover(self, resolve_active: bool = True) -> List[Dict[str, Any]]:
        """Executa a descoberta completa agregando todas as fontes nativas."""
        all_subs: Set[str] = set()
        
        # 1. CT Logs (crt.sh)
        crt_subs = self.query_crt_sh()
        all_subs.update(crt_subs)
        
        # 2. HackerTarget
        ht_subs = self.query_hackertarget()
        all_subs.update(ht_subs)
        
        # 3. Wayback Machine
        wb_subs = self.query_wayback()
        all_subs.update(wb_subs)
        
        # 4. AlienVault OTX
        otx_subs = self.query_otx()
        all_subs.update(otx_subs)
        
        # Sempre incluir o domínio base
        all_subs.add(self.target_domain)
        all_subs.add(f"www.{self.target_domain}")

        results: List[Dict[str, Any]] = []
        for sub in sorted(all_subs):
            ip = None
            is_active = False
            if resolve_active:
                ip = self.resolve_dns(sub)
                is_active = (ip is not None)
                
            results.append({
                "subdomain": sub,
                "domain": self.target_domain,
                "ip": ip,
                "active": is_active,
                "sources": [
                    *([ "crt.sh" ] if sub in crt_subs else []),
                    *([ "HackerTarget" ] if sub in ht_subs else []),
                    *([ "Wayback" ] if sub in wb_subs else []),
                    *([ "AlienVault OTX" ] if sub in otx_subs else []),
                ] or ["Base Domain"]
            })
            
        return results

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "example.com"
    print(f"[*] Iniciando enumeração nativa para: {target}")
    finder = NativeSubdomainFinder(target)
    findings = finder.discover(resolve_active=True)
    print(f"[+] Total de subdomínios encontrados: {len(findings)}")
    for f in findings:
        status = f"🟢 {f['ip']}" if f['active'] else "⚪ Não Resolvido"
        sources = ", ".join(f['sources'])
        print(f" - {f['subdomain']} -> {status} [{sources}]")
