"use client"

import { useState } from "react"
import { FileText, Gem, Timer, Crown, Copy, CheckCircle, ExternalLink } from "lucide-react"
import type { AuditData } from "@/types"

interface ContractIntelligenceProps {
  auditData: AuditData
  showToast: (type: "success" | "error" | "info", message: string) => void
}

export const ContractIntelligence = ({ auditData, showToast }: ContractIntelligenceProps) => {
  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      showToast("success", "Address copied to clipboard!")
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      showToast("error", "Failed to copy address")
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-gray-700/50 shadow-xl">
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
        <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-cyan-400" />
        Enhanced Contract Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-3">Contract Address</label>
            <div className="flex items-center bg-gray-900/50 rounded-xl p-3 sm:p-4 border-gray-700/50 group hover:border-gray-600/50 transition-all duration-300">
              <code className="font-mono text-xs sm:text-sm text-gray-200 flex-1 break-all">
                {auditData.contract_address}
              </code>
              <button
                onClick={() => copyToClipboard(auditData.contract_address)}
                className={`ml-3 sm:ml-4 p-2 rounded-lg transition-all duration-300 ${
                  copiedAddress
                    ? "text-emerald-400 bg-emerald-500/20"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                }`}
              >
                {copiedAddress ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Network</label>
            <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border-gray-700/50">
              <p className="capitalize font-medium text-gray-200 text-base sm:text-lg flex items-center">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                {auditData.chain}
              </p>
            </div>
          </div>
          {auditData.contract_info.proxy_type && (
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Proxy Type</label>
              <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border-gray-700/50">
                <p className="font-medium text-gray-200 text-base sm:text-lg">{auditData.contract_info.proxy_type}</p>
                {auditData.contract_info.implementation_address && (
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    <strong>Implementation:</strong> {auditData.contract_info.implementation_address}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-3">Analysis Timestamp</label>
            <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border-gray-700/50">
              <p className="font-medium text-gray-200 text-base sm:text-lg flex items-center">
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                {new Date(auditData.audit_timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-3">Social Legitimacy</label>
            <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border-gray-700/50">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-200 text-base sm:text-lg flex items-center">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                  Social Score: {auditData.social_presence.social_score}/100
                </p>
                <div
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                    auditData.social_presence.social_score >= 70
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : auditData.social_presence.social_score >= 40
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                  } border`}
                >
                  {auditData.social_presence.social_score >= 70
                    ? "GOOD"
                    : auditData.social_presence.social_score >= 40
                      ? "MODERATE"
                      : "LOW"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Explorer</label>
            <a
              href={`https://etherscan.io/address/${auditData.contract_address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-medium transition-all border-blue-500/30 group hover:scale-105"
            >
              View on Etherscan
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
