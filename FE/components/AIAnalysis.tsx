import { Brain } from "lucide-react"
import type { AuditData } from "@/types"

interface AIAnalysisProps {
  auditData: AuditData
}

export const AIAnalysis = ({ auditData }: AIAnalysisProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-gray-700/50 shadow-xl hover:shadow-purple-500/10 transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 animate-gradient-shift"></div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center relative z-10">
        <Brain className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-purple-400 animate-pulse" />
        AI Threat Analysis Report
      </h3>

      <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-6 sm:p-8 border-blue-500/20 backdrop-blur-sm text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 sm:space-y-6 relative z-10 hover:border-purple-500/30 transition-all duration-300">
        <div dangerouslySetInnerHTML={{ __html: auditData.ai_summary }} />
      </div>
    </div>
  )
}
