"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  FileText,
  History,
  Search,
  RefreshCw,
  ExternalLink,
  Info,
  Lock,
  Users,
  Award,
  Star,
  Copy,
  Activity,
  Brain,
  ArrowRight,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Target,
  Timer,
  Code,
  Bug,
  ShieldCheck,
  Flame,
  Lightbulb,
  Rocket,
  Crown,
  Gem,
} from "lucide-react"

const ContractSafetyChecker = () => {
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const [chain, setChain] = useState("ethereum")
  const [activeTab, setActiveTab] = useState("check")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [histLoad, setHistLoad] = useState(false)
  const [histError, setHistError] = useState<string | null>(null)

  // Enhanced UX States
  const [showNotifications, setShowNotifications] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [expandedVulns, setExpandedVulns] = useState<number[]>([])
  const [animatingMetrics, setAnimatingMetrics] = useState(false)
  const [showAdvancedMode, setShowAdvancedMode] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [progressStep, setProgressStep] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Toast notification system
  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToastMessage({ type, message })
    setTimeout(() => setToastMessage(null), 4000)
  }

  interface VulnerabilityDetail {
    type: string
    severity: "Low" | "Medium" | "High" | "Critical" | "Informational"
    description: string
    impact: string
    recommendation: string
    line_number?: number
    function_name?: string
  }

  interface SecurityMetrics {
    total_issues: number
    critical_issues: number
    high_issues: number
    medium_issues: number
    low_issues: number
    informational_issues: number
    code_quality_score: number
    security_score: number
    trust_score: number
    contract_age_days: number
    transaction_count: number
    unique_users: number
  }

  interface AuditData {
    contract_address: string
    chain: string
    audit_timestamp: string
    risk_level: "Low" | "Medium" | "High" | "Critical"
    risk_score: number
    security_metrics: SecurityMetrics
    vulnerabilities: VulnerabilityDetail[]
    ai_summary: string
    recommendations: string[]
    gas_optimization_hints: string[]
    audit_file_path: string
    contract_info: ContractInfo
    ownership_analysis: OwnershipAnalysis
    trading_analysis: TradingAnalysis
    social_presence: SocialPresence
  }

  interface HistoryItem {
    timestamp: string
    total_issues: number
    file_path: string
  }

  interface ContractInfo {
    is_verified: boolean
    verification_date?: string
    compiler_version?: string
    contract_name?: string
    proxy_type?: string
    implementation_address?: string
  }

  interface OwnershipAnalysis {
    owner_address?: string
    is_multisig: boolean
    ownership_renounced: boolean
    admin_functions: string[]
    centralization_risk: string
  }

  interface TradingAnalysis {
    is_honeypot: boolean
    honeypot_confidence: number
    buy_tax?: number
    sell_tax?: number
    liquidity_locked: boolean
    trading_enabled: boolean
    max_transaction_limit?: string
  }

  interface SocialPresence {
    website?: string
    twitter?: string
    telegram?: string
    github?: string
    discord?: string
    social_score: number
  }

  const checkContract = async () => {
    if (!address.trim()) {
      setError("Please enter a contract address")
      showToast("error", "Please enter a contract address")
      return
    }

    setLoading(true)
    setError(null)
    setProgressStep(0)
    setAnimatingMetrics(false) // Reset animation state

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("http://localhost:8000/audit-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chain }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "Unknown error")
      }
      const data: AuditData = await response.json()
      setAuditData(data)
      setActiveTab("results")
      setProgressStep(100)
      showToast("success", "Contract analysis completed successfully!")

      // Trigger animation after a short delay
      setTimeout(() => {
        setAnimatingMetrics(true)
        // Reset animation state after animation completes
        setTimeout(() => setAnimatingMetrics(false), 3000)
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to check contract safety.")
      showToast("error", err.message || "Failed to check contract safety.")
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
      setProgressStep(0)
    }
  }

  const fetchHistory = async (addr: string) => {
    if (!addr) return
    setHistLoad(true)
    setHistError(null)
    try {
      const res = await fetch(`http://localhost:8000/audit-history/${addr}`)
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data.history || [])
      showToast("success", "History loaded successfully!")
    } catch (e: any) {
      setHistError(e.message)
      showToast("error", "Failed to load history")
    } finally {
      setHistLoad(false)
    }
  }

  const openHistoryTab = () => {
    setActiveTab("history")
    fetchHistory(address)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      showToast("success", "Address copied to clipboard!")
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      showToast("error", "Failed to copy address")
    }
  }

  const toggleVulnerability = (index: number) => {
    setExpandedVulns((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const shareReport = async () => {
    if (!auditData) return
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
        copyToClipboard(window.location.href)
      }
    } else {
      copyToClipboard(window.location.href)
    }
  }

  const getUserRiskLevel = (risk?: string): string => {
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

  const getRiskColor = (risk?: string): string => {
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

  const getRiskTextColor = (risk?: string): string => {
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

  const getSeverityColor = (severity?: string): string => {
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

  const getRiskIcon = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return <CheckCircle className="w-20 h-20 text-emerald-400" />
      case "medium":
        return <AlertTriangle className="w-20 h-20 text-amber-400" />
      case "high":
        return <XCircle className="w-20 h-20 text-red-400" />
      case "critical":
        return <XCircle className="w-20 h-20 text-red-500" />
      default:
        return <Info className="w-20 h-20 text-gray-400" />
    }
  }

  const getUserRecommendation = (risk?: string): string => {
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

  // Enhanced Risk Gauge with animations - FIXED VERSION
  const RiskGauge: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (score / 100) * circumference
    const strokeColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"

    return (
      <div className="flex flex-col items-center group">
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <svg className="relative w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={strokeColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${strokeColor}40)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-300 text-center">{label}</p>
      </div>
    )
  }

  // Toast Notification Component
  const ToastNotification = () => {
    if (!toastMessage) return null

    const bgColor =
      toastMessage.type === "success"
        ? "bg-emerald-500/20 border-emerald-500/30"
        : toastMessage.type === "error"
          ? "bg-red-500/20 border-red-500/30"
          : "bg-blue-500/20 border-blue-500/30"

    const textColor =
      toastMessage.type === "success"
        ? "text-emerald-300"
        : toastMessage.type === "error"
          ? "text-red-300"
          : "text-blue-300"

    return (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
        <div
          className={`${bgColor} ${textColor} px-6 py-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center space-x-3`}
        >
          {toastMessage.type === "success" && <CheckCircle className="w-5 h-5" />}
          {toastMessage.type === "error" && <XCircle className="w-5 h-5" />}
          {toastMessage.type === "info" && <Info className="w-5 h-5" />}
          <span className="font-medium">{toastMessage.message}</span>
        </div>
      </div>
    )
  }

  // Progress Bar Component
  const ProgressBar = () => {
    if (!loading) return null

    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progressStep}%` }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      <ToastNotification />
      <ProgressBar />

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>

        {/* Interactive mouse follower */}
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
          }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Enhanced Hackathon Badge */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-3 border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center space-x-2">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-8 w-auto"
            />
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                Built for BI - OJK
              </p>
              <p className="text-xs text-gray-400">Hackathon 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-20">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-full px-6 py-3 mb-8 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-5 sm:h-6 w-auto mr-3 group-hover:animate-pulse"
            />
            <span className="text-gray-300 font-medium text-sm group-hover:text-white transition-colors">
              Proudly built for BI - OJK Hackathon 2025
            </span>
          </div>

          {/* Main Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-2xl border-blue-400/30 hover:scale-105 transition-transform duration-300 group">
                <Shield className="w-16 h-16 text-white group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Auto Sentinel
            </span>
            <span className="animate-wave inline-block">✌️</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Auto Sentinel stops web3 threats before they do any damage
            </span>{" "}
            with the most accurate real-time advanced warning system powered by AI.
          </p>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border-gray-700/50 shadow-2xl">
            <div className="flex space-x-2">
              {[
                { id: "check", label: "Security Analysis", icon: Search },
                { id: "results", label: "Threat Report", icon: Shield, disabled: !auditData },
                { id: "history", label: "Analysis History", icon: History },
              ].map(({ id, label, icon: Icon, disabled }) => (
                <button
                  key={id}
                  onClick={() => (id === "history" ? openHistoryTab() : setActiveTab(id))}
                  disabled={disabled}
                  className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 hover:scale-105 relative overflow-hidden ${
                    activeTab === id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105 border-blue-400/30"
                      : disabled
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {activeTab === id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse"></div>
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${activeTab === id ? "animate-pulse" : ""}`} />
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Analysis Interface */}
        {activeTab === "check" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient-shift"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-blue-500/30 hover:scale-110 transition-transform duration-300 group">
                    <Brain className="w-12 h-12 text-blue-400 group-hover:animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Threat Detection</h2>
                  <p className="text-gray-300 text-lg">
                    Real-time smart contract vulnerability assessment with advanced AI analysis
                  </p>
                </div>

                {/* Enhanced Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    {
                      icon: Zap,
                      title: "Real-time Analysis",
                      desc: "Instant threat detection and assessment",
                      gradient: "from-yellow-400 to-orange-500",
                    },
                    {
                      icon: Brain,
                      title: "AI-Powered Detection",
                      desc: "Advanced machine learning algorithms",
                      gradient: "from-purple-400 to-pink-500",
                    },
                    {
                      icon: Shield,
                      title: "Comprehensive Coverage",
                      desc: "50+ vulnerability patterns detected",
                      gradient: "from-blue-400 to-cyan-500",
                    },
                  ].map(({ icon: Icon, title, desc, gradient }, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 rounded-xl p-6 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2 relative z-10 group-hover:text-blue-200 transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-400 text-sm relative z-10 group-hover:text-gray-300 transition-colors">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Smart Contract Address</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter contract address (0x...)"
                        className="w-full px-6 py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500 text-lg backdrop-blur-xl hover:border-gray-600/50 group-hover:shadow-lg"
                      />
                      <Search className="absolute right-5 top-5 w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <div className="absolute inset-0 rounded-xl border-2 border-blue-500/0 group-focus-within:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Blockchain Network</label>
                    <select
                      value={chain}
                      onChange={(e) => setChain(e.target.value)}
                      className="w-full px-6 py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg backdrop-blur-xl hover:border-gray-600/50 hover:shadow-lg"
                    >
                      <option value="ethereum" className="bg-gray-900">
                        Ethereum Mainnet
                      </option>
                      <option value="polygon" className="bg-gray-900">
                        Polygon
                      </option>
                      <option value="bsc" className="bg-gray-900">
                        Binance Smart Chain
                      </option>
                      <option value="arbitrum" className="bg-gray-900">
                        Arbitrum
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={checkContract}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 px-8 rounded-xl font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center group border-blue-400/30 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <>
                        <RefreshCw className="w-7 h-7 animate-spin mr-4 relative z-10" />
                        <span className="relative z-10">Analyzing Threats...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform relative z-10" />
                        <span className="relative z-10">Start Threat Detection</span>
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="bg-red-500/20 border-red-500/30 rounded-xl p-6 flex items-center backdrop-blur-xl animate-shake">
                      <XCircle className="w-6 h-6 text-red-400 mr-4 animate-pulse" />
                      <span className="text-red-300 font-medium text-lg">{error}</span>
                    </div>
                  )}

                  {/* Enhanced Sample Contracts */}
                  <div className="bg-gray-900/50 rounded-xl p-8 border-gray-700/50 backdrop-blur-xl">
                    <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                      <Star className="w-6 h-6 mr-3 text-yellow-400 animate-pulse" />
                      Test with Sample Contracts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          address: "0xef9f4c0c3403d269c867c908e7f66748cc17f28a",
                          name: "Low Risk Contract",
                          risk: "SAFE",
                          color: "emerald",
                          icon: CheckCircle,
                        },
                        {
                          address: "0x08910C71bf5f36725842d0d5747f7894ffe88858",
                          name: "Medium Risk Contract",
                          risk: "CAUTION",
                          color: "amber",
                          icon: AlertTriangle,
                        },
                        {
                          address: "0x82340b6138Cf09Fa8008A44c50C691C89cdfF495",
                          name: "High Risk Contract",
                          risk: "DANGER",
                          color: "red",
                          icon: XCircle,
                        },
                      ].map(({ address: addr, name, risk, color, icon: Icon }, i) => (
                        <button
                          key={i}
                          onClick={() => setAddress(addr)}
                          className="p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border-gray-700/50 hover:border-gray-600/50 transition-all group text-left hover:scale-105 hover:shadow-lg relative overflow-hidden"
                        >
                          <div
                            className={`absolute inset-0 bg-${color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                          ></div>
                          <div className="flex items-center justify-between mb-3 relative z-10">
                            <Icon className={`w-6 h-6 text-${color}-400 group-hover:animate-bounce`} />
                            <span
                              className={`text-${color}-400 text-sm font-bold px-3 py-1 bg-${color}-500/20 rounded-full border-${color}-500/30 animate-pulse`}
                            >
                              {risk}
                            </span>
                          </div>
                          <h4 className="text-white font-medium group-hover:text-gray-200 transition-colors relative z-10">
                            {name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-2 relative z-10">Click to test analysis</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Threat Report Results */}
        {activeTab === "results" && auditData && (
          <div className="space-y-10">
            {/* Action Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              

              <button
                onClick={shareReport}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Report</span>
              </button>

              <button
                onClick={() => setShowAdvancedMode(!showAdvancedMode)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
                  showAdvancedMode
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    : "bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50"
                }`}
              >
                {showAdvancedMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span>{showAdvancedMode ? "Simple View" : "Advanced View"}</span>
                {!showAdvancedMode && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full ml-2">
                    User Friendly
                  </span>
                )}
              </button>
            </div>

            {/* Enhanced Threat Status */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 animate-gradient-shift"></div>

                <div className="mb-8 relative z-10 transform hover:scale-110 transition-transform duration-300">
                  {getRiskIcon(auditData.risk_level)}
                </div>

                <h2 className="text-5xl font-bold text-white mb-6 relative z-10">
                  {getUserRiskLevel(auditData.risk_level)}
                </h2>

                <div
                  className={`inline-flex px-8 py-4 rounded-full font-bold text-xl border-2 bg-gradient-to-r ${getRiskColor(auditData.risk_level)} text-white shadow-2xl border-white/20 relative z-10 animate-pulse-glow`}
                >
                  {auditData.risk_level.toUpperCase()} THREAT LEVEL
                </div>

                <div className="mt-8 bg-gray-900/50 rounded-2xl p-8 border-gray-700/50 max-w-3xl relative z-10 hover:bg-gray-800/50 transition-all duration-300">
                  <h3 className="font-bold text-white mb-4 text-2xl">Threat Assessment</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{getUserRecommendation(auditData.risk_level)}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Threat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
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
              ].map(({ title, value, icon: Icon, color, gradient }, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20 border-white/10 relative group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="absolute inset-0 bg-gray-900/100 rounded-xl"></div>
                      <Icon className={`w-8 h-8 ${color} relative z-10 group-hover:animate-pulse`} />
                    </div>
                    <div className={`text-3xl font-bold ${color} relative z-10`}>{value}</div>
                  </div>
                  <p className="text-gray-300 font-medium text-lg relative z-10 group-hover:text-white transition-colors">
                    {title}
                  </p>
                </div>
              ))}
            </div>

            {/* Enhanced Security Analysis Metrics - dengan Simple View indicator */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-bold text-white flex items-center">
                  <Activity className="w-8 h-8 mr-4 text-blue-400 animate-pulse" />
                  Enhanced Security Metrics
                </h3>
                {!showAdvancedMode && (
                  <div className="text-sm text-gray-400 bg-gray-700/50 px-4 py-2 rounded-lg flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Simple View Active
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <RiskGauge score={auditData.security_metrics.trust_score} label="Trust Score" />
                <RiskGauge score={auditData.security_metrics.security_score} label="Security Score" />
                <RiskGauge score={auditData.security_metrics.code_quality_score} label="Code Quality" />
                <RiskGauge score={auditData.social_presence.social_score} label="Social Score" />
              </div>
            </div>

            {/* Enhanced AI Threat Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl hover:shadow-purple-500/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 animate-gradient-shift"></div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-8 flex items-center relative z-10">
                <Brain className="w-8 h-8 mr-4 text-purple-400 animate-pulse" />
                AI Threat Analysis Report
              </h3>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-8 border-blue-500/20 backdrop-blur-sm text-gray-200 text-base leading-relaxed space-y-6 relative z-10 hover:border-purple-500/30 transition-all duration-300">
                <div dangerouslySetInnerHTML={{ __html: auditData.ai_summary }} />
              </div>
            </div>

            {/* Enhanced Security Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contract Verification Status */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-blue-400" />
                    Contract Verification
                  </h4>
                </div>
                <div
                  className={`p-6 rounded-xl ${getVerificationStatus(auditData.contract_info).bgColor} ${getVerificationStatus(auditData.contract_info).borderColor} border backdrop-blur-sm`}
                >
                  <p className={`font-bold text-xl mb-2 ${getVerificationStatus(auditData.contract_info).color}`}>
                    {getVerificationStatus(auditData.contract_info).status}
                  </p>
                  {auditData.contract_info.contract_name && (
                    <p className="text-gray-300 mb-2">
                      <strong>Name:</strong> {auditData.contract_info.contract_name}
                    </p>
                  )}
                  {auditData.contract_info.compiler_version && (
                    <p className="text-gray-300">
                      <strong>Compiler:</strong> {auditData.contract_info.compiler_version}
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot Detection */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3 text-amber-400" />
                    Honeypot Detection
                  </h4>
                </div>
                <div
                  className={`p-6 rounded-xl ${getHoneypotStatus(auditData.trading_analysis).bgColor} ${getHoneypotStatus(auditData.trading_analysis).borderColor} border backdrop-blur-sm`}
                >
                  <p className={`font-bold text-xl mb-2 ${getHoneypotStatus(auditData.trading_analysis).color}`}>
                    {getHoneypotStatus(auditData.trading_analysis).status}
                  </p>
                  <p className="text-gray-300 text-sm">{getHoneypotStatus(auditData.trading_analysis).description}</p>
                  {auditData.trading_analysis.buy_tax !== null && (
                    <div className="mt-4 space-y-1">
                      <p className="text-gray-300 text-sm">
                        <strong>Buy Tax:</strong>{" "}
                        {auditData.trading_analysis.buy_tax ? `${auditData.trading_analysis.buy_tax}%` : "Unknown"}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong>Sell Tax:</strong>{" "}
                        {auditData.trading_analysis.sell_tax ? `${auditData.trading_analysis.sell_tax}%` : "Unknown"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ownership Analysis */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <Users className="w-6 h-6 mr-3 text-purple-400" />
                    Ownership Analysis
                  </h4>
                </div>
                <div
                  className={`p-6 rounded-xl ${getOwnershipRisk(auditData.ownership_analysis).bgColor} ${getOwnershipRisk(auditData.ownership_analysis).borderColor} border backdrop-blur-sm`}
                >
                  <p className={`font-bold text-xl mb-4 ${getOwnershipRisk(auditData.ownership_analysis).color}`}>
                    {getOwnershipRisk(auditData.ownership_analysis).status}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Multisig:</span>
                      <span className={auditData.ownership_analysis.is_multisig ? "text-emerald-400" : "text-red-400"}>
                        {auditData.ownership_analysis.is_multisig ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Renounced:</span>
                      <span
                        className={
                          auditData.ownership_analysis.ownership_renounced ? "text-emerald-400" : "text-amber-400"
                        }
                      >
                        {auditData.ownership_analysis.ownership_renounced ? "✅ Yes" : "⚠️ No"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Admin Funcs:</span>
                      <span className="text-gray-300">{auditData.ownership_analysis.admin_functions.length} found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Statistics */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Activity className="w-8 h-8 mr-4 text-cyan-400" />
                Contract Activity Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl p-8 border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <Timer className="w-8 h-8 text-blue-400 group-hover:animate-pulse" />
                    </div>
                    <h4 className="text-4xl font-bold text-blue-400 mb-2">
                      {auditData.security_metrics.contract_age_days}
                    </h4>
                    <p className="text-gray-300 text-lg">Days Old</p>
                    <p className="text-gray-400 text-sm mt-2">Contract age indicates maturity</p>
                  </div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl p-8 border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-400 group-hover:animate-pulse" />
                    </div>
                    <h4 className="text-4xl font-bold text-purple-400 mb-2">
                      {auditData.security_metrics.transaction_count.toLocaleString()}
                    </h4>
                    <p className="text-gray-300 text-lg">Transactions</p>
                    <p className="text-gray-400 text-sm mt-2">Total blockchain interactions</p>
                  </div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl p-8 border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-emerald-400 group-hover:animate-pulse" />
                    </div>
                    <h4 className="text-4xl font-bold text-emerald-400 mb-2">
                      {auditData.security_metrics.unique_users.toLocaleString()}
                    </h4>
                    <p className="text-gray-300 text-lg">Unique Users</p>
                    <p className="text-gray-400 text-sm mt-2">Estimated unique addresses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Threat Vulnerabilities - dengan Simple View integration */}
            {auditData.vulnerabilities && auditData.vulnerabilities.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-red-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-red-400 flex items-center">
                    <Bug className="w-8 h-8 mr-4 animate-pulse" />
                    Detected Vulnerabilities ({auditData.vulnerabilities.length})
                  </h3>
                  {!showAdvancedMode && (
                    <div className="text-sm text-gray-400 bg-gray-700/50 px-4 py-2 rounded-lg">
                      Simple View - Click vulnerabilities for details
                    </div>
                  )}
                </div>
                <div className="space-y-6">
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
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-red-500/5 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-4 py-2 rounded-lg text-sm font-bold border ${getSeverityColor(vuln.severity)}`}
                            >
                              {vuln.severity.toUpperCase()}
                            </span>
                            <h4 className="font-bold text-white text-lg">{friendlyVuln.friendlyName}</h4>
                            {!showAdvancedMode && (
                              <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full">
                                Click to expand
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {showAdvancedMode && vuln.line_number && (
                              <span className="text-gray-400 text-sm">Line {vuln.line_number}</span>
                            )}
                            <ArrowRight
                              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-6 pb-6 animate-slide-down">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              <div className="bg-gray-900/50 rounded-xl p-6 border-red-500/20">
                                <h5 className="font-bold text-red-300 mb-4 flex items-center text-lg">
                                  <Target className="w-5 h-5 mr-2" />
                                  {showAdvancedMode ? "Impact Analysis" : "What This Means"}
                                </h5>
                                <p className="text-gray-200 leading-relaxed">
                                  {showAdvancedMode ? vuln.impact : friendlyVuln.userImpact}
                                </p>
                                {showAdvancedMode && vuln.function_name && (
                                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border-gray-700/30">
                                    <p className="text-gray-300 text-sm">
                                      <strong>Function:</strong>{" "}
                                      <code className="text-blue-300">{vuln.function_name}</code>
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="bg-gray-900/50 rounded-xl p-6 border-blue-500/20">
                                <h5 className="font-bold text-blue-300 mb-4 flex items-center text-lg">
                                  <ShieldCheck className="w-5 h-5 mr-2" />
                                  {showAdvancedMode ? "Recommended Fix" : "How to Fix"}
                                </h5>
                                <p className="text-gray-200 leading-relaxed">{vuln.recommendation}</p>
                              </div>
                            </div>

                            {showAdvancedMode && (
                              <div className="mt-6 p-6 bg-gray-900/30 rounded-xl border-gray-700/30">
                                <h5 className="font-bold text-gray-300 mb-3 flex items-center">
                                  <Code className="w-5 h-5 mr-2" />
                                  Technical Details
                                </h5>
                                <p className="text-gray-400 text-sm leading-relaxed font-mono bg-gray-800/50 p-4 rounded-lg">
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
            )}

            {/* Enhanced Recommendations */}
            {/* {auditData.recommendations && auditData.recommendations.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-blue-500/30 shadow-xl">
                <h3 className="text-3xl font-bold text-blue-400 mb-8 flex items-center">
                  <Lightbulb className="w-8 h-8 mr-4 animate-pulse" />
                  Security Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {auditData.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/10 border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:bg-blue-500/15 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 leading-relaxed">{rec}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Gas Optimization Hints */}
            {/* {auditData.gas_optimization_hints && auditData.gas_optimization_hints.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-green-500/30 shadow-xl">
                <h3 className="text-3xl font-bold text-green-400 mb-8 flex items-center">
                  <Flame className="w-8 h-8 mr-4 animate-pulse" />
                  Gas Optimization Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {auditData.gas_optimization_hints.map((hint, index) => (
                    <div
                      key={index}
                      className="bg-green-500/10 border-green-500/30 rounded-xl p-6 backdrop-blur-sm hover:bg-green-500/15 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500/20 p-3 rounded-lg border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Rocket className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 leading-relaxed">{hint}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Contract Intelligence */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <FileText className="w-8 h-8 mr-4 text-cyan-400" />
                Enhanced Contract Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Contract Address</label>
                    <div className="flex items-center bg-gray-900/50 rounded-xl p-4 border-gray-700/50 group hover:border-gray-600/50 transition-all duration-300">
                      <code className="font-mono text-sm text-gray-200 flex-1 break-all">
                        {auditData.contract_address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(auditData.contract_address)}
                        className={`ml-4 p-2 rounded-lg transition-all duration-300 ${
                          copiedAddress
                            ? "text-emerald-400 bg-emerald-500/20"
                            : "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        }`}
                      >
                        {copiedAddress ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Network</label>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <p className="capitalize font-medium text-gray-200 text-lg flex items-center">
                        <Gem className="w-5 h-5 mr-2 text-blue-400" />
                        {auditData.chain}
                      </p>
                    </div>
                  </div>
                  {auditData.contract_info.proxy_type && (
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3">Proxy Type</label>
                      <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                        <p className="font-medium text-gray-200 text-lg">{auditData.contract_info.proxy_type}</p>
                        {auditData.contract_info.implementation_address && (
                          <p className="text-gray-400 text-sm mt-2">
                            <strong>Implementation:</strong> {auditData.contract_info.implementation_address}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Analysis Timestamp</label>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <p className="font-medium text-gray-200 text-lg flex items-center">
                        <Timer className="w-5 h-5 mr-2 text-purple-400" />
                        {new Date(auditData.audit_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Social Legitimacy</label>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-200 text-lg flex items-center">
                          <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                          Social Score: {auditData.social_presence.social_score}/100
                        </p>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            auditData.social_presence.social_score >= 70
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : auditData.social_presence.social_score >= 40
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                          } border`}
                        >
                          {auditData.social_presence.social_score >= 70
                            ? "GOOD"
                            : auditData.social_presence.social_score >= 40
                              ? "MODERATE"
                              : "LOW"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Explorer</label>
                    <a
                      href={`https://etherscan.io/address/${auditData.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-6 py-4 rounded-xl font-medium transition-all border-blue-500/30 group hover:scale-105"
                    >
                      View on Etherscan
                      <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Technology Badge */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-10 border-blue-500/30 text-center backdrop-blur-xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 rounded-full border-blue-500/30 animate-pulse">
                  <Brain className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Advanced AI Security Technology</h4>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                Powered by next-generation artificial intelligence and machine learning algorithms. Our threat detection
                system analyzes patterns across millions of smart contracts to identify sophisticated attack vectors
                before they can cause damage.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Analysis History */}
        {activeTab === "history" && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <History className="w-8 h-8 mr-4 text-indigo-400" />
              Analysis History
            </h3>
            {histLoad && (
              <div className="text-center py-20">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gray-900/50 rounded-full p-6 border-gray-700/50">
                    <RefreshCw className="w-12 h-12 animate-spin text-blue-400" />
                  </div>
                </div>
                <p className="text-gray-300 text-xl">Loading analysis history...</p>
              </div>
            )}
            {histError && (
              <div className="bg-red-500/20 border-red-500/30 rounded-xl p-8 flex items-center backdrop-blur-xl">
                <XCircle className="w-8 h-8 text-red-400 mr-4" />
                <span className="text-red-300 font-medium text-lg">{histError}</span>
              </div>
            )}
            {!histLoad && history.length === 0 && !histError && (
              <div className="text-center py-24">
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative bg-gray-900/50 rounded-full p-8 border-gray-700/50">
                    <History className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <h4 className="text-3xl font-bold text-white mb-6">No Analysis History</h4>
                <p className="text-gray-400 mb-10 text-lg">
                  Start analyzing smart contracts to build your security history
                </p>
                <button
                  onClick={() => setActiveTab("check")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-blue-400/30"
                >
                  Start First Analysis
                </button>
              </div>
            )}
            {!histLoad && history.length > 0 && (
              <div className="space-y-6">
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
                        onClick={async () => {
                          setLoading(true)
                          try {
                            const res = await fetch(
                              `http://localhost:8000/load-audit-file?path=${encodeURIComponent(h.file_path)}&address=${address}&chain=${chain}`,
                            )
                            const result: AuditData = await res.json()
                            setAuditData(result)
                            setActiveTab("results")
                            showToast("success", "Historical report loaded successfully!")
                          } catch (err) {
                            showToast("error", "Failed to load analysis result")
                          } finally {
                            setLoading(false)
                          }
                        }}
                        className="w-full text-left p-8"
                        disabled={loading}
                      >
                        <div
                          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-5 rounded-xl border-blue-500/30 mr-6 group-hover:scale-110 transition-transform duration-300">
                              <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xl mb-2 group-hover:text-blue-300 transition-colors">
                                {formattedDate}
                              </p>
                              <p className="text-gray-400 text-lg">
                                Threats Found: <span className="font-medium text-amber-400">{h.total_issues}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {loading ? (
                              <div className="text-blue-400 flex items-center">
                                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                                <span className="font-medium text-lg">Loading...</span>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 px-8 py-4 rounded-xl font-medium hover:from-blue-500/30 hover:to-purple-600/30 transition-all border-blue-500/30 group-hover:border-blue-400/50 flex items-center">
                                View Report
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
        )}

        {/* Enhanced Footer */}
        <div className="text-center mt-24 py-16 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 text-left">
            {/* Logo BI-OJK */}
            <div className="flex items-center group hover:scale-105 transition-transform duration-300">
              <img
                src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                alt="BI Hackathon 2025"
                className="h-10 sm:h-12 md:h-16 w-auto group-hover:animate-pulse"
              />
              <div className="ml-4">
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Proudly built for</p>
                <p className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                  BI - OJK Hackathon 2025
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-gray-600 animate-pulse"></div>

            {/* Auto Sentinel Info */}
            <div className="flex items-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl border-blue-400/30 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                <Shield className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div className="ml-4">
                <span className="text-white font-bold text-2xl group-hover:text-blue-300 transition-colors">
                  Auto Sentinel
                  <span className="animate-wave inline-block ml-2">✌️</span>
                </span>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">By Anjay Mabar Team</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            This cutting-edge security platform was developed during the hackathon to demonstrate the future of{" "}
            <span className="text-blue-400 font-semibold">AI-powered blockchain security</span> and threat detection.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
              <Lock className="w-6 h-6 mr-3 text-blue-400 group-hover:animate-pulse" />
              <span className="text-lg group-hover:text-white transition-colors">Check Your Smart Contract</span>
            </div>
            <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
              <Brain className="w-6 h-6 mr-3 text-purple-400 group-hover:animate-pulse" />
              <span className="text-lg group-hover:text-white transition-colors">AI-Powered Detection</span>
            </div>
            <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
              <Zap className="w-6 h-6 mr-3 text-cyan-400 group-hover:animate-pulse" />
              <span className="text-lg group-hover:text-white transition-colors">AI Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.3); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  )
}

export default ContractSafetyChecker
