// Tipagens estruturadas do Produto Cyber Hunter Lab

export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface ScopeConfig {
  domain: string;
  allow_subdomains: boolean;
  authorized_endpoints: string[];
  rate_limit_rps: number;
  profile: 'safe' | 'authorized' | 'lab';
}

export interface AssetItem {
  id: string;
  type: 'DOMAIN' | 'SUBDOMAIN' | 'IP' | 'PORT' | 'SERVICE' | 'URL' | 'ENDPOINT' | 'TECHNOLOGY';
  value: string;
  confidence: number;
  tags?: string[];
  parent_id?: string;
}

export interface RequestProof {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ResponseProof {
  status_code: number;
  headers?: Record<string, string>;
  body_snippet?: string;
  content_length?: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  request?: RequestProof;
  response?: ResponseProof;
  diff_proof?: string;
}

export interface ChainOfEvidence {
  curl_reproduction: string;
  sanitized: boolean;
  items: EvidenceItem[];
}

export interface FindingItem {
  id: string;
  title: string;
  severity: SeverityLevel;
  confidence: number;
  cwe_id: string;
  owasp_id?: string;
  vrt_id?: string;
  target: string;
  cvss_score: number;
  cvss_vector?: string;
  risk_score: number;
  validated: boolean;
  description: string;
  impact: string;
  mitigation: string;
  chain_of_evidence?: ChainOfEvidence;
}

export interface CampaignItem {
  id: string;
  name: string;
  target: string;
  scope: ScopeConfig;
  status: 'READY' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration_sec: number;
  assets_count: number;
  observations_count: number;
  findings_count: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  risk_score: number;
  overall_risk: SeverityLevel;
  confidence: number;
  agents_status: Record<string, AgentStatus>;
  assets: AssetItem[];
  findings: FindingItem[];
}

export interface LicenseItem {
  id: string;
  key: string;
  client_name: string;
  client_email: string;
  plan: 'Standard' | 'Professional' | 'Enterprise' | string;
  status: 'Active' | 'Suspended' | 'Revoked' | 'Expired';
  created_at: string;
  expires_at: string;
  last_activated_at?: string | null;
  installation_id?: string | null;
  max_targets: number;
  features: string[];
}

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'custom' | string;
  period_label: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  features: string[];
  payment_instructions?: string;
  payment_link?: string;
  updated_at?: string;
}

export interface PaymentItem {
  id: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  client_name: string;
  client_email: string;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';
  pix_code: string;
  pix_qr_base64?: string;
  license_key_generated?: string;
  license_id?: string;
  created_at: string;
  confirmed_at?: string | null;
  provider: string;
}

export interface SystemStatus {
  status: string;
  runtime: {
    python_version: string;
    platform: string;
    hostname: string;
    installation_id: string;
    sockets_ready: boolean;
    zero_external_scanners: boolean;
    engines_count: number;
    agents_count: number;
  };
  license: {
    key: string;
    plan: string;
    client_name: string;
    status: string;
    expires_at: string;
    installation_id: string;
  } | null;
  ai_status: {
    provider: string;
    connected: boolean;
    status_text: string;
    models: string[];
    endpoint: string;
  };
}
