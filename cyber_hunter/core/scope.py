# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Scope Guard & Policy Engine
Responsável por garantir que nenhuma operação ultrapasse os limites autorizados.
"""

from enum import Enum
from typing import List, Set, Optional, Dict, Any
import urllib.parse
import ipaddress


class AuthorizationMode(str, Enum):
    PASSIVE = "passive"
    SAFE = "safe"
    AUTHORIZED = "authorized"
    STRICT_AUTHORIZED = "strict_authorized"
    LAB = "lab"


class ScopePolicy:
    """Controla e valida rigorosamente cada alvo antes de qualquer envio de pacotes."""

    def __init__(
        self,
        target_root: str = "",
        allowed_roots: Optional[List[str]] = None,
        mode: AuthorizationMode = AuthorizationMode.SAFE,
        allow_subdomains: bool = True,
        allowlist: Optional[List[str]] = None,
        denylist: Optional[List[str]] = None,
        denied_targets: Optional[List[str]] = None,
        max_depth: int = 3,
        rate_limit_rps: float = 10.0,
        has_authorization: bool = True
    ):
        self.target_root = target_root
        self.mode = mode
        self.allow_subdomains = allow_subdomains
        self.max_depth = max_depth
        self.rate_limit_rps = rate_limit_rps
        self.has_authorization = has_authorization

        all_allowed = list(allowlist or [])
        if allowed_roots:
            all_allowed.extend(allowed_roots)
        if target_root:
            all_allowed.append(target_root)

        parsed = urllib.parse.urlparse(target_root) if target_root else None
        self.base_host = parsed.netloc or parsed.path if parsed else ""
        if ":" in self.base_host:
            self.base_host = self.base_host.split(":")[0]

        self.allowlist: Set[str] = set()
        for item in all_allowed:
            p = urllib.parse.urlparse(item)
            h = p.netloc or p.path or item
            if ":" in h:
                h = h.split(":")[0]
            if h:
                self.allowlist.add(h.lower())

        if self.base_host:
            self.allowlist.add(self.base_host.lower())

        all_denied = list(denylist or ["localhost", "127.0.0.1", "::1", "169.254.169.254"])
        if denied_targets:
            all_denied.extend(denied_targets)

        self.denylist: Set[str] = set()
        for item in all_denied:
            p = urllib.parse.urlparse(item)
            h = p.netloc or p.path or item
            if ":" in h:
                h = h.split(":")[0]
            if h:
                self.denylist.add(h.lower())

    def is_in_scope(self, host_or_url: str) -> bool:
        """Verifica se um host ou URL está dentro do escopo permitido."""
        if not self.has_authorization and self.mode not in (AuthorizationMode.PASSIVE, AuthorizationMode.LAB):
            return False

        parsed = urllib.parse.urlparse(host_or_url)
        host = parsed.netloc or parsed.path or host_or_url
        if ":" in host:
            host = host.split(":")[0]
        host = host.lower()

        # Verifica Denylist explícita
        if host in self.denylist:
            return False

        # Verifica IPs privados e loopbacks quando não em modo LAB
        if self.mode != AuthorizationMode.LAB:
            try:
                ip_obj = ipaddress.ip_address(host)
                if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local:
                    return False
            except ValueError:
                pass

        if self.base_host and host == self.base_host.lower():
            return True

        # Verifica se é subdomínio permitido da base
        if self.base_host and self.allow_subdomains and host.endswith(f".{self.base_host.lower()}"):
            return True

        # Verifica Allowlist
        for allowed in self.allowlist:
            if host == allowed or (self.allow_subdomains and host.endswith(f".{allowed}")):
                return True

        return False

    def is_allowed(self, host_or_url: str) -> bool:
        """Alias para is_in_scope."""
        return self.is_in_scope(host_or_url)
