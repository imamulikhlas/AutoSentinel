import { Activity, Eye } from "lucide-react"
import { RiskGauge } from "./RiskGauge"
import type { AuditData } from "@/types"

interface SecurityMetricsProps {
  auditData: AuditData
  animatingMetrics: boolean
  showAdvancedMode: boolean
}

export const SecurityMetrics = ({ auditData, animatingMetrics, showAdvancedMode }: SecurityMetricsProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-gray-700/50 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center mb-4 sm:mb-0">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-blue-400 animate-pulse" />
          Enhanced Security Metrics
        </h3>
        {!showAdvancedMode && (
          <div className="text-xs sm:text-sm text-gray-400 bg-gray-700/50 px-3 sm:px-4 py-2 rounded-lg flex items-center">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Simple View Active
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12">
        <RiskGauge score={auditData.security_metrics.trust_score} label="Trust Score" delay={0} />
        <RiskGauge score={auditData.security_metrics.security_score} label="Security Score" delay={200} />
        <RiskGauge score={auditData.security_metrics.code_quality_score} label="Code Quality" delay={400} />
        <RiskGauge score={auditData.social_presence.social_score} label="Social Score" delay={600} />
      </div>
    </div>
  )
}
