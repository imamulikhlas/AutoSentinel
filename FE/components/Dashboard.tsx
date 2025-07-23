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
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"
import { SmoothButton } from "./SmoothButton"
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
    setAuditData,
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const res = await fetch(`${baseUrl}/audit-history/${addr}`)
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
          <SmoothTransition delay={0}>
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 transition-all duration-400 hover:scale-105">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-400 text-lg transition-colors duration-300 hover:text-gray-300">
                Monitor your smart contract security and API usage
              </p>
            </div>
          </SmoothTransition>

          {/* Mobile Navigation Dropdown */}
          <SmoothTransition delay={100}>
            <div className="block lg:hidden mb-8">
              <InteractiveCard className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border-gray-700/50 shadow-2xl">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between p-4 text-white transition-colors duration-300 hover:text-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    {activeTabData && (
                      <activeTabData.icon className="w-5 h-5 text-blue-400 transition-colors duration-300" />
                    )}
                    <span className="font-medium">{activeTabData?.label || "Select Tab"}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {mobileMenuOpen && (
                  <SmoothTransition delay={0}>
                    <div className="border-t border-gray-700/50 p-2">
                      {navigationItems.map(({ id, label, icon: Icon, disabled }, index) => (
                        <SmoothTransition key={id} delay={index * 50}>
                          <button
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
                            <Icon className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
                            <span>{label}</span>
                          </button>
                        </SmoothTransition>
                      ))}
                    </div>
                  </SmoothTransition>
                )}
              </InteractiveCard>
            </div>
          </SmoothTransition>

          {/* Desktop Navigation Tabs */}
          <SmoothTransition delay={200}>
            <div className="hidden lg:flex justify-center mb-12">
              <InteractiveCard className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border-gray-700/50 shadow-2xl">
                <div className="flex space-x-2">
                  {navigationItems.map(({ id, label, icon: Icon, disabled }, index) => (
                    <SmoothTransition key={id} delay={250 + index * 50}>
                      <button
                        onClick={() => handleTabChange(id)}
                        disabled={disabled}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 relative overflow-hidden whitespace-nowrap ${
                          activeTab === id
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105 border-blue-400/30"
                            : disabled
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-105"
                        }`}
                      >
                        {activeTab === id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse"></div>
                        )}
                        <Icon
                          className={`w-5 h-5 relative z-10 transition-all duration-300 ${activeTab === id ? "animate-pulse" : ""}`}
                        />
                        <span className="relative z-10">{label}</span>
                      </button>
                    </SmoothTransition>
                  ))}
                </div>
              </InteractiveCard>
            </div>
          </SmoothTransition>

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
                    glowEffect: "blue" as const,
                  },
                  {
                    title: "Plan",
                    value: user.plan.toUpperCase(),
                    icon: Users,
                    color: "purple",
                    glowEffect: "purple" as const,
                  },
                  {
                    title: "Uptime",
                    value: "99.9%",
                    icon: Zap,
                    color: "green",
                    glowEffect: "blue" as const,
                  },
                  {
                    title: "Threats Detected",
                    value: "127",
                    icon: AlertTriangle,
                    color: "red",
                    glowEffect: "orange" as const,
                  },
                ].map(({ title, value, limit, icon: Icon, color, percentage, glowEffect }, i) => (
                  <SmoothTransition key={i} delay={i * 100}>
                    <InteractiveCard
                      glowEffect={glowEffect}
                      className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border-gray-700/50 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-${color}-500/20 border-${color}-500/30 transition-all duration-300 hover:scale-110`}
                        >
                          <Icon
                            className={`w-6 h-6 text-${color}-400 transition-transform duration-300 hover:rotate-12`}
                          />
                        </div>
                        {percentage && (
                          <div
                            className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400 border-${color}-500/30 transition-all duration-300 hover:scale-105`}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <h3 className="text-gray-400 text-sm mb-2 transition-colors duration-300 hover:text-gray-300">
                        {title}
                      </h3>
                      <div className="text-2xl font-bold text-white mb-1 transition-all duration-300 hover:scale-105">
                        {value}
                      </div>
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
                    </InteractiveCard>
                  </SmoothTransition>
                ))}
              </div>

              {/* Quick Actions */}
              <SmoothTransition delay={400}>
                <InteractiveCard
                  glowEffect="blue"
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center transition-all duration-300 hover:scale-105">
                    <Zap className="w-6 h-6 mr-3 text-blue-400 transition-transform duration-300 hover:rotate-12" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {[
                      {
                        icon: Search,
                        title: "Scan Contract",
                        desc: "Analyze smart contract security",
                        gradient: "from-blue-500/20 to-purple-600/20",
                        hoverGradient: "from-blue-500/30 to-purple-600/30",
                        border: "border-blue-500/30",
                        onClick: () => setActiveTab("scanner"),
                      },
                      {
                        icon: Key,
                        title: "Manage API",
                        desc: "View keys and usage stats",
                        gradient: "from-green-500/20 to-blue-500/20",
                        hoverGradient: "from-green-500/30 to-blue-500/30",
                        border: "border-green-500/30",
                        onClick: () => setActiveTab("api"),
                      },
                      {
                        icon: Settings,
                        title: "API Docs",
                        desc: "Integration documentation",
                        gradient: "from-purple-500/20 to-pink-500/20",
                        hoverGradient: "from-purple-500/30 to-pink-500/30",
                        border: "border-purple-500/30",
                        onClick: () => onNavigate("docs"),
                      },
                    ].map(({ icon: Icon, title, desc, gradient, hoverGradient, border, onClick }, i) => (
                      <SmoothTransition key={i} delay={500 + i * 100}>
                        <button
                          onClick={onClick}
                          className={`bg-gradient-to-r ${gradient} hover:${hoverGradient} border ${border} rounded-xl p-4 sm:p-6 text-left transition-all duration-300 hover:scale-105 group w-full`}
                        >
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                          <h3 className="text-white font-semibold mb-2 text-base sm:text-lg transition-colors duration-300 group-hover:text-blue-200">
                            {title}
                          </h3>
                          <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300">
                            {desc}
                          </p>
                        </button>
                      </SmoothTransition>
                    ))}
                  </div>
                </InteractiveCard>
              </SmoothTransition>
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
              setAuditData={setAuditData} 
            />
          )}

          {activeTab === "api" && (
            <div className="space-y-8">
              {/* API Key Management */}
              <SmoothTransition delay={0}>
                <InteractiveCard
                  glowEffect="blue"
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center transition-all duration-300 hover:scale-105">
                    <Key className="w-6 h-6 mr-3 text-blue-400 transition-transform duration-300 hover:rotate-12" />
                    API Key Management
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3 transition-colors duration-300 hover:text-white">
                        Your API Key
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-900/50 rounded-xl p-4 border-gray-700/50 gap-4 transition-all duration-300 hover:border-gray-600/50">
                        <code className="font-mono text-sm text-gray-200 flex-1 break-all transition-colors duration-300 hover:text-white">
                          {user.apiKey}
                        </code>
                        <div className="flex space-x-2 flex-shrink-0">
                          <SmoothButton
                            onClick={copyApiKey}
                            variant={copiedApiKey ? "outline" : "secondary"}
                            size="sm"
                            className={copiedApiKey ? "text-emerald-400 border-emerald-500/30" : ""}
                          >
                            {copiedApiKey ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="text-sm ml-2">{copiedApiKey ? "Copied!" : "Copy"}</span>
                          </SmoothButton>
                          <SmoothButton
                            onClick={handleRegenerateApiKey}
                            variant="outline"
                            size="sm"
                            className="text-purple-400 border-purple-500/30"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm ml-2">Regenerate</span>
                          </SmoothButton>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 transition-colors duration-300 hover:text-gray-400">
                        Keep your API key secure. Don't share it publicly or commit it to version control.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SmoothTransition delay={100}>
                        <InteractiveCard className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                          <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-blue-300">
                            Usage Statistics
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Requests Used
                              </span>
                              <span className="text-white font-medium transition-all duration-300 hover:scale-105">
                                {user.usage.requests.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Monthly Limit
                              </span>
                              <span className="text-white font-medium transition-all duration-300 hover:scale-105">
                                {user.usage.limit.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Reset Date
                              </span>
                              <span className="text-white font-medium transition-all duration-300 hover:scale-105">
                                {new Date(user.usage.resetDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </InteractiveCard>
                      </SmoothTransition>

                      <SmoothTransition delay={200}>
                        <InteractiveCard className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                          <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-purple-300">
                            Plan Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Current Plan
                              </span>
                              <span className="text-white font-medium capitalize transition-all duration-300 hover:scale-105">
                                {user.plan}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Member Since
                              </span>
                              <span className="text-white font-medium transition-all duration-300 hover:scale-105">
                                {new Date(user.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
                                Rate Limit
                              </span>
                              <span className="text-white font-medium transition-all duration-300 hover:scale-105">
                                100 req/min
                              </span>
                            </div>
                          </div>
                        </InteractiveCard>
                      </SmoothTransition>
                    </div>
                  </div>
                </InteractiveCard>
              </SmoothTransition>

              {/* API Usage Chart Placeholder */}
              <SmoothTransition delay={300}>
                <InteractiveCard
                  glowEffect="purple"
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center transition-all duration-300 hover:scale-105">
                    <BarChart3 className="w-6 h-6 mr-3 text-purple-400 transition-transform duration-300 hover:rotate-12" />
                    Usage Analytics
                  </h2>
                  <div className="bg-gray-900/30 rounded-xl p-8 sm:p-12 border-gray-700/30 text-center transition-all duration-300 hover:border-gray-600/30">
                    <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4 transition-all duration-300 hover:scale-110 hover:text-purple-400" />
                    <p className="text-gray-400 text-base sm:text-lg transition-colors duration-300 hover:text-gray-300">
                      Usage analytics chart would be displayed here
                    </p>
                    <p className="text-gray-500 text-sm mt-2 transition-colors duration-300 hover:text-gray-400">
                      Track your API usage patterns over time
                    </p>
                  </div>
                </InteractiveCard>
              </SmoothTransition>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
