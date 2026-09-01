# -*- coding: utf-8 -*-
"""
CYBER HUNTER ENGINE • Unified Persistent Storage Subsystem
Persistência SQLite e JSON para campanhas, ativos, observações, evidências e achados.
Permite retomada consistente de auditorias (`--resume`) e consultas de auditoria forense.
"""

import os
import json
import sqlite3
import time
from typing import List, Dict, Any, Optional
from dataclasses import asdict

from cyber_hunter.core.models import (
    Campaign, Asset, Observation, Finding, SeverityLevel,
    AssetType, ObservationType, RequestRecord, ResponseRecord,
    ChainOfEvidence, EvidenceItem
)
from cyber_hunter.core.errors import StorageError


class CampaignStorage:
    """Gerenciador de persistência de campanhas baseado em SQLite3 nativo com exportação JSON."""

    def __init__(self, db_path: str = "cyber_hunter_vault.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS campaigns (
                        id TEXT PRIMARY KEY,
                        name TEXT,
                        target_root TEXT,
                        scope_policy TEXT,
                        has_authorization INTEGER,
                        started_at REAL,
                        ended_at REAL,
                        telemetry_json TEXT
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS assets (
                        id TEXT PRIMARY KEY,
                        campaign_id TEXT,
                        asset_type TEXT,
                        value TEXT,
                        parent_asset_id TEXT,
                        attributes_json TEXT,
                        tags_json TEXT,
                        created_at REAL,
                        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS observations (
                        id TEXT PRIMARY KEY,
                        campaign_id TEXT,
                        asset_id TEXT,
                        source_engine TEXT,
                        obs_type TEXT,
                        data_json TEXT,
                        confidence REAL,
                        timestamp REAL,
                        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS findings (
                        id TEXT PRIMARY KEY,
                        campaign_id TEXT,
                        title TEXT,
                        severity TEXT,
                        confidence REAL,
                        cwe_id TEXT,
                        owasp_id TEXT,
                        vrt_id TEXT,
                        target TEXT,
                        description TEXT,
                        impact TEXT,
                        mitigation TEXT,
                        cvss_score REAL,
                        cvss_vector TEXT,
                        risk_score REAL,
                        validated INTEGER,
                        evidence_chain_json TEXT,
                        timestamp REAL,
                        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
                    )
                """)
                conn.commit()
        except Exception as e:
            raise StorageError("INIT", f"Falha ao inicializar banco de dados SQLite: {e}")

    def save_campaign(self, campaign: Campaign):
        """Salva ou atualiza uma campanha completa com seus ativos, observações e achados."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                # 1. Upsert Campanha
                cursor.execute("""
                    INSERT OR REPLACE INTO campaigns (
                        id, name, target_root, scope_policy, has_authorization, started_at, ended_at, telemetry_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    campaign.id,
                    campaign.name,
                    campaign.target_root,
                    campaign.scope_policy,
                    1 if campaign.has_authorization else 0,
                    campaign.started_at,
                    campaign.ended_at,
                    json.dumps(campaign.telemetry or {})
                ))

                # 2. Inserir Ativos
                for asset in campaign.assets.values():
                    cursor.execute("""
                        INSERT OR REPLACE INTO assets (
                            id, campaign_id, asset_type, value, parent_asset_id, attributes_json, tags_json, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        asset.id,
                        campaign.id,
                        asset.asset_type.value if hasattr(asset.asset_type, "value") else str(asset.asset_type),
                        asset.value,
                        asset.parent_asset_id,
                        json.dumps(asset.attributes or {}),
                        json.dumps(asset.tags or []),
                        asset.created_at
                    ))

                # 3. Inserir Observações
                for obs in campaign.observations:
                    cursor.execute("""
                        INSERT OR REPLACE INTO observations (
                            id, campaign_id, asset_id, source_engine, obs_type, data_json, confidence, timestamp
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        obs.id,
                        campaign.id,
                        obs.asset_id,
                        obs.source_engine,
                        obs.obs_type.value if hasattr(obs.obs_type, "value") else str(obs.obs_type),
                        json.dumps(obs.data or {}),
                        obs.confidence,
                        obs.timestamp
                    ))

                # 4. Inserir Achados
                for f in campaign.findings:
                    chain_dict = None
                    if f.chain_of_evidence:
                        chain_dict = asdict(f.chain_of_evidence)

                    cursor.execute("""
                        INSERT OR REPLACE INTO findings (
                            id, campaign_id, title, severity, confidence, cwe_id, owasp_id, vrt_id,
                            target, description, impact, mitigation, cvss_score, cvss_vector,
                            risk_score, validated, evidence_chain_json, timestamp
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        f.id,
                        campaign.id,
                        f.title,
                        f.severity.value if hasattr(f.severity, "value") else str(f.severity),
                        f.confidence,
                        f.cwe_id,
                        f.owasp_id,
                        f.vrt_id,
                        f.target,
                        f.description,
                        f.impact,
                        f.mitigation,
                        f.cvss_score,
                        f.cvss_vector,
                        f.risk_score,
                        1 if f.validated else 0,
                        json.dumps(chain_dict) if chain_dict else None,
                        f.timestamp
                    ))

                conn.commit()
        except Exception as e:
            raise StorageError("SAVE_CAMPAIGN", f"Falha ao salvar campanha {campaign.id}: {e}")

    def list_campaigns(self) -> List[Dict[str, Any]]:
        """Retorna uma lista resumida de todas as campanhas armazenadas."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT c.id, c.name, c.target_root, c.started_at, c.ended_at,
                           (SELECT COUNT(*) FROM assets WHERE campaign_id = c.id) as asset_count,
                           (SELECT COUNT(*) FROM findings WHERE campaign_id = c.id) as finding_count
                    FROM campaigns c
                    ORDER BY c.started_at DESC
                """)
                rows = cursor.fetchall()
                return [
                    {
                        "id": r[0],
                        "name": r[1],
                        "target_root": r[2],
                        "started_at": r[3],
                        "ended_at": r[4],
                        "asset_count": r[5],
                        "finding_count": r[6]
                    }
                    for r in rows
                ]
        except Exception as e:
            raise StorageError("LIST_CAMPAIGNS", f"Falha ao listar campanhas: {e}")

    def load_campaign(self, campaign_id: str) -> Optional[Campaign]:
        """Carrega uma campanha completa a partir do banco de dados SQLite."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM campaigns WHERE id = ?", (campaign_id,))
                row = cursor.fetchone()
                if not row:
                    return None

                camp = Campaign(
                    id=row[0],
                    name=row[1],
                    target_root=row[2],
                    scope_policy=row[3],
                    has_authorization=bool(row[4]),
                    started_at=row[5],
                    ended_at=row[6],
                    telemetry=json.loads(row[7]) if row[7] else {}
                )

                # Carrega Ativos
                cursor.execute("SELECT * FROM assets WHERE campaign_id = ?", (campaign_id,))
                for a_row in cursor.fetchall():
                    camp.add_asset(Asset(
                        id=a_row[0],
                        asset_type=AssetType(a_row[2]) if a_row[2] in [e.value for e in AssetType] else AssetType.DOMAIN,
                        value=a_row[3],
                        parent_asset_id=a_row[4],
                        attributes=json.loads(a_row[5]) if a_row[5] else {},
                        tags=json.loads(a_row[6]) if a_row[6] else {},
                        created_at=a_row[7]
                    ))

                # Carrega Observações
                cursor.execute("SELECT * FROM observations WHERE campaign_id = ?", (campaign_id,))
                for o_row in cursor.fetchall():
                    camp.add_observation(Observation(
                        id=o_row[0],
                        asset_id=o_row[2],
                        source_engine=o_row[3],
                        obs_type=ObservationType(o_row[4]) if o_row[4] in [e.value for e in ObservationType] else ObservationType.RULE_MATCH,
                        data=json.loads(o_row[5]) if o_row[5] else {},
                        confidence=o_row[6],
                        timestamp=o_row[7]
                    ))

                # Carrega Achados
                cursor.execute("SELECT * FROM findings WHERE campaign_id = ?", (campaign_id,))
                for f_row in cursor.fetchall():
                    finding = Finding(
                        id=f_row[0],
                        title=f_row[2],
                        severity=SeverityLevel(f_row[3]) if f_row[3] in [e.value for e in SeverityLevel] else SeverityLevel.MEDIUM,
                        confidence=f_row[4],
                        cwe_id=f_row[5],
                        owasp_id=f_row[6],
                        vrt_id=f_row[7],
                        target=f_row[8],
                        description=f_row[9],
                        impact=f_row[10],
                        mitigation=f_row[11],
                        cvss_score=f_row[12],
                        cvss_vector=f_row[13],
                        risk_score=f_row[14],
                        validated=bool(f_row[15]),
                        timestamp=f_row[17]
                    )
                    if f_row[16]:
                        try:
                            ev_data = json.loads(f_row[16])
                            chain = ChainOfEvidence(
                                id=ev_data.get("id", ""),
                                curl_reproduction=ev_data.get("curl_reproduction", ""),
                                sanitized=ev_data.get("sanitized", True)
                            )
                            for item_data in ev_data.get("items", []):
                                req_data = item_data.get("request")
                                req = RequestRecord(**req_data) if req_data else None
                                resp_data = item_data.get("response")
                                resp = ResponseRecord(**resp_data) if resp_data else None
                                chain.add(EvidenceItem(
                                    id=item_data.get("id", ""),
                                    title=item_data.get("title", ""),
                                    description=item_data.get("description", ""),
                                    request=req,
                                    response=resp,
                                    diff_proof=item_data.get("diff_proof")
                                ))
                            finding.chain_of_evidence = chain
                        except Exception:
                            pass

                    camp.add_finding(finding)

                return camp
        except Exception as e:
            raise StorageError("LOAD_CAMPAIGN", f"Falha ao carregar campanha {campaign_id}: {e}")
