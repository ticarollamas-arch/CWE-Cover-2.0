export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'OPERATOR';
  created_at: string;
  last_login?: string;
  active: boolean;
}

export interface InstallationNode {
  installation_id: string;
  hostname: string;
  platform: string;
  first_seen_at: string;
  last_seen_at: string;
  active_license_key?: string | null;
  status: 'ONLINE' | 'STANDBY' | 'REVOKED';
  ip_address?: string;
}

export interface ActiveSession {
  token: string;
  type: 'ADMIN' | 'CLIENT';
  user_id: string;
  username: string;
  role: string;
  created_at: string;
  expires_at: string;
  ip_address: string;
  user_agent: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'AUTH' | 'LICENSE' | 'CAMPAIGN' | 'SECURITY' | 'SYSTEM';
  actor: string;
  role: string;
  ip: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details: string;
}

export interface SystemConfig {
  autonomous_mode: boolean;
  rate_limit_per_minute: number;
  brute_force_lockout_attempts: number;
  brute_force_lockout_minutes: number;
  session_timeout_hours: number;
  allow_local_ollama: boolean;
  strict_license_enforcement: boolean;
  engines_count: number;
  agents_count: number;
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

