"use client"

import { Shield, AlertTriangle, Code, Users, Clock, Scale } from "lucide-react"
import type { AuditData } from "@/types"

interface SecurityMetricsProps {
  auditData: AuditData
}

export const SecurityMetrics = ({ auditData }: SecurityMetricsProps) => {
  const { security_metrics } = auditData

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Security Metrics
        </h3>
        <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
          {security_metrics.total_issues} Issues
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Critical Issues</h4>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{security_metrics.critical_issues}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">High Issues</h4>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">{security_metrics.high_issues}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Medium Issues</h4>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{security_metrics.medium_issues}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Low Issues</h4>
            <AlertTriangle className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{security_metrics.low_issues}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Code Quality</h4>
            <Code className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400">{security_metrics.code_quality_score}/100</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Security Score</h4>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{security_metrics.security_score}/100</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Trust Score</h4>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{security_metrics.trust_score}/100</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Contract Age</h4>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{security_metrics.contract_age_days} days</p>
        </div>

        {/* Indonesian Crime Risk Metrics */}
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 text-sm">Indonesia Crime Risk</h4>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{security_metrics.indonesia_crime_risk}/100</p>
        </div>

        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 text-sm">Legal Risk Score</h4>
            <Scale className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">{security_metrics.legal_risk_score}/20</p>
        </div>

        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 text-sm">Regulatory Violations</h4>
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{security_metrics.regulatory_violations_count}</p>
        </div>

        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 text-sm">Compliance Status</h4>
            <Scale className="w-4 h-4 text-red-400" />
          </div>
          <p
            className={`text-lg font-bold ${security_metrics.compliance_status === "COMPLIANT" ? "text-green-400" : "text-red-400"}`}
          >
            {security_metrics.compliance_status}
          </p>
        </div>
      </div>
    </div>
  )
}
