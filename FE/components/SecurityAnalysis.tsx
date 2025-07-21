"use client"

import { useState } from "react"
import { Brain, Zap, Shield, Search, RefreshCw, ArrowRight, XCircle, CheckCircle, AlertCircle } from "lucide-react"
import { SampleContracts } from "./SampleContracts"

interface SecurityAnalysisProps {
  address: string
  setAddress: (address: string) => void
  chain: string
  setChain: (chain: string) => void
  loading: boolean
  error: string | null
  checkContract: () => void
  loadingMessage?: string
}

export const SecurityAnalysis = ({
  address,
  setAddress,
  chain,
  setChain,
  loading,
  error,
  checkContract,
  loadingMessage,
}: SecurityAnalysisProps) => {
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean
    message: string
  } | null>(null)

  const validateAddress = (addr: string) => {
    if (!addr) {
      setAddressValidation(null)
      return
    }

    if (!addr.startsWith("0x")) {
      setAddressValidation({
        isValid: false,
        message: "Address must start with 0x",
      })
      return
    }

    if (addr.length !== 42) {
      setAddressValidation({
        isValid: false,
        message: "Address must be 42 characters long",
      })
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setAddressValidation({
        isValid: false,
        message: "Address contains invalid characters",
      })
      return
    }

    setAddressValidation({
      isValid: true,
      message: "Valid contract address format",
    })
  }

  const handleAddressChange = (value: string) => {
    setAddress(value)
    validateAddress(value)
  }

  const handleSampleContractSelect = (contractAddress: string, contractName: string) => {
    setAddress(contractAddress)
    validateAddress(contractAddress)
    // Show toast notification
    const event = new CustomEvent("show-toast", {
      detail: {
        type: "info",
        message: `Selected ${contractName} for analysis`,
      },
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient-shift"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-blue-500/30 hover:scale-110 transition-transform duration-300 group">
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 group-hover:animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              AI-Powered Threat Detection
            </h2>
            <p className="text-gray-300 text-base sm:text-lg px-4">
              Real-time smart contract vulnerability assessment with advanced AI analysis
            </p>
          </div>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
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
                className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2 relative z-10 group-hover:text-blue-200 transition-colors text-sm sm:text-base">
                  {title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm relative z-10 group-hover:text-gray-300 transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 sm:mb-4">Smart Contract Address</label>
              <div className="relative group">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Enter contract address (0x...)"
                  className={`w-full px-4 sm:px-6 py-4 sm:py-5 bg-gray-900/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500 text-base sm:text-lg backdrop-blur-xl hover:border-gray-600/50 group-hover:shadow-lg ${
                    addressValidation?.isValid === false
                      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                      : addressValidation?.isValid === true
                        ? "border-emerald-500/50 focus:ring-emerald-500 focus:border-emerald-500"
                        : "border-gray-700/50"
                  }`}
                />
                <div className="absolute right-4 sm:right-5 top-4 sm:top-5 flex items-center space-x-2">
                  {addressValidation?.isValid === true && (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  )}
                  {addressValidation?.isValid === false && (
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  )}
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
              {addressValidation && (
                <div
                  className={`mt-2 text-sm flex items-center ${
                    addressValidation.isValid ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {addressValidation.isValid ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  {addressValidation.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 sm:mb-4">Blockchain Network</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-base sm:text-lg backdrop-blur-xl hover:border-gray-600/50 hover:shadow-lg"
              >
                <option value="ethereum" className="bg-gray-900">
                  🔷 Ethereum Mainnet
                </option>
                <option value="polygon" className="bg-gray-900">
                  🟣 Polygon
                </option>
                <option value="bsc" className="bg-gray-900">
                  🟡 Binance Smart Chain
                </option>
                <option value="arbitrum" className="bg-gray-900">
                  🔵 Arbitrum
                </option>
              </select>
            </div>

            <button
              onClick={checkContract}
              disabled={loading || !address || addressValidation?.isValid === false}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 sm:py-6 px-6 sm:px-8 rounded-xl font-semibold text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-2xl flex items-center justify-center group border-blue-400/30 disabled:border-gray-600/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 animate-spin mr-3 sm:mr-4 relative z-10" />
                  <span className="relative z-10">Analyzing Threats...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 mr-3 sm:mr-4 group-hover:rotate-12 transition-transform relative z-10" />
                  <span className="relative z-10">Start Threat Detection</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>

            {/* Loading Status */}
            {loading && loadingMessage && (
              <div className="bg-blue-500/20 border-blue-500/30 rounded-xl p-4 sm:p-6 flex items-center backdrop-blur-xl animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-bounce"></div>
                <span className="text-blue-300 font-medium text-sm sm:text-lg">{loadingMessage}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border-red-500/30 rounded-xl p-4 sm:p-6 flex items-start backdrop-blur-xl animate-shake">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-3 sm:mr-4 animate-pulse flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-red-300 font-medium text-sm sm:text-lg block">{error}</span>
                  <span className="text-red-400 text-xs sm:text-sm mt-1 block">
                    Please check your input and try again
                  </span>
                </div>
              </div>
            )}

            {/* Sample Contracts Component */}
            <SampleContracts setAddress={handleSampleContractSelect} currentAddress={address} />
          </div>
        </div>
      </div>
    </div>
  )
}
