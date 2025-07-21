"use client"

import { useState } from "react"
import { Star, CheckCircle, AlertTriangle, XCircle, Lightbulb, ArrowRight, Zap } from "lucide-react"

interface SampleContractsProps {
  setAddress: (address: string, name: string) => void
  currentAddress?: string
}

export const SampleContracts = ({ setAddress, currentAddress }: SampleContractsProps) => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  const sampleContracts = [
    {
      address: "0xef9f4c0c3403d269c867c908e7f66748cc17f28a",
      name: "Safe DeFi Protocol",
      risk: "SAFE",
      color: "emerald",
      icon: CheckCircle,
      description: "A well-audited DeFi protocol with minimal security risks and strong community trust",
      features: [
        "✅ Verified source code",
        "✅ No critical vulnerabilities",
        "✅ Active community",
        "✅ Regular audits",
      ],
      estimatedTime: "~30 seconds",
      riskScore: 15,
    },
    {
      address: "0x08910C71bf5f36725842d0d5747f7894ffe88858",
      name: "Standard Token Contract",
      risk: "CAUTION",
      color: "amber",
      icon: AlertTriangle,
      description: "Standard ERC-20 token with some minor security considerations that require attention",
      features: [
        "⚠️ Some medium-risk issues",
        "✅ Verified source code",
        "⚠️ Limited audit history",
        "✅ Basic functionality",
      ],
      estimatedTime: "~45 seconds",
      riskScore: 45,
    },
    {
      address: "0x82340b6138Cf09Fa8008A44c50C691C89cdfF495",
      name: "High-Risk Contract",
      risk: "DANGER",
      color: "red",
      icon: XCircle,
      description: "Contract with significant security vulnerabilities that pose serious risks to users",
      features: [
        "❌ Critical vulnerabilities found",
        "❌ Unverified source code",
        "❌ High centralization risk",
        "❌ Potential honeypot",
      ],
      estimatedTime: "~60 seconds",
      riskScore: 85,
    },
  ]

  const handleContractSelect = (contract: any) => {
    setSelectedContract(contract.address)
    setAddress(contract.address, contract.name)

    // Visual feedback
    setTimeout(() => {
      setSelectedContract(null)
    }, 2000)
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 sm:p-8 border-gray-700/50 backdrop-blur-xl">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border-yellow-400/30 mb-4 group hover:scale-110 transition-transform duration-300">
          <Lightbulb className="w-8 h-8 text-yellow-400 group-hover:animate-pulse" />
        </div>
        <h3 className="font-bold text-white mb-3 text-xl sm:text-2xl">Try Sample Contracts</h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          New to smart contract security? Test our AI-powered analysis with these sample contracts to see how different
          risk levels are detected and reported.
        </p>
      </div>

      {/* Enhanced Sample Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sampleContracts.map((contract, i) => {
          const isSelected = selectedContract === contract.address
          const isCurrent = currentAddress === contract.address

          return (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isSelected
                  ? `bg-${contract.color}-500/20 border-${contract.color}-400/50 shadow-lg shadow-${contract.color}-500/20`
                  : isCurrent
                    ? `bg-${contract.color}-500/10 border-${contract.color}-500/30`
                    : `bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50 hover:border-gray-600/50`
              }`}
            >
              {/* Selection indicator */}
              {isCurrent && (
                <div className="absolute top-3 right-3 z-20">
                  <div
                    className={`bg-${contract.color}-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse`}
                  >
                    SELECTED
                  </div>
                </div>
              )}

              {/* Background Gradient Effect */}
              <div
                className={`absolute inset-0 bg-${contract.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <contract.icon
                    className={`w-8 h-8 text-${contract.color}-400 group-hover:animate-bounce transition-all duration-300`}
                  />
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-${contract.color}-400 text-sm font-bold px-3 py-1 bg-${contract.color}-500/20 rounded-full border-${contract.color}-500/30`}
                    >
                      {contract.risk}
                    </span>
                    <div className={`text-xs text-${contract.color}-400 font-mono`}>{contract.riskScore}%</div>
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-gray-200 transition-colors">
                  {contract.name}
                </h4>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{contract.description}</p>

                {/* Risk Score Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Risk Level</span>
                    <span className={`text-xs font-bold text-${contract.color}-400`}>{contract.riskScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${contract.color}-400 to-${contract.color}-500 h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${contract.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {contract.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-300 flex items-center">
                      <span className="mr-2">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Estimated Time */}
                <div className="mb-4 flex items-center text-xs text-gray-400">
                  <Zap className="w-3 h-3 mr-1" />
                  Analysis time: {contract.estimatedTime}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleContractSelect(contract)}
                  disabled={isSelected}
                  className={`w-full rounded-lg py-3 px-4 font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105 ${
                    isSelected
                      ? `bg-${contract.color}-500/30 text-${contract.color}-200 border-${contract.color}-400/50 cursor-not-allowed`
                      : isCurrent
                        ? `bg-${contract.color}-500/20 text-${contract.color}-300 border-${contract.color}-500/40`
                        : `bg-${contract.color}-500/10 hover:bg-${contract.color}-500/20 text-${contract.color}-300 hover:text-${contract.color}-200 border-${contract.color}-500/30 hover:border-${contract.color}-500/50`
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Selected!</span>
                    </>
                  ) : isCurrent ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Currently Selected</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">Test This Contract</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Address Preview */}
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-1">Contract Address:</p>
                  <code className="text-xs text-gray-300 font-mono break-all">
                    {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                  </code>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center bg-blue-500/10 border-blue-500/30 rounded-full px-6 py-3 text-blue-300">
          <Star className="w-5 h-5 mr-2 animate-pulse" />
          <span className="text-sm font-medium">
            Click any contract above to automatically fill the address and start analysis
          </span>
        </div>
      </div>
    </div>
  )
}
