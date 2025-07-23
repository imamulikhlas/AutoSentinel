"use client"

import { useState } from "react"
import { Download, Eye, EyeOff, Share2, Bookmark, BookmarkCheck } from "lucide-react"
import { ThreatStatus } from "./ThreatStatus"
import { ThreatMetrics } from "./ThreatMetrics"
import { SecurityMetrics } from "./SecurityMetrics"
import { AIAnalysis } from "./AIAnalysis"
import { SecurityIndicators } from "./SecurityIndicators"
import { ContractStatistics } from "./ContractStatistics"
import { VulnerabilitiesList } from "./VulnerabilitiesList"
import { ContractIntelligence } from "./ContractIntelligence"
import { SecurityBadge } from "./SecurityBadge"
import type { AuditData } from "@/types"

interface ThreatReportProps {
  auditData: AuditData
  animatingMetrics: boolean
  showToast: (type: "success" | "error" | "info", message: string) => void
}

export const ThreatReport = ({ auditData, animatingMetrics, showToast }: ThreatReportProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showAdvancedMode, setShowAdvancedMode] = useState(false)

  const downloadReport = () => {
    const report = JSON.stringify(auditData, null, 2)
    const blob = new Blob([report], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `security-report-${auditData.contract_address}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast("success", "Security report downloaded!")
  }

  const shareReport = async () => {
    const shareData = {
      title: "Smart Contract Security Report",
      text: `Security analysis for ${auditData.contract_address}: ${auditData.risk_level} risk level`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        showToast("success", "Report shared successfully!")
      } catch (err) {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href)
          showToast("success", "Report link copied to clipboard!")
        } catch (clipErr) {
          showToast("error", "Failed to share report")
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        showToast("success", "Report link copied to clipboard!")
      } catch (err) {
        showToast("error", "Failed to copy link")
      }
    }
  }

  return (
    <div className="space-y-8 sm:space-y-10 px-4 sm:px-0">
      {/* Action Bar */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        {/* <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 border text-sm sm:text-base ${
            isBookmarked
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30"
              : "bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50"
          }`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button> */}

        <button
          onClick={downloadReport}
          className="flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Download Report</span>
        </button>

        {/* <button
          onClick={shareReport}
          className="flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 text-sm sm:text-base"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Share Report</span>
        </button> */}

        <button
          onClick={() => setShowAdvancedMode(!showAdvancedMode)}
          className={`flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 border text-sm sm:text-base ${
            showAdvancedMode
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              : "bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50"
          }`}
        >
          {showAdvancedMode ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="hidden sm:inline">{showAdvancedMode ? "Simple View" : "Advanced View"}</span>
          {!showAdvancedMode && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full ml-1 sm:ml-2 hidden sm:inline">
              User Friendly
            </span>
          )}
        </button>
      </div>

      <ThreatStatus auditData={auditData} />
      <ThreatMetrics auditData={auditData} />
      <SecurityMetrics auditData={auditData} animatingMetrics={animatingMetrics} showAdvancedMode={showAdvancedMode} />
      <AIAnalysis auditData={auditData} />
      <SecurityIndicators auditData={auditData} />
      <ContractStatistics auditData={auditData} />
      <VulnerabilitiesList auditData={auditData} showAdvancedMode={showAdvancedMode} />
      <ContractIntelligence auditData={auditData} showToast={showToast} />
      <SecurityBadge />
    </div>
  )
}
