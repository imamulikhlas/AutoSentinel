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
  // Fitur baru Indonesian Crime Detection
  indonesia_crime_risk: number
  indonesia_targeting_detected: boolean
  legal_risk_score: number
  regulatory_violations_count: number
  satgas_pasti_report_required: boolean
  compliance_status: "COMPLIANT" | "NON_COMPLIANT" | "UNDER_REVIEW"
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
  // Fitur baru
  indonesian_crime_analysis: IndonesianCrimeAnalysis
  compliance_report: ComplianceReport
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

export interface IndonesianCrimeEvidence {
  crime_type: string
  risk_score: number
  confidence: number
  evidence: string[]
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  regulatory_violation: string
}

export interface IndonesianCrimeAnalysis {
  overall_crime_risk: number
  is_targeting_indonesia: boolean
  detected_crimes: IndonesianCrimeEvidence[]
  indonesian_evidence: string[]
  regulatory_violations: string[]
  satgas_pasti_report_needed: boolean
  ojk_compliance_status: "COMPLIANT" | "NON_COMPLIANT" | "UNDER_REVIEW"
  recommended_actions: string[]
  indonesian_behavior_score: number
  timezone_analysis: Record<string, any>
  exchange_interactions: Record<string, any>
  structuring_detected: boolean
}

export interface ComplianceViolation {
  violation_type: string
  law_article: string
  penalty_description: string
  fine_amount: string
  enforcement_agency: string
  severity_level: "RINGAN" | "SEDANG" | "BERAT"
  satgas_pasti_priority: boolean
  compliance_action: "MONITOR" | "INVESTIGATE" | "IMMEDIATE_BLOCK"
}

export interface ComplianceReport {
  contract_address: string
  scan_timestamp: string
  total_violations: number
  violations: ComplianceViolation[]
  compliance_status: "COMPLIANT" | "NON_COMPLIANT" | "UNDER_REVIEW"
  satgas_pasti_report_required: boolean
  recommended_actions: string[]
  legal_risk_score: number
}
