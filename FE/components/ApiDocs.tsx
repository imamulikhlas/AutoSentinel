"use client"

import { useState, useEffect } from "react"
import { Code, Copy, CheckCircle, Book, Zap, Shield, Key, Globe, ArrowRight, Menu, X } from "lucide-react"
import { Navigation } from "./Navigation"
import { BackgroundElements } from "./BackgroundElements"

interface ApiDocsProps {
  onNavigate: (page: "landing" | "dashboard" | "docs") => void
  user: any
  onLogout: () => void
}

export const ApiDocs = ({ onNavigate, user, onLogout }: ApiDocsProps) => {
  const [activeSection, setActiveSection] = useState("overview")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE || "autosentinel.web.id"

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code")
    }
  }

  const sections = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "endpoints", label: "API Endpoints", icon: Globe },
    { id: "examples", label: "Code Examples", icon: Code },
    { id: "webhooks", label: "Webhooks", icon: Zap },
    { id: "sdks", label: "SDKs & Libraries", icon: Shield },
  ]

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setSidebarOpen(false)
  }

  const activeSectionData = sections.find((section) => section.id === activeSection)

  const codeExamples = {
    curl: `curl -X POST 'https://api.${apiUrl}/v1/audit-contract' \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x1234567890123456789012345678901234567890",
    "chain": "ethereum"
  }'`,
    javascript: `const response = await fetch('https://api.${apiUrl}/v1/audit-contract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    address: '0x1234567890123456789012345678901234567890',
    chain: 'ethereum'
  })
});

const auditResult = await response.json();
console.log(auditResult);`,
    python: `import requests

url = "https://api.${apiUrl}/v1/audit-contract"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "address": "0x1234567890123456789012345678901234567890",
    "chain": "ethereum"
}

response = requests.post(url, headers=headers, json=data)
audit_result = response.json()
print(audit_result)`,
    nodejs: `const axios = require('axios');

const auditContract = async (address, chain) => {
  try {
    const response = await axios.post('https://api.${apiUrl}/v1/audit-contract', {
      address,
      chain
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Audit failed:', error.response.data);
  }
};

// Usage
auditContract('0x1234567890123456789012345678901234567890', 'ethereum')
  .then(result => console.log(result));`,
  }

  const endpoints = [
    {
      method: "POST",
      path: "/v1/audit-contract",
      description: "Analyze smart contract security",
      params: [
        { name: "address", type: "string", required: true, description: "Contract address to analyze" },
        {
          name: "chain",
          type: "string",
          required: true,
          description: "Blockchain network (ethereum, polygon, bsc, arbitrum)",
        },
      ],
    },
    {
      method: "GET",
      path: "/v1/audit-history/{address}",
      description: "Get analysis history for a contract",
      params: [
        { name: "address", type: "string", required: true, description: "Contract address" },
        { name: "limit", type: "number", required: false, description: "Number of results (default: 10)" },
      ],
    },
    {
      method: "GET",
      path: "/v1/load-audit-file",
      description: "Load specific audit report",
      params: [
        { name: "path", type: "string", required: true, description: "File path to audit report" },
        { name: "address", type: "string", required: true, description: "Contract address" },
        { name: "chain", type: "string", required: true, description: "Blockchain network" },
      ],
    },
    {
      method: "GET",
      path: "/v1/usage",
      description: "Get API usage statistics",
      params: [],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      <BackgroundElements mousePosition={mousePosition} />
      <Navigation onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full border-blue-500/30 mb-4 sm:mb-6">
              <Code className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">API Documentation</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Integrate Auto Sentinel's AI-powered smart contract security analysis into your applications
            </p>
          </div>

          {/* Mobile Section Selector */}
          <div className="block lg:hidden mb-8">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border-gray-700/50 shadow-xl">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center space-x-3">
                  {activeSectionData && <activeSectionData.icon className="w-5 h-5 text-blue-400" />}
                  <span className="font-medium">{activeSectionData?.label || "Select Section"}</span>
                </div>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {sidebarOpen && (
                <div className="border-t border-gray-700/50 p-2">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleSectionChange(id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                        activeSection === id
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border-blue-500/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border-gray-700/50 shadow-xl sticky top-24">
                <h3 className="text-white font-semibold mb-4">Documentation</h3>
                <nav className="space-y-2">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                        activeSection === id
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border-blue-500/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeSection === "overview" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Getting Started</h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                      Auto Sentinel API provides comprehensive smart contract security analysis powered by advanced AI.
                      Our RESTful API allows you to integrate real-time threat detection into your applications.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-6 border-blue-500/20">
                        <Shield className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-white font-semibold mb-2">AI-Powered Analysis</h3>
                        <p className="text-gray-400 text-sm">
                          Advanced machine learning algorithms analyze smart contracts for 50+ vulnerability patterns
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border-green-500/20">
                        <Zap className="w-8 h-8 text-green-400 mb-4" />
                        <h3 className="text-white font-semibold mb-2">Real-time Results</h3>
                        <p className="text-gray-400 text-sm">
                          Get comprehensive security reports in seconds with detailed vulnerability assessments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Base URL</h2>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50 overflow-x-auto">
                      <code className="text-blue-300 font-mono text-sm sm:text-base">
                        https://api.{apiUrl}/v1
                      </code>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Rate Limits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { plan: "Free", limit: "100 requests/day", color: "gray" },
                        { plan: "Pro", limit: "1,000 requests/day", color: "blue" },
                        { plan: "Enterprise", limit: "10,000 requests/day", color: "purple" },
                      ].map(({ plan, limit, color }) => (
                        <div key={plan} className={`bg-${color}-500/10 border-${color}-500/30 rounded-xl p-4`}>
                          <h3 className={`text-${color}-400 font-semibold mb-2`}>{plan}</h3>
                          <p className="text-gray-300 text-sm">{limit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of the sections remain the same but with improved mobile responsiveness */}
              {activeSection === "authentication" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                      <Key className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-400" />
                      Authentication
                    </h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-6">
                      Auto Sentinel API uses API keys for authentication. Include your API key in the Authorization
                      header.
                    </p>

                    <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border-gray-700/50 mb-6">
                      <h3 className="text-white font-semibold mb-4">Authorization Header</h3>
                      <div className="bg-black/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <span className="text-gray-400">Authorization:</span>{" "}
                        <span className="text-blue-300">Bearer YOUR_API_KEY</span>
                      </div>
                    </div>

                    {user ? (
                      <div className="bg-blue-500/10 border-blue-500/30 rounded-xl p-4 sm:p-6">
                        <h3 className="text-blue-300 font-semibold mb-4">Your API Key</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-900/50 rounded-lg p-4 gap-4">
                          <code className="text-gray-200 font-mono text-sm flex-1 break-all">{user.apiKey}</code>
                          <button
                            onClick={() => copyCode(user.apiKey, "api-key")}
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-lg border-blue-500/30"
                          >
                            {copiedCode === "api-key" ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span className="text-sm">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border-amber-500/30 rounded-xl p-4 sm:p-6">
                        <p className="text-amber-300 mb-4">
                          <Key className="w-5 h-5 inline mr-2" />
                          Sign in to view your API key and start making requests
                        </p>
                        <button
                          onClick={() => onNavigate("dashboard")}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "endpoints" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Globe className="w-8 h-8 mr-3 text-blue-400" />
                      API Endpoints
                    </h2>

                    <div className="space-y-6">
                      {endpoints.map((endpoint, i) => (
                        <div key={i} className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                          <div className="flex items-center mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold mr-4 ${
                                endpoint.method === "POST"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-blue-300 font-mono text-lg">{endpoint.path}</code>
                          </div>
                          <p className="text-gray-300 mb-4">{endpoint.description}</p>

                          {endpoint.params.length > 0 && (
                            <div>
                              <h4 className="text-white font-semibold mb-3">Parameters</h4>
                              <div className="space-y-2">
                                {endpoint.params.map((param, j) => (
                                  <div
                                    key={j}
                                    className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <code className="text-blue-300 font-mono text-sm">{param.name}</code>
                                      <span className="text-gray-400 text-sm">{param.type}</span>
                                      {param.required && (
                                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border-red-500/30">
                                          required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-400 text-sm text-right max-w-md">{param.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "examples" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                      <Code className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-400" />
                      Code Examples
                    </h2>

                    <div className="space-y-8">
                      {Object.entries(codeExamples).map(([language, code]) => (
                        <div
                          key={language}
                          className="bg-gray-900/30 rounded-xl border-gray-700/30 overflow-hidden"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-700/30 gap-4">
                            <h3 className="text-white font-semibold capitalize">{language}</h3>
                            <button
                              onClick={() => copyCode(code, language)}
                              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-4 py-2 bg-gray-800/50 rounded-lg border-gray-700/50 hover:border-gray-600/50 self-start sm:self-auto"
                            >
                              {copiedCode === language ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-4 sm:p-6">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>{code}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "webhooks" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Zap className="w-8 h-8 mr-3 text-blue-400" />
                      Webhooks
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                      Receive real-time notifications when security analysis is complete or when threats are detected.
                    </p>

                    <div className="bg-amber-500/10 border-amber-500/30 rounded-xl p-6 mb-6">
                      <h3 className="text-amber-300 font-semibold mb-2">Coming Soon</h3>
                      <p className="text-amber-200">
                        Webhook functionality is currently in development. Stay tuned for updates!
                      </p>
                    </div>

                    <div className="bg-gray-900/30 rounded-xl p-6 border-gray-700/30">
                      <h3 className="text-white font-semibold mb-4">Planned Webhook Events</h3>
                      <div className="space-y-3">
                        {[
                          "analysis.completed - When contract analysis finishes",
                          "threat.detected - When high-risk vulnerabilities are found",
                          "usage.limit_reached - When API usage limits are approached",
                        ].map((event, i) => (
                          <div key={i} className="flex items-center text-gray-300">
                            <ArrowRight className="w-4 h-4 mr-3 text-blue-400" />
                            <code className="text-blue-300 mr-3">{event.split(" - ")[0]}</code>
                            <span className="text-sm">{event.split(" - ")[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "sdks" && (
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Shield className="w-8 h-8 mr-3 text-blue-400" />
                      SDKs & Libraries
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                      Official SDKs and community libraries to integrate Auto Sentinel into your favorite programming
                      language.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: "JavaScript/TypeScript",
                          status: "Coming Soon",
                          color: "amber",
                          description: "NPM package for Node.js and browser",
                        },
                        {
                          name: "Python",
                          status: "Coming Soon",
                          color: "amber",
                          description: "PyPI package for Python applications",
                        },
                        {
                          name: "Go",
                          status: "Coming Soon",
                          color: "amber",
                          description: "Go module for backend services",
                        },
                        {
                          name: "Rust",
                          status: "Coming Soon",
                          color: "amber",
                          description: "Crate for Rust applications",
                        },
                        {
                          name: "Java",
                          status: "Planned",
                          color: "gray",
                          description: "Maven package for Java projects",
                        },
                        { name: "PHP", status: "Planned", color: "gray", description: "Composer package for PHP" },
                      ].map(({ name, status, color, description }) => (
                        <div key={name} className={`bg-${color}-500/10 border-${color}-500/30 rounded-xl p-6`}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">{name}</h3>
                            <span
                              className={`text-${color}-400 text-sm px-3 py-1 bg-${color}-500/20 rounded-full border-${color}-500/30`}
                            >
                              {status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-blue-500/10 border-blue-500/30 rounded-xl p-6">
                      <h3 className="text-blue-300 font-semibold mb-4">Installation Examples</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">JavaScript/Node.js</h4>
                          <div className="bg-black/30 rounded-lg p-3">
                            <code className="text-gray-300 text-sm">npm install @autosentinel/sdk</code>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Python</h4>
                          <div className="bg-black/30 rounded-lg p-3">
                            <code className="text-gray-300 text-sm">pip install autosentinel</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
