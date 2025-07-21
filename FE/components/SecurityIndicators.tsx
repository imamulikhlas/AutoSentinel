import { CheckCircle, AlertTriangle, Users } from "lucide-react"
import type { AuditData, ContractInfo, TradingAnalysis, OwnershipAnalysis } from "@/types"

interface SecurityIndicatorsProps {
  auditData: AuditData
}

const getVerificationStatus = (contractInfo: ContractInfo) => {
  if (contractInfo.is_verified) {
    return {
      status: "✅ Verified",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
    }
  }
  return {
    status: "❌ Not Verified",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
  }
}

const getHoneypotStatus = (tradingAnalysis: TradingAnalysis) => {
  if (tradingAnalysis.is_honeypot) {
    return {
      status: "🚨 HONEYPOT DETECTED",
      color: "text-red-500",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30",
      description: `High confidence (${(tradingAnalysis.honeypot_confidence * 100).toFixed(1)}%) this is a honeypot contract`,
    }
  }
  return {
    status: "✅ No Honeypot Detected",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    description: "Contract appears safe from honeypot characteristics",
  }
}

const getOwnershipRisk = (ownershipAnalysis: OwnershipAnalysis) => {
  const risk = ownershipAnalysis.centralization_risk.toLowerCase()
  if (risk === "high") {
    return {
      status: "🚨 High Centralization Risk",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30",
    }
  } else if (risk === "medium") {
    return {
      status: "⚠️ Medium Centralization Risk",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
    }
  }
  return {
    status: "✅ Low Centralization Risk",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
  }
}

export const SecurityIndicators = ({ auditData }: SecurityIndicatorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Contract Verification Status */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h4 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
            <span className="hidden sm:inline">Contract Verification</span>
            <span className="sm:hidden">Verification</span>
          </h4>
        </div>
        <div
          className={`p-4 sm:p-6 rounded-xl ${getVerificationStatus(auditData.contract_info).bgColor} ${getVerificationStatus(auditData.contract_info).borderColor} border backdrop-blur-sm`}
        >
          <p className={`font-bold text-lg sm:text-xl mb-2 ${getVerificationStatus(auditData.contract_info).color}`}>
            {getVerificationStatus(auditData.contract_info).status}
          </p>
          {auditData.contract_info.contract_name && (
            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <strong>Name:</strong> {auditData.contract_info.contract_name}
            </p>
          )}
          {auditData.contract_info.compiler_version && (
            <p className="text-gray-300 text-sm sm:text-base">
              <strong>Compiler:</strong> {auditData.contract_info.compiler_version}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot Detection */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h4 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
            <span className="hidden sm:inline">Honeypot Detection</span>
            <span className="sm:hidden">Honeypot</span>
          </h4>
        </div>
        <div
          className={`p-4 sm:p-6 rounded-xl ${getHoneypotStatus(auditData.trading_analysis).bgColor} ${getHoneypotStatus(auditData.trading_analysis).borderColor} border backdrop-blur-sm`}
        >
          <p className={`font-bold text-lg sm:text-xl mb-2 ${getHoneypotStatus(auditData.trading_analysis).color}`}>
            {getHoneypotStatus(auditData.trading_analysis).status}
          </p>
          <p className="text-gray-300 text-sm sm:text-base">
            {getHoneypotStatus(auditData.trading_analysis).description}
          </p>
        </div>
      </div>

      {/* Ownership Centralization Risk */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h4 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
            <span className="hidden sm:inline">Centralization Risk</span>
            <span className="sm:hidden">Centralization</span>
          </h4>
        </div>
        <div
          className={`p-4 sm:p-6 rounded-xl ${getOwnershipRisk(auditData.ownership_analysis).bgColor} ${getOwnershipRisk(auditData.ownership_analysis).borderColor} border backdrop-blur-sm`}
        >
          <p className={`font-bold text-lg sm:text-xl mb-2 ${getOwnershipRisk(auditData.ownership_analysis).color}`}>
            {getOwnershipRisk(auditData.ownership_analysis).status}
          </p>
          {auditData.ownership_analysis.owner_address && (
            <p className="text-gray-300 text-sm sm:text-base">
              <strong>Owner:</strong> {auditData.ownership_analysis.owner_address}
            </p>
          )}
          <p className="text-gray-300 text-sm sm:text-base">
            <strong>Multisig:</strong> {auditData.ownership_analysis.is_multisig ? "Yes" : "No"}
          </p>
          <p className="text-gray-300 text-sm sm:text-base">
            <strong>Renounced:</strong> {auditData.ownership_analysis.ownership_renounced ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  )
}
