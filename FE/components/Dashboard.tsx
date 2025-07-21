"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Search,
  History,
  Key,
  BarChart3,
  Settings,
  Copy,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"
import { Navigation } from "./Navigation"
import { BackgroundElements } from "./BackgroundElements"
import { SecurityAnalysis } from "./SecurityAnalysis"
import { ThreatReport } from "./ThreatReport"
import { AnalysisHistory } from "./AnalysisHistory"
import { useContractAnalysis } from "@/hooks/useContractAnalysis"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { ToastNotification } from "./ToastNotification"
import { ProgressBar } from "./ProgressBar"
import type { AuditData, HistoryItem } from "@/types"

interface DashboardProps {
  onNavigate: (page: "landing" | "dashboard" | "docs") => void
  user: any
  onLogout: () => void
}

export const Dashboard = ({ onNavigate, user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [histLoad, setHistLoad] = useState(false)
  const [histError, setHistError] = useState<string | null>(null)
  const [copiedApiKey, setCopiedApiKey] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { regenerateApiKey } = useAuth()
  const { toastMessage, showToast } = useToast()
  const {
    auditData,
    error,
    loading,
    address,
    setAddress,
    chain,
    setChain,
    progressStep,
    checkContract,
    animatingMetrics,
    loadingMessage,
  } = useContractAnalysis(showToast, setActiveTab)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(user.apiKey)
      setCopiedApiKey(true)
      showToast("success", "API key copied to clipboard!")
      setTimeout(() => setCopiedApiKey(false), 2000)
    } catch (err) {
      showToast("error", "Failed to copy API key")
    }
  }

  const handleRegenerateApiKey = () => {
    regenerateApiKey()
    showToast("success", "API key regenerated successfully!")
  }

  const fetchHistory = async (addr: string) => {
    if (!addr) return
    setHistLoad(true)
    setHistError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockHistory: HistoryItem[] = [
        {
          timestamp: "20250120_143022",
          total_issues: 3,
          file_path: "/reports/audit_20250120_143022.json",
        },
        {
          timestamp: "20250119_091545",
          total_issues: 0,
          file_path: "/reports/audit_20250119_091545.json",
        },
      ]
      setHistory(mockHistory)
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

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "scanner", label: "Security Scanner", icon: Search },
    { id: "results", label: "Threat Report", icon: Shield, disabled: !auditData },
    { id: "history", label: "Analysis History", icon: History },
    { id: "api", label: "API Management", icon: Key },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === "history") {
      openHistoryTab()
    } else {
      setActiveTab(tabId)
    }
    setMobileMenuOpen(false)
  }

  const activeTabData = navigationItems.find((item) => item.id === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      <ToastNotification toastMessage={toastMessage} />
      <ProgressBar loading={loading} progressStep={progressStep} loadingMessage={loadingMessage} />
      <BackgroundElements mousePosition={mousePosition} />

      <Navigation onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-gray-400 text-lg">Monitor your smart contract security and API usage</p>
          </div>

          {/* Mobile Navigation Dropdown */}
          <div className="block lg:hidden mb-8">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border-gray-700/50 shadow-2xl">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center space-x-3">
                  {activeTabData && <activeTabData.icon className="w-5 h-5 text-blue-400" />}
                  <span className="font-medium">{activeTabData?.label || "Select Tab"}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileMenuOpen && (
                <div className="border-t border-gray-700/50 p-2">
                  {navigationItems.map(({ id, label, icon: Icon, disabled }) => (
                    <button
                      key={id}
                      onClick={() => handleTabChange(id)}
                      disabled={disabled}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === id
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border-blue-500/30"
                          : disabled
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex justify-center mb-12">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border-gray-700/50 shadow-2xl">
              <div className="flex space-x-2">
                {navigationItems.map(({ id, label, icon: Icon, disabled }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    disabled={disabled}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 hover:scale-105 relative overflow-hidden whitespace-nowrap ${
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

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "API Requests",
                    value: user.usage.requests.toLocaleString(),
                    limit: user.usage.limit.toLocaleString(),
                    icon: TrendingUp,
                    color: "blue",
                    percentage: (user.usage.requests / user.usage.limit) * 100,
                  },
                  {
                    title: "Plan",
                    value: user.plan.toUpperCase(),
                    icon: Users,
                    color: "purple",
                  },
                  {
                    title: "Uptime",
                    value: "99.9%",
                    icon: Zap,
                    color: "green",
                  },
                  {
                    title: "Threats Detected",
                    value: "127",
                    icon: AlertTriangle,
                    color: "red",
                  },
                ].map(({ title, value, limit, icon: Icon, color, percentage }, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border-gray-700/50 shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-${color}-500/20 border-${color}-500/30 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-6 h-6 text-${color}-400`} />
                      </div>
                      {percentage && (
                        <div
                          className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}
                        >
                          {percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
                    <div className="text-2xl font-bold text-white mb-1">{value}</div>
                    {limit && <div className="text-xs text-gray-500">of {limit} requests</div>}
                    {percentage && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r from-${color}-400 to-${color}-500 h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-blue-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <button
                    onClick={() => setActiveTab("scanner")}
                    className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border-blue-500/30 rounded-xl p-4 sm:p-6 text-left transition-all hover:scale-105 group"
                  >
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-3 sm:mb-4 group-hover:animate-pulse" />
                    <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">Scan Contract</h3>
                    <p className="text-gray-400 text-sm">Analyze smart contract security</p>
                  </button>

                  <button
                    onClick={() => setActiveTab("api")}
                    className="bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 border-green-500/30 rounded-xl p-4 sm:p-6 text-left transition-all hover:scale-105 group"
                  >
                    <Key className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-3 sm:mb-4 group-hover:animate-pulse" />
                    <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">Manage API</h3>
                    <p className="text-gray-400 text-sm">View keys and usage stats</p>
                  </button>

                  <button
                    onClick={() => onNavigate("docs")}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-purple-500/30 rounded-xl p-4 sm:p-6 text-left transition-all hover:scale-105 group"
                  >
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-3 sm:mb-4 group-hover:animate-pulse" />
                    <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">API Docs</h3>
                    <p className="text-gray-400 text-sm">Integration documentation</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scanner" && (
            <SecurityAnalysis
              address={address}
              setAddress={setAddress}
              chain={chain}
              setChain={setChain}
              loading={loading}
              error={error}
              checkContract={checkContract}
              loadingMessage={loadingMessage}
            />
          )}

          {activeTab === "results" && auditData && (
            <ThreatReport auditData={auditData} animatingMetrics={animatingMetrics} showToast={showToast} />
          )}

          {activeTab === "history" && (
            <AnalysisHistory
              histLoad={histLoad}
              histError={histError}
              history={history}
              address={address}
              chain={chain}
              loading={loading}
              setActiveTab={setActiveTab}
              showToast={showToast}
              setAuditData={(data: AuditData) => {
                // Handle audit data
              }}
            />
          )}

          {activeTab === "api" && (
            <div className="space-y-8">
              {/* API Key Management */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Key className="w-6 h-6 mr-3 text-blue-400" />
                  API Key Management
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Your API Key</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-900/50 rounded-xl p-4 border-gray-700/50 gap-4">
                      <code className="font-mono text-sm text-gray-200 flex-1 break-all">{user.apiKey}</code>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={copyApiKey}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                            copiedApiKey
                              ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
                              : "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                          }`}
                        >
                          {copiedApiKey ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span className="text-sm">{copiedApiKey ? "Copied!" : "Copy"}</span>
                        </button>
                        <button
                          onClick={handleRegenerateApiKey}
                          className="px-4 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 transition-all duration-300 border-purple-500/30 flex items-center space-x-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-sm">Regenerate</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Keep your API key secure. Don't share it publicly or commit it to version control.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                      <h3 className="text-white font-semibold mb-4">Usage Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Requests Used</span>
                          <span className="text-white font-medium">{user.usage.requests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Limit</span>
                          <span className="text-white font-medium">{user.usage.limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reset Date</span>
                          <span className="text-white font-medium">
                            {new Date(user.usage.resetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                      <h3 className="text-white font-semibold mb-4">Plan Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Plan</span>
                          <span className="text-white font-medium capitalize">{user.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Member Since</span>
                          <span className="text-white font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rate Limit</span>
                          <span className="text-white font-medium">100 req/min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Usage Chart Placeholder */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                  Usage Analytics
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-8 sm:p-12 border-gray-700/30 text-center">
                  <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-base sm:text-lg">Usage analytics chart would be displayed here</p>
                  <p className="text-gray-500 text-sm mt-2">Track your API usage patterns over time</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
