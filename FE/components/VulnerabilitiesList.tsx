"use client"

import { useState } from "react"
import { Bug, Target, ShieldCheck, Code, ArrowRight } from "lucide-react"
import { getSeverityColor } from "@/utils/riskUtils"
import type { AuditData, VulnerabilityDetail } from "@/types"

interface VulnerabilitiesListProps {
  auditData: AuditData
  showAdvancedMode: boolean
}

const getUserFriendlyVuln = (vuln: VulnerabilityDetail) => {
  const userFriendlyTypes: Record<string, string> = {
    "reentrancy-eth": "Reentrancy Attack Risk",
    "tx-origin": "Unsafe Authentication",
    "unchecked-transfer": "Unchecked Token Transfers",
    "uninitialized-state": "Uninitialized Variables",
    "locked-ether": "Trapped Funds Risk",
    "arbitrary-send": "Arbitrary Fund Transfer",
    "controlled-array-length": "Gas Limit Issues",
    timestamp: "Time Manipulation Risk",
    "weak-prng": "Predictable Randomness",
    suicidal: "Contract Self-Destruct Risk",
    "naming-convention": "Code Style Issues",
    "too-many-digits": "Number Readability",
    "immutable-states": "State Optimization",
  }

  const userImpacts: Record<string, string> = {
    "reentrancy-eth": "Attackers could drain funds by repeatedly calling withdrawal functions",
    "tx-origin": "Your transactions could be authorized by malicious contracts",
    "unchecked-transfer": "Failed token transfers might not be detected, causing loss",
    "uninitialized-state": "Contract behavior might be unpredictable",
    "locked-ether": "Any ETH sent to this contract could be permanently stuck",
    "arbitrary-send": "Contract owners can redirect your funds anywhere",
    "controlled-array-length": "Transactions might fail due to gas limits",
    timestamp: "Time-based features can be manipulated by miners",
    "weak-prng": "Random outcomes can be predicted and exploited",
    suicidal: "The contract can be destroyed, making your tokens worthless",
    "naming-convention": "Poor code readability may hide security issues",
    "too-many-digits": "Large numbers without separators are hard to verify",
    "immutable-states": "Variables could be optimized for better gas efficiency",
  }

  return {
    friendlyName: userFriendlyTypes[vuln.type] || vuln.type,
    userImpact: userImpacts[vuln.type] || vuln.description,
  }
}

export const VulnerabilitiesList = ({ auditData, showAdvancedMode }: VulnerabilitiesListProps) => {
  const [expandedVulns, setExpandedVulns] = useState<number[]>([])

  const toggleVulnerability = (index: number) => {
    setExpandedVulns((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  if (!auditData.vulnerabilities || auditData.vulnerabilities.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-gray-700/50 shadow-xl hover:shadow-green-500/10 transition-all duration-500">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
          <Bug className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-green-400" />
          Vulnerabilities Detected
        </h3>
        <div className="text-center text-gray-300 text-lg sm:text-xl">
          🎉 No vulnerabilities found! This contract appears to be secure.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-red-500/30 shadow-xl">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-red-400 flex items-center">
          <Bug className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 animate-pulse" />
          Detected Vulnerabilities ({auditData.vulnerabilities.length})
        </h3>
        {!showAdvancedMode && (
          <div className="text-xs sm:text-sm text-gray-400 bg-gray-700/50 px-3 sm:px-4 py-2 rounded-lg">
            Simple View - Click vulnerabilities for details
          </div>
        )}
      </div>
      <div className="space-y-4 sm:space-y-6">
        {auditData.vulnerabilities.map((vuln, index) => {
          const friendlyVuln = getUserFriendlyVuln(vuln)
          const isExpanded = expandedVulns.includes(index)
          return (
            <div
              key={index}
              className="bg-red-500/10 border-red-500/30 rounded-xl backdrop-blur-sm hover:bg-red-500/15 transition-all duration-300"
            >
              <button
                onClick={() => toggleVulnerability(index)}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-red-500/5 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold border ${getSeverityColor(vuln.severity)}`}
                  >
                    {vuln.severity.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-white text-base sm:text-lg">{friendlyVuln.friendlyName}</h4>
                  {!showAdvancedMode && (
                    <span className="text-gray-400 text-xs sm:text-sm bg-gray-700/30 px-2 sm:px-3 py-1 rounded-full">
                      Click to expand
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {showAdvancedMode && vuln.line_number && (
                    <span className="text-gray-400 text-xs sm:text-sm">Line {vuln.line_number}</span>
                  )}
                  <ArrowRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                  />
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border-red-500/20">
                      <h5 className="font-bold text-red-300 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {showAdvancedMode ? "Impact Analysis" : "What This Means"}
                      </h5>
                      <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                        {showAdvancedMode ? vuln.impact : friendlyVuln.userImpact}
                      </p>
                      {showAdvancedMode && vuln.function_name && (
                        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border-gray-700/30">
                          <p className="text-gray-300 text-xs sm:text-sm">
                            <strong>Function:</strong> <code className="text-blue-300">{vuln.function_name}</code>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border-blue-500/20">
                      <h5 className="font-bold text-blue-300 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {showAdvancedMode ? "Recommended Fix" : "How to Fix"}
                      </h5>
                      <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{vuln.recommendation}</p>
                    </div>
                  </div>
                  {showAdvancedMode && (
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-900/30 rounded-xl border-gray-700/30">
                      <h5 className="font-bold text-gray-300 mb-3 flex items-center">
                        <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Technical Details
                      </h5>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-mono bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                        {vuln.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
