"use client"

import { Shield, AlertTriangle, TrendingUp, Users, Activity, Zap } from "lucide-react"
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"
import type { AuditData } from "@/types"

interface SecurityMetricsProps {
  auditData: AuditData
}

export const SecurityMetrics = ({ auditData }: SecurityMetricsProps) => {
  const security_metrics = auditData.security_metrics || {
    total_issues: 0,
    critical_issues: 0,
    high_issues: 0,
    medium_issues: 0,
    low_issues: 0,
    informational_issues: 0,
    code_quality_score: 0,
    security_score: 0,
    trust_score: 0,
    contract_age_days: 0,
    transaction_count: 0,
    unique_users: 0,
    indonesia_crime_risk: 0,
    indonesia_targeting_detected: false,
    legal_risk_score: 0,
    regulatory_violations_count: 0,
    satgas_pasti_report_required: false,
    compliance_status: "UNDER_REVIEW" as const,
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30"
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30"
    if (score >= 40) return "bg-orange-500/20 border-orange-500/30"
    return "bg-red-500/20 border-red-500/30"
  }

  return (
    <SmoothTransition delay={0}>
      <div className="space-y-6">
        {/* Main Security Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SmoothTransition delay={100}>
            <InteractiveCard
              glowEffect="blue"
              className={`rounded-xl p-6 border ${getScoreBackground(security_metrics.security_score)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Security Score</h3>
                <Shield className={`w-5 h-5 ${getScoreColor(security_metrics.security_score)}`} />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(security_metrics.security_score)}`}>
                {security_metrics.security_score}/100
              </div>
              <div className="mt-2 bg-gray-800/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    security_metrics.security_score >= 80
                      ? "bg-green-400"
                      : security_metrics.security_score >= 60
                        ? "bg-yellow-400"
                        : security_metrics.security_score >= 40
                          ? "bg-orange-400"
                          : "bg-red-400"
                  }`}
                  style={{ width: `${security_metrics.security_score}%` }}
                />
              </div>
            </InteractiveCard>
          </SmoothTransition>

          <SmoothTransition delay={200}>
            <InteractiveCard
              glowEffect="purple"
              className={`rounded-xl p-6 border ${getScoreBackground(security_metrics.trust_score)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Trust Score</h3>
                <Users className={`w-5 h-5 ${getScoreColor(security_metrics.trust_score)}`} />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(security_metrics.trust_score)}`}>
                {security_metrics.trust_score}/100
              </div>
              <div className="mt-2 bg-gray-800/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    security_metrics.trust_score >= 80
                      ? "bg-green-400"
                      : security_metrics.trust_score >= 60
                        ? "bg-yellow-400"
                        : security_metrics.trust_score >= 40
                          ? "bg-orange-400"
                          : "bg-red-400"
                  }`}
                  style={{ width: `${security_metrics.trust_score}%` }}
                />
              </div>
            </InteractiveCard>
          </SmoothTransition>

          <SmoothTransition delay={300}>
            <InteractiveCard
              glowEffect="green"
              className={`rounded-xl p-6 border ${getScoreBackground(security_metrics.code_quality_score)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Code Quality</h3>
                <TrendingUp className={`w-5 h-5 ${getScoreColor(security_metrics.code_quality_score)}`} />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(security_metrics.code_quality_score)}`}>
                {security_metrics.code_quality_score}/100
              </div>
              <div className="mt-2 bg-gray-800/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    security_metrics.code_quality_score >= 80
                      ? "bg-green-400"
                      : security_metrics.code_quality_score >= 60
                        ? "bg-yellow-400"
                        : security_metrics.code_quality_score >= 40
                          ? "bg-orange-400"
                          : "bg-red-400"
                  }`}
                  style={{ width: `${security_metrics.code_quality_score}%` }}
                />
              </div>
            </InteractiveCard>
          </SmoothTransition>
        </div>

        {/* Issues Breakdown */}
        <SmoothTransition delay={400}>
          <InteractiveCard
            glowEffect="red"
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              Security Issues Breakdown
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total</span>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{security_metrics.total_issues}</div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mt-2">
                  {security_metrics.total_issues} Issues
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-red-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Critical</span>
                  <Zap className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-400">{security_metrics.critical_issues}</div>
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium mt-2">
                  Critical
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-orange-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">High</span>
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-400">{security_metrics.high_issues}</div>
                <div className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-medium mt-2">
                  High
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Medium</span>
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-400">{security_metrics.medium_issues}</div>
                <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium mt-2">
                  Medium
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-green-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Low</span>
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">{security_metrics.low_issues}</div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium mt-2">
                  Low
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Info</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{security_metrics.informational_issues}</div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mt-2">Info</div>
              </div>
            </div>
          </InteractiveCard>
        </SmoothTransition>

        {/* Indonesian Risk Analysis */}
        <SmoothTransition delay={500}>
          <InteractiveCard
            glowEffect="orange"
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-400" />
              🇮🇩 Indonesian Risk Assessment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-200 text-sm font-medium">Crime Risk</span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-400">{security_metrics.indonesia_crime_risk}/100</div>
                <div className="mt-2 bg-red-800/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-red-400 transition-all duration-1000"
                    style={{ width: `${security_metrics.indonesia_crime_risk}%` }}
                  />
                </div>
              </div>

              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-200 text-sm font-medium">Legal Risk</span>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-400">{security_metrics.legal_risk_score}/100</div>
                <div className="mt-2 bg-orange-800/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-orange-400 transition-all duration-1000"
                    style={{ width: `${(security_metrics.legal_risk_score / 100) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-200 text-sm font-medium">Violations</span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-400">{security_metrics.regulatory_violations_count}</div>
                <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-300 mt-2">
                  Regulatory
                </div>
              </div>

              <div
                className={`rounded-lg p-4 border ${
                  security_metrics.compliance_status === "COMPLIANT"
                    ? "bg-green-900/30 border-green-600/50"
                    : "bg-red-900/30 border-red-600/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      security_metrics.compliance_status === "COMPLIANT" ? "text-green-200" : "text-red-200"
                    }`}
                  >
                    Compliance
                  </span>
                  <Shield
                    className={`w-4 h-4 ${
                      security_metrics.compliance_status === "COMPLIANT" ? "text-green-400" : "text-red-400"
                    }`}
                  />
                </div>
                <div
                  className={`text-sm font-bold ${
                    security_metrics.compliance_status === "COMPLIANT" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {security_metrics.compliance_status.replace("_", " ")}
                </div>
                {security_metrics.satgas_pasti_report_required && (
                  <div className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-300 mt-2 animate-pulse">
                    SATGAS REQUIRED
                  </div>
                )}
              </div>
            </div>

            {security_metrics.indonesia_targeting_detected && (
              <div className="mt-4 bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <div>
                    <h4 className="text-red-300 font-semibold">🎯 Indonesian Targeting Detected</h4>
                    <p className="text-red-200 text-sm">
                      This contract shows patterns of specifically targeting Indonesian users and may violate local
                      regulations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </InteractiveCard>
        </SmoothTransition>

        {/* Contract Statistics */}
        <SmoothTransition delay={600}>
          <InteractiveCard
            glowEffect="blue"
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Contract Activity Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm font-medium">Contract Age</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{security_metrics.contract_age_days}</div>
                <div className="text-blue-300 text-xs mt-1">Days Active</div>
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 text-sm font-medium">Transactions</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {security_metrics.transaction_count.toLocaleString()}
                </div>
                <div className="text-purple-300 text-xs mt-1">Total Count</div>
              </div>

              <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-200 text-sm font-medium">Unique Users</span>
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {security_metrics.unique_users.toLocaleString()}
                </div>
                <div className="text-green-300 text-xs mt-1">Active Users</div>
              </div>
            </div>
          </InteractiveCard>
        </SmoothTransition>
      </div>
    </SmoothTransition>
  )
}
