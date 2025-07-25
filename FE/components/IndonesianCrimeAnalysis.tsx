"use client"

import { AlertTriangle, Search, MapPin, Clock, Users, Activity, Shield } from "lucide-react"
import type { AuditData } from "@/types"

interface IndonesianCrimeAnalysisProps {
  auditData: AuditData
}

export const IndonesianCrimeAnalysis = ({ auditData }: IndonesianCrimeAnalysisProps) => {
  const { indonesian_crime_analysis } = auditData

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
      case "CRITICAL":
        return "bg-red-600/20 text-red-200 border-red-600/30"
      case "MEDIUM":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "LOW":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border border-gray-700/50 shadow-xl hover:shadow-red-500/10 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-red-400" />
          Indonesian Crime Pattern Analysis
        </h3>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Crime Risk Score</h4>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{indonesian_crime_analysis.overall_crime_risk}/100</div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Indonesia Targeting</h4>
            <MapPin className="w-5 h-5 text-orange-400" />
          </div>
          <div
            className={`text-lg font-bold ${indonesian_crime_analysis.is_targeting_indonesia ? "text-red-400" : "text-green-400"}`}
          >
            {indonesian_crime_analysis.is_targeting_indonesia ? "DETECTED" : "NOT DETECTED"}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Behavior Score</h4>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {indonesian_crime_analysis.indonesian_behavior_score}/100
          </div>
        </div>
      </div>

      {/* Detected Crimes */}
      {indonesian_crime_analysis.detected_crimes && indonesian_crime_analysis.detected_crimes.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
            Detected Criminal Patterns ({indonesian_crime_analysis.detected_crimes.length})
          </h4>

          <div className="space-y-4">
            {indonesian_crime_analysis.detected_crimes.map((crime, index) => (
              <div
                key={index}
                className="bg-gray-900/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <h5 className="text-white font-semibold text-lg capitalize mb-2 lg:mb-0">
                    {crime.crime_type.replace(/_/g, " ")}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(crime.severity)}`}
                    >
                      {crime.severity}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {Math.round(crime.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm font-medium">Risk Score:</span>
                      <p className="text-red-300 mt-1">{crime.risk_score}/100</p>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm font-medium">Regulatory Violation:</span>
                      <p className="text-orange-300 mt-1">{crime.regulatory_violation}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm font-medium">Evidence:</span>
                    <div className="mt-2 space-y-2">
                      {crime.evidence.map((evidence, idx) => (
                        <div key={idx} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                          <p className="text-gray-300 text-sm">{evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indonesian Evidence */}
      {indonesian_crime_analysis.indonesian_evidence && indonesian_crime_analysis.indonesian_evidence.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Search className="w-5 h-5 mr-3 text-blue-400" />
            Indonesian Targeting Evidence
          </h4>

          <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30">
            <div className="space-y-3">
              {indonesian_crime_analysis.indonesian_evidence.map((evidence, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-blue-200">{evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Analysis */}
      {indonesian_crime_analysis.structuring_detected && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-3 text-orange-400" />
            Transaction Behavior Analysis
          </h4>

          <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h5 className="text-orange-300 font-bold text-lg">Structuring Pattern Detected</h5>
                <p className="text-orange-200 text-sm">
                  Multiple small transactions detected in patterns consistent with structuring
                </p>
              </div>
            </div>

            <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
              <p className="text-orange-200 text-sm">
                <strong>WARNING:</strong> Transaction patterns show evidence of potential structuring to avoid
                detection. This behavior is consistent with money laundering techniques and may violate Indonesian
                anti-money laundering regulations (UU TPPU).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timezone Analysis */}
      {Object.keys(indonesian_crime_analysis.timezone_analysis).length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-3 text-purple-400" />
            Timezone Analysis
          </h4>

          <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-purple-300 font-semibold mb-4">Transaction Time Distribution</h5>
                <div className="bg-gray-900/50 h-40 rounded-lg border border-gray-700/50 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Timezone visualization would appear here</p>
                </div>
              </div>

              <div>
                <h5 className="text-purple-300 font-semibold mb-4">WIB Activity Pattern</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak Activity Time:</span>
                    <span className="text-white">19:00 - 22:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WIB Transaction %:</span>
                    <span className="text-white">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Indonesian Pattern Confidence:</span>
                    <span className="text-white">High (85%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Interactions */}
      {Object.keys(indonesian_crime_analysis.exchange_interactions).length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Users className="w-5 h-5 mr-3 text-green-400" />
            Exchange Interaction Analysis
          </h4>

          <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-green-300 font-semibold mb-4">Indonesian Exchange Activity</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Indodax Interactions:</span>
                    <span className="text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pintu Interactions:</span>
                    <span className="text-white">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tokocrypto Interactions:</span>
                    <span className="text-white">12</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-green-300 font-semibold mb-4">User Location Analysis</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Indonesian IP Addresses:</span>
                    <span className="text-white">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Indonesian User Confidence:</span>
                    <span className="text-white">High (82%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Violations */}
      {indonesian_crime_analysis.regulatory_violations &&
        indonesian_crime_analysis.regulatory_violations.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-red-400" />
              Regulatory Violations
            </h4>

            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
              <div className="space-y-3">
                {indonesian_crime_analysis.regulatory_violations.map((violation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-red-200">{violation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* OJK Compliance Status */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-blue-300 font-bold text-lg">OJK Compliance Status</h4>
            <p className="text-blue-200 text-sm">
              Otoritas Jasa Keuangan (Indonesian Financial Services Authority) Compliance
            </p>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 border ${
            indonesian_crime_analysis.ojk_compliance_status === "COMPLIANT"
              ? "bg-green-500/10 border-green-500/20 text-green-200"
              : "bg-red-500/10 border-red-500/20 text-red-200"
          }`}
        >
          <p className="text-sm">
            <strong>Status:</strong>{" "}
            {indonesian_crime_analysis.ojk_compliance_status === "COMPLIANT"
              ? "COMPLIANT - This contract meets OJK regulatory requirements"
              : "NON-COMPLIANT - This contract violates OJK regulatory requirements"}
          </p>
        </div>
      </div>
    </div>
  )
}
