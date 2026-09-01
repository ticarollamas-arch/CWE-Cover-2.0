# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Asset Intelligence
- DNS Engine (Async DNS Resolution, Record Inspection)
- Domain Engine (Passive Certificate Transparency, OSINT, ASN)
- Host Discovery & Asset Correlation
"""

import socket
import json
import urllib.request
import urllib.error
from typing import List, Dict, Any, Set
from cyber_hunter.core.models import Asset, AssetType, Observation, ObservationType, Campaign


class NativeDnsEngine:
    """Resolve registros DNS de forma nativa utilizando sockets padrão do sistema."""
    
    @staticmethod
    def resolve_domain(domain: str) -> Dict[str, Any]:
        result = {
            "domain": domain,
            "ipv4": [],
            "cname": [],
            "status": "UNRESOLVED"
        }
        try:
            # Resolução A/IPv4
            addr_info = socket.getaddrinfo(domain, 80, socket.AF_INET, socket.SOCK_STREAM)
            ips = list(set([item[4][0] for item in addr_info]))
            result["ipv4"] = ips
            result["status"] = "ALIVE" if ips else "NO_IP"
        except socket.gaierror:
            result["status"] = "NXDOMAIN"
        except Exception as e:
            result["status"] = f"ERROR: {str(e)}"
            
        try:
            # Canonical Name
            cname = socket.gethostbyname_ex(domain)[0]
            if cname and cname != domain:
                result["cname"].append(cname)
        except Exception:
            pass

        return result


class NativeDomainEngine:
    """Busca passiva de subdomínios via Certificate Transparency (crt.sh) e HackerTarget."""
    
    @staticmethod
    def enumerate_subdomains(domain: str, timeout: float = 2.5) -> Set[str]:
        subdomains: Set[str] = set()
        clean_domain = domain.replace("https://", "").replace("http://", "").split("/")[0].split(":")[0]
        
        # 1. crt.sh (Certificate Transparency Logs)
        url_crt = f"https://crt.sh/?q=%25.{clean_domain}&output=json"
        try:
            req = urllib.request.Request(url_crt, headers={"User-Agent": "CyberHunter/2.0 (Security-Audit)"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode('utf-8', errors='ignore'))
                    for entry in data:
                        name_value = entry.get("name_value", "")
                        for sub in name_value.split("\n"):
                            sub = sub.strip().lower()
                            if sub.endswith(clean_domain) and not sub.startswith("*"):
                                subdomains.add(sub)
        except Exception:
            pass

        # 2. AlienVault OTX Passive DNS
        url_otx = f"https://otx.alienvault.com/api/v1/indicators/domain/{clean_domain}/passive_dns"
        try:
            req = urllib.request.Request(url_otx, headers={"User-Agent": "CyberHunter/2.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode('utf-8', errors='ignore'))
                    for record in data.get("passive_dns", []):
                        hostname = record.get("hostname", "").strip().lower()
                        if hostname.endswith(clean_domain):
                            subdomains.add(hostname)
        except Exception:
            pass

        # Sempre inclui o domínio raiz
        subdomains.add(clean_domain)
        return subdomains


class AssetIntelligenceOrchestrator:
    """Coordena a inteligência de ativos e alimenta a Campaign unificada."""

    def __init__(self, campaign: Campaign):
        self.campaign = campaign

    def run(self, domain: str) -> List[str]:
        root_asset = Asset(
            asset_type=AssetType.DOMAIN,
            value=domain,
            attributes={"is_root": True}
        )
        root_id = self.campaign.add_asset(root_asset)

        found_subs = NativeDomainEngine.enumerate_subdomains(domain)
        alive_targets = []

        for sub in found_subs:
            dns_info = NativeDnsEngine.resolve_domain(sub)
            sub_asset = Asset(
                asset_type=AssetType.SUBDOMAIN,
                value=sub,
                parent_asset_id=root_id,
                attributes=dns_info
            )
            sub_id = self.campaign.add_asset(sub_asset)

            if dns_info["status"] == "ALIVE":
                alive_targets.append(sub)
                self.campaign.add_observation(Observation(
                    asset_id=sub_id,
                    source_engine="AssetIntelligence.DNS",
                    obs_type=ObservationType.DNS_RECORD,
                    data={"ips": dns_info["ipv4"], "status": "ALIVE"},
                    confidence=1.0
                ))

        return alive_targets
