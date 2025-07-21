import { Award, Shield, AlertTriangle, XCircle, CheckCircle } from "lucide-react"
import { getRiskTextColor, getRiskColor } from "@/utils/riskUtils"
import type { AuditData } from "@/types"

interface ThreatMetricsProps {
  auditData: AuditData
}

export const ThreatMetrics = ({ auditData }: ThreatMetricsProps) => {
  const metrics = [
    {
      title: "Trust Score",
      value: `${auditData.security_metrics.trust_score}/100`,
      icon: Award,
      color:
        auditData.security_metrics.trust_score >= 70
          ? "text-emerald-400"
          : auditData.security_metrics.trust_score >= 50
            ? "text-amber-400"
            : "text-red-400",
      gradient:
        auditData.security_metrics.trust_score >= 70
          ? "from-emerald-400 to-green-500"
          : auditData.security_metrics.trust_score >= 50
            ? "from-amber-400 to-orange-500"
            : "from-red-400 to-red-600",
    },
    {
      title: "Threat Level",
      value: auditData.risk_level.toUpperCase(),
      icon: Shield,
      color: getRiskTextColor(auditData.risk_level),
      gradient: getRiskColor(auditData.risk_level),
    },
    {
      title: "Total Threats",
      value: auditData.security_metrics.total_issues,
      icon: AlertTriangle,
      color: "text-amber-400",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "Critical Threats",
      value: auditData.security_metrics.critical_issues + auditData.security_metrics.high_issues,
      icon: XCircle,
      color: "text-red-400",
      gradient: "from-red-400 to-red-600",
    },
    {
      title: "Security Score",
      value: `${auditData.security_metrics.security_score}/100`,
      icon: CheckCircle,
      color: "text-emerald-400",
      gradient: "from-emerald-400 to-green-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
      {metrics.map(({ title, value, icon: Icon, color, gradient }, i) => (
        <div
          key={i}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-8 border-gray-700/50 shadow-xl hover:scale-105 hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>

          <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-3 sm:mb-6 relative z-10">
            <div
              className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20 border-white/10 relative group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-0`}
            >
              <div className="absolute inset-0 bg-gray-900/100 rounded-lg sm:rounded-xl"></div>
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color} relative z-10 group-hover:animate-pulse`} />
            </div>
            <div className={`text-xl sm:text-3xl font-bold ${color} relative z-10 text-center sm:text-right`}>
              {value}
            </div>
          </div>
          <p className="text-gray-300 font-medium text-sm sm:text-lg relative z-10 group-hover:text-white transition-colors text-center sm:text-left">
            {title}
          </p>
        </div>
      ))}
    </div>
  )
}
