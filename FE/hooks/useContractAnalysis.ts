"use client"

import { useState } from "react"
import type { AuditData } from "@/types"

export const useContractAnalysis = (
  showToast: (type: "success" | "error" | "info", message: string) => void,
  setActiveTab: (tab: string) => void,
) => {
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const [chain, setChain] = useState("ethereum")
  const [progressStep, setProgressStep] = useState(0)
  const [animatingMetrics, setAnimatingMetrics] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const loadingMessages = [
    "🔍 Scanning contract bytecode...",
    "🧠 Running AI threat analysis...",
    "⚡ Checking for vulnerabilities...",
    "🛡️ Analyzing security patterns...",
    "📊 Calculating risk metrics...",
    "🎯 Finalizing threat assessment...",
  ]

  const checkContract = async () => {
    if (!address.trim()) {
      setError("Please enter a valid contract address")
      showToast("error", "Please enter a valid contract address")
      return
    }

    // Validate address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Invalid contract address format. Please enter a valid Ethereum address.")
      showToast("error", "Invalid address format")
      return
    }

    setLoading(true)
    setError(null)
    setProgressStep(0)
    setAnimatingMetrics(false)
    setLoadingMessage(loadingMessages[0])

    // Enhanced progress simulation with messages
    let messageIndex = 0
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => {
        const newStep = prev + 15
        if (newStep >= 90) {
          clearInterval(progressInterval)
          return 90
        }

        // Update loading message
        messageIndex = Math.min(messageIndex + 1, loadingMessages.length - 1)
        setLoadingMessage(loadingMessages[messageIndex])

        return newStep
      })
    }, 800)

    try {
      showToast("info", "Starting comprehensive security analysis...")

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${baseUrl}/audit-contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          address: address.toLowerCase().trim(),
          chain: chain.toLowerCase(),
        }),
      })

      // Handle different response status codes
      if (!response.ok) {
        let errorMessage = "Failed to analyze contract"

        try {
          const errorData = await response.json()
          if (response.status === 404) {
            errorMessage = "Contract not found. Please verify the address and network."
          } else if (response.status === 400) {
            errorMessage = errorData.detail || "Invalid request. Please check your input."
          } else if (response.status === 429) {
            errorMessage = "Too many requests. Please wait a moment and try again."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          } else {
            errorMessage = errorData.detail || errorData.message || errorMessage
          }
        } catch {
          // If error response is not JSON, use status-based message
          if (response.status === 404) {
            errorMessage = "Contract not found on the selected network"
          } else if (response.status >= 500) {
            errorMessage = "Server temporarily unavailable"
          }
        }

        throw new Error(errorMessage)
      }

      const data: AuditData = await response.json()

      // Validate response data
      if (!data || !data.contract_address) {
        throw new Error("Invalid response from security analysis service")
      }

      setAuditData(data)
      setActiveTab("results")
      setProgressStep(100)
      setLoadingMessage("✅ Analysis complete!")

      // Show success message with risk level
      const riskLevel = data.risk_level?.toLowerCase() || "unknown"
      const riskEmoji = riskLevel === "low" ? "✅" : riskLevel === "medium" ? "⚠️" : "🚨"
      showToast("success", `${riskEmoji} Analysis complete! Risk level: ${data.risk_level}`)

      // Trigger animation after a short delay
      setTimeout(() => {
        setAnimatingMetrics(true)
        setTimeout(() => setAnimatingMetrics(false), 3000)
      }, 500)
    } catch (err: any) {
      console.error("Contract analysis error:", err)
      const errorMessage = err.message || "Failed to analyze contract. Please try again."
      setError(errorMessage)
      showToast("error", errorMessage)
      setProgressStep(0)
      setLoadingMessage("")
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setLoading(false)
        setProgressStep(0)
        setLoadingMessage("")
      }, 1000)
    }
  }

  return {
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
  }
}
