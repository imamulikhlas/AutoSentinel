import { getRiskIcon, getUserRiskLevel, getRiskColor, getUserRecommendation } from "@/utils/riskUtils"
import type { AuditData } from "@/types"

interface ThreatStatusProps {
  auditData: AuditData
}

export const ThreatStatus = ({ auditData }: ThreatStatusProps) => {
  return (
    <div className="text-center">
      <div className="inline-flex flex-col items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 animate-gradient-shift"></div>

        <div className="mb-6 sm:mb-8 relative z-10 transform hover:scale-110 transition-transform duration-300">
          {getRiskIcon(auditData.risk_level)}
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-2xl font-bold text-white mb-4 sm:mb-6 relative z-10 px-4">
          {getUserRiskLevel(auditData.risk_level)}
        </h2>

        <div
          className={`inline-flex px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-lg border-1 bg-gradient-to-r ${getRiskColor(auditData.risk_level)} text-white shadow-2xl border-white/20 relative z-10`}
        >
          {auditData.risk_level.toUpperCase()} THREAT LEVEL
        </div>

        <div className="mt-6 sm:mt-8 bg-gray-900/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-gray-700/50 max-w-3xl relative z-10 hover:bg-gray-800/50 transition-all duration-300">
          <h3 className="font-bold text-white mb-3 sm:mb-4 text-xl sm:text-2xl">Threat Assessment</h3>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {getUserRecommendation(auditData.risk_level)}
          </p>
        </div>
      </div>
    </div>
  )
}
