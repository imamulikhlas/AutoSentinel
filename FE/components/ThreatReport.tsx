"use client"

import { useState } from "react"
import { AlertTriangle, FileText, Shield, Code, Zap, Activity, Scale } from "lucide-react"
import { SecurityMetrics } from "./SecurityMetrics"
import { RiskGauge } from "./RiskGauge"
import { AIAnalysis } from "./AIAnalysis"
import { SecurityIndicators } from "./SecurityIndicators"
import { ContractStatistics } from "./ContractStatistics"
import { VulnerabilitiesList } from "./VulnerabilitiesList"
import { ContractIntelligence } from "./ContractIntelligence"
import { IndonesianCrimeAnalysis } from "./IndonesianCrimeAnalysis"
import { ComplianceReport } from "./ComplianceReport"
import type { AuditData } from "@/types"
import { ThreatStatus } from "./ThreatStatus"

interface ThreatReportProps {
  auditData: AuditData
  showToast: (type: "success" | "error" | "info", message: string) => void
}

export const ThreatReport = ({ auditData, showToast }: ThreatReportProps) => {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4 mr-2" /> },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
    { id: "intelligence", label: "Intelligence", icon: <Zap className="w-4 h-4 mr-2" /> },
    // { id: "code", label: "Code Analysis", icon: <Code className="w-4 h-4 mr-2" /> },
    { id: "indonesian", label: "Indonesian Analysis", icon: <Shield className="w-4 h-4 mr-2" /> },
    { id: "compliance", label: "Compliance Report", icon: <Scale className="w-4 h-4 mr-2" /> },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-white">Security Analysis Report</h2>
          <p className="text-gray-400 mt-1">
            Contract: <span className="font-mono">{auditData.contract_address}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              auditData.risk_level === "Low"
                ? "bg-green-500/20 text-green-300"
                : auditData.risk_level === "Medium"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : auditData.risk_level === "High"
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-red-500/20 text-red-300"
            }`}
          >
            {auditData.risk_level} Risk
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
            Score: {auditData.risk_score}/100
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
            {auditData.chain}
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg flex items-center text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gray-800/80 text-white border-t border-l border-r border-purple-500/30"
                  : "bg-gray-900/50 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-px bg-purple-500/30 w-full"></div>
      </div>

      <div className="space-y-8">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SecurityMetrics auditData={auditData} />
              </div>
              <div>
              <ThreatStatus auditData={auditData} />
              </div>
            </div>
            <AIAnalysis auditData={auditData} />
            <SecurityIndicators auditData={auditData} />
            <ContractStatistics auditData={auditData} />
          </>
        )}

        {activeTab === "vulnerabilities" && <VulnerabilitiesList auditData={auditData} />}

        {activeTab === "intelligence" && <ContractIntelligence auditData={auditData} />}

        {/* {activeTab === "code" && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Contract Code Analysis</h3>
            </div>
            <p className="text-gray-400">
              The detailed code analysis would be displayed here, showing the contract source code with highlighted
              vulnerabilities and issues.
            </p>
          </div>
        )} */}

        {activeTab === "indonesian" && <IndonesianCrimeAnalysis auditData={auditData} />}

        {activeTab === "compliance" && <ComplianceReport auditData={auditData} showToast={showToast} />}
      </div>
    </div>
  )
}
