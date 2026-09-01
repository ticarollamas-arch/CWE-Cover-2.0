# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Network Engine
- Port Discovery (Async non-blocking TCP Socket Scanner)
- Service Detection (Native Banner Grabbing: SSH, HTTP, FTP, SMTP, MySQL, Redis)
- Protocol Analysis & Network Fingerprinting
"""

import socket
import ssl
import time
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor
from cyber_hunter.core.models import Asset, AssetType, Observation, ObservationType, Campaign


COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    465: "SMTPS",
    587: "SUBMISSION",
    993: "IMAPS",
    995: "POP3S",
    3306: "MySQL",
    5432: "PostgreSQL",
    6379: "Redis",
    8000: "HTTP-Alt",
    8080: "HTTP-Proxy",
    8443: "HTTPS-Alt",
    9200: "Elasticsearch",
    27017: "MongoDB"
}


class NativeNetworkEngine:
    """Scanner de portas e serviços nativo em sockets puros com detecção de banner."""

    @staticmethod
    def probe_port(host: str, port: int, timeout: float = 0.6) -> Optional[Dict[str, Any]]:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        start_t = time.time()
        try:
            res = s.connect_ex((host, port))
            if res == 0:
                elapsed = (time.time() - start_t) * 1000
                banner = ""
                # Tenta capturar banner inicial de serviço
                try:
                    s.settimeout(0.4)
                    # Envia um trigger seguro para serviços com handshake
                    if port in [80, 8080, 8000]:
                        s.sendall(b"HEAD / HTTP/1.0\r\n\r\n")
                    banner_bytes = s.recv(512)
                    banner = banner_bytes.decode('utf-8', errors='ignore').strip()
                except Exception:
                    pass

                service_name = COMMON_PORTS.get(port, "UNKNOWN")
                s.close()
                return {
                    "port": port,
                    "service": service_name,
                    "banner": banner[:120] if banner else None,
                    "latency_ms": round(elapsed, 2),
                    "state": "OPEN"
                }
            s.close()
        except Exception:
            pass
        return None

    @staticmethod
    def scan_host(host: str, ports: Optional[List[int]] = None, max_threads: int = 20) -> List[Dict[str, Any]]:
        target_ports = ports or list(COMMON_PORTS.keys())
        open_ports = []

        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            futures = [executor.submit(NativeNetworkEngine.probe_port, host, p) for p in target_ports]
            for f in futures:
                res = f.result()
                if res:
                    open_ports.append(res)

        return open_ports


class NetworkEngineOrchestrator:
    def __init__(self, campaign: Campaign):
        self.campaign = campaign

    def run(self, host: str, asset_id: str) -> List[Dict[str, Any]]:
        results = NativeNetworkEngine.scan_host(host)
        for item in results:
            self.campaign.add_observation(Observation(
                asset_id=asset_id,
                source_engine="NetworkEngine.PortScanner",
                obs_type=ObservationType.OPEN_PORT,
                data=item,
                confidence=1.0
            ))
            # Cria sub-ativo de porta
            self.campaign.add_asset(Asset(
                asset_type=AssetType.PORT,
                value=f"{host}:{item['port']}",
                parent_asset_id=asset_id,
                attributes=item
            ))
        return results
