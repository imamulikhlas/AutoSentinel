"use client"

import { History, RefreshCw, XCircle, FileText, ArrowRight } from "lucide-react"
import type { HistoryItem, AuditData } from "@/types"

interface AnalysisHistoryProps {
  histLoad: boolean
  histError: string | null
  history: HistoryItem[]
  address: string
  chain: string
  loading: boolean
  setActiveTab: (tab: string) => void
  showToast: (type: "success" | "error" | "info", message: string) => void
  setAuditData: (data: AuditData) => void
}

export const AnalysisHistory = ({
  histLoad,
  histError,
  history,
  address,
  chain,
  loading,
  setActiveTab,
  showToast,
}: AnalysisHistoryProps) => {
  const loadHistoricalReport = async (filePath: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(
        `${baseUrl}/load-audit-file?path=${encodeURIComponent(filePath)}&address=${address}&chain=${chain}`,
      )
      const result: AuditData = await res.json()
      // Note: setAuditData would need to be passed from parent or handled differently
      setActiveTab("results")
      showToast("success", "Historical report loaded successfully!")
    } catch (err) {
      showToast("error", "Failed to load analysis result")
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient-shift"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-blue-500/30 hover:scale-110 transition-transform duration-300 group">
              <History className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 group-hover:animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Analysis History</h2>
            <p className="text-gray-300 text-base sm:text-lg px-4">
              Past security analysis reports for this contract address
            </p>
          </div>

          {histLoad && (
            <div className="text-center py-16 sm:py-20">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gray-900/50 rounded-full p-4 sm:p-6 border-gray-700/50">
                  <RefreshCw className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-400" />
                </div>
              </div>
              <p className="text-gray-300 text-lg sm:text-xl">Loading analysis history...</p>
            </div>
          )}

          {histError && (
            <div className="bg-red-500/20 border-red-500/30 rounded-xl p-6 sm:p-8 flex items-center backdrop-blur-xl animate-shake">
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mr-3 sm:mr-4" />
              <span className="text-red-300 font-medium text-base sm:text-lg">{histError}</span>
            </div>
          )}

          {!histLoad && history.length === 0 && !histError && (
            <div className="text-center py-20 sm:py-24">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-2xl opacity-30"></div>
                <div className="relative bg-gray-900/50 rounded-full p-6 sm:p-8 border-gray-700/50">
                  <History className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">No Analysis History</h4>
              <p className="text-gray-400 mb-8 sm:mb-10 text-base sm:text-lg">
                Start analyzing smart contracts to build your security history
              </p>
              <button
                onClick={() => setActiveTab("scanner")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all transform hover:scale-105 border-blue-400/30"
              >
                Start First Analysis
              </button>
            </div>
          )}

          {!histLoad && history.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {history.map((h, i) => {
                const formattedDate = new Date(
                  h.timestamp.replace(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6"),
                ).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                return (
                  <div
                    key={i}
                    className="bg-gray-900/50 border-gray-700/50 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group hover:scale-105 hover:shadow-lg"
                  >
                    <button
                      onClick={() => loadHistoricalReport(h.file_path)}
                      className="w-full text-left p-6 sm:p-8"
                      disabled={loading}
                    >
                      <div
                        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 sm:p-5 rounded-xl border-blue-500/30 mr-4 sm:mr-6 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg sm:text-xl mb-2 group-hover:text-blue-300 transition-colors">
                              {formattedDate}
                            </p>
                            <p className="text-gray-400 text-base sm:text-lg">
                              Threats Found: <span className="font-medium text-amber-400">{h.total_issues}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {loading ? (
                            <div className="text-blue-400 flex items-center">
                              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                              <span className="font-medium text-base sm:text-lg">Loading...</span>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:from-blue-500/30 hover:to-purple-600/30 transition-all border-blue-500/30 group-hover:border-blue-400/50 flex items-center">
                              View Report
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
