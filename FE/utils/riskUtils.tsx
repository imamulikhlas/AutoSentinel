import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

export const getUserRiskLevel = (risk?: string): string => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "Safe to Use"
    case "medium":
      return "Use with Caution"
    case "high":
      return "High Risk"
    case "critical":
      return "Do Not Use"
    default:
      return "Unknown"
  }
}

export const getRiskColor = (risk?: string): string => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "from-emerald-400 to-green-500"
    case "medium":
      return "from-amber-400 to-yellow-500"
    case "high":
      return "from-red-400 to-red-500"
    case "critical":
      return "from-red-500 to-red-700"
    default:
      return "from-gray-400 to-gray-500"
  }
}

export const getRiskTextColor = (risk?: string): string => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "text-emerald-400"
    case "medium":
      return "text-amber-400"
    case "high":
      return "text-red-400"
    case "critical":
      return "text-red-500"
    default:
      return "text-gray-400"
  }
}

export const getRiskIcon = (risk?: string) => {
  switch (risk?.toLowerCase()) {
    case "low":
      return <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-emerald-400" />
    case "medium":
      return <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-amber-400" />
    case "high":
      return <XCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-red-400" />
    case "critical":
      return <XCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-red-500" />
    default:
      return <Info className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-400" />
  }
}

export const getUserRecommendation = (risk?: string): string => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "This contract appears safe to interact with. No major security risks detected."
    case "medium":
      return "Exercise caution when using this contract. Some security concerns were found."
    case "high":
      return "High risk detected! Only interact with this contract if you understand the risks."
    case "critical":
      return "DO NOT USE this contract! Critical security flaws could result in loss of funds."
    default:
      return "Unable to determine safety level. Exercise extreme caution."
  }
}

export const getSeverityColor = (severity?: string): string => {
  switch (severity?.toLowerCase()) {
    case "low":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    case "medium":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    case "high":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    case "critical":
      return "bg-red-600/20 text-red-200 border-red-600/30"
    case "informational":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}
