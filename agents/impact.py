"""
Impact Agent • CWE-Cover 2.0
Author: Carol Lamas (CyberHuntLab)

Calculates contextual risk scores and translates technical findings into realistic business impact.
"""

from typing import Dict, Any
from .models import AgentFinding, FindingStatus
from .mapping import CWE_TAXONOMY


class ImpactAgent:
    """Agent that quantifies risk and articulates realistic impact scenarios."""

    def calculate_impact(self, finding: AgentFinding) -> AgentFinding:
        """Calculates Risk Score and updates impact descriptions based on validated status."""
        cwe_meta = CWE_TAXONOMY.get(finding.cwe_id, {})
        base_weight = cwe_meta.get("base_weight", 3.0)

        # Scale risk score mathematically by validated confidence and status multiplier
        status_multiplier = {
            FindingStatus.CONFIRMED: 1.0,
            FindingStatus.POTENTIAL: 0.8,
            FindingStatus.HYPOTHESIS: 0.6,
            FindingStatus.OBSERVATION: 0.4,
            FindingStatus.UNCERTAIN: 0.3,
            FindingStatus.INSUFFICIENT_EVIDENCE: 0.1,
            FindingStatus.FALSE_POSITIVE: 0.0,
        }.get(finding.status, 0.5)

        finding.risk_score = round(base_weight * finding.confidence * status_multiplier, 2)

        # Realistic impact text based on validated state
        if finding.status == FindingStatus.CONFIRMED:
            finding.impact = f"High/Demonstrated Impact: {cwe_meta.get('impact', 'Direct exposure confirmed.')}"
        elif finding.status == FindingStatus.HYPOTHESIS:
            finding.impact = f"Hypothetical Impact (Unproven): {cwe_meta.get('impact', 'Potential exposure.')} [Requires active PoC verification]"
        elif finding.status == FindingStatus.OBSERVATION:
            finding.impact = f"Configurational/Informational: {cwe_meta.get('impact', 'Suboptimal security posture.')}"
        elif finding.status == FindingStatus.UNCERTAIN:
            finding.impact = "Impact indeterminate due to contradictory signals across observation phases."
        else:
            finding.impact = "No demonstrated impact."

        return finding
