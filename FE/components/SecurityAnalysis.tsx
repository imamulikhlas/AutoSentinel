"use client"

import { useState } from "react"
import { Brain, Zap, Shield, Search, RefreshCw, ArrowRight, XCircle, CheckCircle, AlertCircle } from "lucide-react"
import { SampleContracts } from "./SampleContracts"
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"
import { SmoothButton } from "./SmoothButton"

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
    <div className="max-w-7xl mx-auto px-4 sm:px-0">
      <InteractiveCard
        glowEffect="blue"
        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border-gray-700/50 shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 animate-gradient-shift"></div>
        </div>

        <div className="relative z-10">
          <SmoothTransition delay={0}>
            <div className="text-center mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-blue-500/30 transition-all duration-400 hover:scale-110 group">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 transition-all duration-300 group-hover:rotate-12" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 transition-all duration-400 hover:scale-105">
                AI-Powered Threat Detection
              </h2>
              <p className="text-gray-300 text-base sm:text-lg px-4 transition-colors duration-300 hover:text-gray-200">
                Real-time smart contract vulnerability assessment with advanced AI analysis
              </p>
            </div>
          </SmoothTransition>

          {/* Enhanced Feature Grid */}
          <SmoothTransition delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {[
                {
                  icon: Zap,
                  title: "Real-time Analysis",
                  desc: "Instant threat detection and assessment",
                  gradient: "from-yellow-400 to-orange-500",
                  glowEffect: "orange" as const,
                },
                {
                  icon: Brain,
                  title: "AI-Powered Detection",
                  desc: "Advanced machine learning algorithms",
                  gradient: "from-purple-400 to-pink-500",
                  glowEffect: "purple" as const,
                },
                {
                  icon: Shield,
                  title: "Comprehensive Coverage",
                  desc: "50+ vulnerability patterns detected",
                  gradient: "from-blue-400 to-cyan-500",
                  glowEffect: "blue" as const,
                },
              ].map(({ icon: Icon, title, desc, gradient, glowEffect }, i) => (
                <SmoothTransition key={i} delay={300 + i * 100}>
                  <InteractiveCard
                    glowEffect={glowEffect}
                    className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border-gray-700/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 hover:opacity-100 transition-opacity duration-400"></div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 hover:scale-110 hover:rotate-12 relative z-10`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 relative z-10 transition-colors duration-300 hover:text-blue-200 text-sm sm:text-base">
                      {title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm relative z-10 transition-colors duration-300 hover:text-gray-300">
                      {desc}
                    </p>
                  </InteractiveCard>
                </SmoothTransition>
              ))}
            </div>
          </SmoothTransition>

          <div className="space-y-6 sm:space-y-8">
            <SmoothTransition delay={600}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 sm:mb-4 transition-colors duration-300 hover:text-white">
                  Smart Contract Address
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Enter contract address (0x...)"
                    className={`w-full px-4 sm:px-6 py-4 sm:py-5 bg-gray-900/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-500 text-base sm:text-lg backdrop-blur-xl hover:border-gray-600/50 hover:shadow-lg ${
                      addressValidation?.isValid === false
                        ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                        : addressValidation?.isValid === true
                          ? "border-emerald-500/50 focus:ring-emerald-500 focus:border-emerald-500"
                          : "border-gray-700/50"
                    }`}
                  />
                  <div className="absolute right-4 sm:right-5 top-4 sm:top-5 flex items-center space-x-2">
                    {addressValidation?.isValid === true && (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 transition-all duration-300 hover:scale-110" />
                    )}
                    {addressValidation?.isValid === false && (
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 transition-all duration-300 hover:scale-110" />
                    )}
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-colors duration-300 group-hover:text-blue-400" />
                  </div>
                </div>
                {addressValidation && (
                  <SmoothTransition delay={0}>
                    <div
                      className={`mt-2 text-sm flex items-center transition-all duration-300 ${
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
                  </SmoothTransition>
                )}
              </div>
            </SmoothTransition>

            <SmoothTransition delay={700}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 sm:mb-4 transition-colors duration-300 hover:text-white">
                  Blockchain Network
                </label>
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white text-base sm:text-lg backdrop-blur-xl hover:border-gray-600/50 hover:shadow-lg"
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
            </SmoothTransition>

            <SmoothTransition delay={800}>
              <SmoothButton
                onClick={checkContract}
                disabled={loading || !address || addressValidation?.isValid === false}
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full shadow-2xl flex items-center justify-center relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 animate-spin mr-3 sm:mr-4" />
                    <span>Analyzing Threats...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 mr-3 sm:mr-4 transition-transform duration-300 hover:rotate-12" />
                    <span>Start Threat Detection</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 transition-transform duration-300 hover:translate-x-1" />
                  </>
                )}
              </SmoothButton>
            </SmoothTransition>

            {/* Loading Status */}
            {loading && loadingMessage && (
              <SmoothTransition delay={0}>
                <div className="bg-blue-500/20 border-blue-500/30 rounded-xl p-4 sm:p-6 flex items-center backdrop-blur-xl animate-pulse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-bounce"></div>
                  <span className="text-blue-300 font-medium text-sm sm:text-lg">{loadingMessage}</span>
                </div>
              </SmoothTransition>
            )}

            {error && (
              <SmoothTransition delay={0}>
                <div className="bg-red-500/20 border-red-500/30 rounded-xl p-4 sm:p-6 flex items-start backdrop-blur-xl animate-shake">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-3 sm:mr-4 animate-pulse flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-red-300 font-medium text-sm sm:text-lg block">{error}</span>
                    <span className="text-red-400 text-xs sm:text-sm mt-1 block">
                      Please check your input and try again
                    </span>
                  </div>
                </div>
              </SmoothTransition>
            )}

            {/* Sample Contracts Component */}
            <SmoothTransition delay={900}>
              <SampleContracts setAddress={handleSampleContractSelect} currentAddress={address} />
            </SmoothTransition>
          </div>
        </div>
      </InteractiveCard>
    </div>
  )
}
