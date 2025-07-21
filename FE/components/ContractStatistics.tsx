import { Activity, Timer, TrendingUp, Users } from "lucide-react"
import type { AuditData } from "@/types"

interface ContractStatisticsProps {
  auditData: AuditData
}

export const ContractStatistics = ({ auditData }: ContractStatisticsProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-10 border-gray-700/50 shadow-xl">
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
        <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-cyan-400" />
        Contract Activity Statistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl p-6 sm:p-8 border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:animate-pulse" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
              {auditData.security_metrics.contract_age_days}
            </h4>
            <p className="text-gray-300 text-base sm:text-lg">Days Old</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Contract age indicates maturity</p>
          </div>
        </div>
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl p-6 sm:p-8 border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 group-hover:animate-pulse" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
              {auditData.security_metrics.transaction_count.toLocaleString()}
            </h4>
            <p className="text-gray-300 text-base sm:text-lg">Transactions</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Total blockchain interactions</p>
          </div>
        </div>
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl p-6 sm:p-8 border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 group-hover:animate-pulse" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">
              {auditData.security_metrics.unique_users.toLocaleString()}
            </h4>
            <p className="text-gray-300 text-base sm:text-lg">Unique Users</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Estimated unique addresses</p>
          </div>
        </div>
      </div>
    </div>
  )
}
