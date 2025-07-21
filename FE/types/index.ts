export interface VulnerabilityDetail {
  type: string
  severity: "Low" | "Medium" | "High" | "Critical" | "Informational"
  description: string
  impact: string
  recommendation: string
  line_number?: number
  function_name?: string
}

export interface SecurityMetrics {
  total_issues: number
  critical_issues: number
  high_issues: number
  medium_issues: number
  low_issues: number
  informational_issues: number
  code_quality_score: number
  security_score: number
  trust_score: number
  contract_age_days: number
  transaction_count: number
  unique_users: number
}

export interface ContractInfo {
  is_verified: boolean
  verification_date?: string
  compiler_version?: string
  contract_name?: string
  proxy_type?: string
  implementation_address?: string
}

export interface OwnershipAnalysis {
  owner_address?: string
  is_multisig: boolean
  ownership_renounced: boolean
  admin_functions: string[]
  centralization_risk: string
}

export interface TradingAnalysis {
  is_honeypot: boolean
  honeypot_confidence: number
  buy_tax?: number
  sell_tax?: number
  liquidity_locked: boolean
  trading_enabled: boolean
  max_transaction_limit?: string
}

export interface SocialPresence {
  website?: string
  twitter?: string
  telegram?: string
  github?: string
  discord?: string
  social_score: number
}

export interface AuditData {
  contract_address: string
  chain: string
  audit_timestamp: string
  risk_level: "Low" | "Medium" | "High" | "Critical"
  risk_score: number
  security_metrics: SecurityMetrics
  vulnerabilities: VulnerabilityDetail[]
  ai_summary: string
  recommendations: string[]
  gas_optimization_hints: string[]
  audit_file_path: string
  contract_info: ContractInfo
  ownership_analysis: OwnershipAnalysis
  trading_analysis: TradingAnalysis
  social_presence: SocialPresence
}

export interface HistoryItem {
  timestamp: string
  total_issues: number
  file_path: string
}

export interface ToastMessage {
  type: "success" | "error" | "info"
  message: string
}
