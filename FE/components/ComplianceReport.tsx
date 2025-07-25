"use client"

import { useState } from "react"
import { FileText, Download, ExternalLink, AlertTriangle, Shield, Scale, Send } from "lucide-react"
import type { AuditData } from "@/types"
import { SatgasPastiReportModal } from "./SatgasPastiReportModal"

interface ComplianceReportProps {
  auditData: AuditData
  showToast: (type: "success" | "error" | "info", message: string) => void
}

export const ComplianceReport = ({ auditData, showToast }: ComplianceReportProps) => {
  const [loadingCompliance, setLoadingCompliance] = useState(false)
  const [detailedReport, setDetailedReport] = useState<any>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const complianceReport = auditData.compliance_report

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "BERAT":
        return "bg-red-600/20 text-red-200 border-red-600/30"
      case "SEDANG":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "RINGAN":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "IMMEDIATE_BLOCK":
        return "bg-red-600/20 text-red-200 border-red-600/30"
      case "INVESTIGATE":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "MONITOR":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const fetchDetailedComplianceReport = async () => {
    setLoadingCompliance(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${baseUrl}/compliance-report/${auditData.contract_address}`)

      if (!response.ok) {
        throw new Error("Failed to fetch detailed compliance report")
      }

      const data = await response.json()
      setDetailedReport(data)
      showToast("success", "Detailed compliance report loaded!")
    } catch (error) {
      showToast("error", "Failed to load detailed compliance report")
      console.error("Compliance report error:", error)
    } finally {
      setLoadingCompliance(false)
    }
  }

  const downloadComplianceReport = () => {
    const reportData = detailedReport || complianceReport
    const report = JSON.stringify(reportData, null, 2)
    const blob = new Blob([report], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `compliance-report-${auditData.contract_address}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast("success", "Compliance report downloaded!")
  }

  const reportToUse = detailedReport || complianceReport

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border border-gray-700/50 shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center mb-4 sm:mb-0">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-purple-400 animate-pulse" />
            Indonesian Legal Compliance Report
          </h3>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDetailedComplianceReport}
              disabled={loadingCompliance}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">{loadingCompliance ? "Loading..." : "Load Detailed Report"}</span>
            </button>

            <button
              onClick={downloadComplianceReport}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download Report</span>
            </button>
          </div>
        </div>

        {/* Compliance Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Compliance Status</h4>
              <Shield
                className={`w-5 h-5 ${reportToUse.compliance_status === "COMPLIANT" ? "text-green-400" : "text-red-400"}`}
              />
            </div>
            <div
              className={`text-lg font-bold ${reportToUse.compliance_status === "COMPLIANT" ? "text-green-400" : "text-red-400"}`}
            >
              {reportToUse.compliance_status}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Total Violations</h4>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">{reportToUse.total_violations}</div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Legal Risk Score</h4>
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400">{reportToUse.legal_risk_score}/20</div>
          </div>
        </div>

        {/* Violations Details */}
        {reportToUse.violations && reportToUse.violations.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
              Legal Violations ({reportToUse.violations.length})
            </h4>

            <div className="space-y-4">
              {reportToUse.violations.map((violation: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-900/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <h5 className="text-white font-semibold text-lg capitalize mb-2 lg:mb-0">
                      {violation.violation_type.replace(/_/g, " ")}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(violation.severity_level)}`}
                      >
                        {violation.severity_level}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(violation.compliance_action)}`}
                      >
                        {violation.compliance_action}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm font-medium">Law Article:</span>
                        <p className="text-orange-300 mt-1">{violation.law_article}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 text-sm font-medium">Penalty:</span>
                        <p className="text-red-300 mt-1">{violation.penalty_description}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 text-sm font-medium">Fine Amount:</span>
                        <p className="text-red-400 font-bold mt-1">{violation.fine_amount}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm font-medium">Enforcement Agency:</span>
                        <p className="text-blue-300 mt-1">{violation.enforcement_agency}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 text-sm font-medium">Satgas PASTI Priority:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${violation.satgas_pasti_priority ? "bg-red-500/20 text-red-300" : "bg-gray-500/20 text-gray-300"}`}
                        >
                          {violation.satgas_pasti_priority ? "HIGH PRIORITY" : "NORMAL"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {reportToUse.recommended_actions && reportToUse.recommended_actions.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-blue-400" />
              Immediate Actions Required
            </h4>

            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
              <div className="space-y-3">
                {reportToUse.recommended_actions.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-red-200">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Satgas PASTI Alert */}
        {reportToUse.satgas_pasti_report_required && (
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-6 border border-red-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-red-300 font-bold text-lg">URGENT: Satgas PASTI Report Required</h4>
                  <p className="text-red-200 text-sm">
                    This contract must be reported to Indonesian authorities within 24 hours
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 animate-pulse"
              >
                <Send className="w-5 h-5" />
                <span>Kirim Laporan ke Satgas PASTI</span>
              </button>
            </div>

            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20 mt-4">
              <p className="text-red-200 text-sm">
                🚨 <strong>CRITICAL ALERT:</strong> This smart contract has been flagged for serious regulatory
                violations under Indonesian law. Immediate reporting to Satgas PASTI (Satuan Tugas Penanganan Aktivitas
                Siber Terintegrasi) is mandatory. Failure to report may result in additional legal consequences.
              </p>
            </div>
          </div>
        )}

        {/* Report Metadata */}
        <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-600/30 mt-8">
          <h4 className="text-lg font-bold text-white mb-4">Report Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract Address:</span>
                  <span className="text-white font-mono text-sm">{reportToUse.contract_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Scan Timestamp:</span>
                  <span className="text-white">{new Date(reportToUse.scan_timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Report Version:</span>
                  <span className="text-white">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Compliance Framework:</span>
                  <span className="text-white">Indonesian Financial Regulations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Satgas PASTI Report Modal */}
      <SatgasPastiReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        complianceReport={reportToUse}
        contractAddress={auditData.contract_address}
        showToast={showToast}
      />
    </>
  )
}
