import { Brain, Loader2, RefreshCw, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { AuditData } from "@/types"

interface AIAnalysisProps {
  auditData: AuditData
}

interface AISummaryResponse {
  address: string
  chain: string
  status: "pending" | "completed" | "error"
  summary?: string
  error_message?: string
  started_at: string
  completed_at?: string
}

export const AIAnalysis = ({ auditData }: AIAnalysisProps) => {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"  
  const [aiStatus, setAiStatus] = useState<"loading" | "completed" | "error" | "pending">("loading")
  const [aiSummary, setAiSummary] = useState<string>(auditData.ai_summary)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const pollInterval = useRef<NodeJS.Timeout | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  // Check if AI summary is the "in progress" placeholder
  const isAIInProgress = auditData.ai_summary.includes("AI Analysis In Progress")

  const fetchAISummary = async () => {
    try {
      const response = await fetch(`${baseUrl}/ai-summary/${auditData.contract_address}?chain=${auditData.chain}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: AISummaryResponse = await response.json()
      
      if (data.status === "completed" && data.summary) {
        setAiStatus("completed")
        setAiSummary(data.summary)
        // Stop polling when completed
        if (pollInterval.current) {
          clearInterval(pollInterval.current)
          pollInterval.current = null
        }
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
      } else if (data.status === "error") {
        setAiStatus("error")
        setErrorMessage(data.error_message || "AI analysis failed")
        // Stop polling on error
        if (pollInterval.current) {
          clearInterval(pollInterval.current)
          pollInterval.current = null
        }
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
      } else if (data.status === "pending") {
        setAiStatus("pending")
      }
    } catch (error) {
      console.error("Failed to fetch AI summary:", error)
      setAiStatus("error")
      setErrorMessage("Failed to fetch AI analysis")
      // Stop polling on error
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
        pollInterval.current = null
      }
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
    }
  }

  useEffect(() => {
    if (isAIInProgress && aiStatus !== "completed") {
      setAiStatus("pending")
      
      // Start polling for AI summary only if not completed
      pollInterval.current = setInterval(fetchAISummary, 3000) // Poll every 3 seconds
      
      // Stop polling after 5 minutes (timeout)
      timeout.current = setTimeout(() => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current)
          pollInterval.current = null
        }
        setAiStatus("error")
        setErrorMessage("AI analysis timed out")
      }, 300000) // 5 minutes
      
      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current)
          pollInterval.current = null
        }
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
      }
    } else if (!isAIInProgress) {
      setAiStatus("completed")
    }
  }, [isAIInProgress, auditData.contract_address, auditData.chain, aiStatus])

  const renderContent = () => {
    if (aiStatus === "pending") {
      return (
        <div className="text-center py-16">
          <div className="flex flex-col items-center space-y-8">
            {/* Elegant loading animation */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-600 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              <Brain className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="space-y-4 max-w-md">
              <h4 className="text-xl font-semibold text-gray-200">Analyzing Smart Contract</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our AI expert is conducting a comprehensive security analysis. 
                This typically takes 30-60 seconds.
              </p>
              
              {/* Simple progress dots */}
              <div className="flex items-center justify-center space-x-1 pt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (aiStatus === "error") {
      return (
        <div className="text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <Brain className="w-7 h-7 text-gray-400" />
            </div>
            
            <div className="space-y-4 max-w-md">
              <h4 className="text-lg font-medium text-gray-200">Analysis Unavailable</h4>
              <p className="text-gray-400 text-sm">
                {errorMessage || "Unable to generate AI analysis at this time."}
              </p>
              
              <button 
                onClick={fetchAISummary}
                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg transition-colors border border-gray-600 hover:border-gray-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Completed status - show AI summary
    return (
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: aiSummary }} />
      </div>
    )
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-200">
              AI Security Analysis
            </h3>
          </div>
          
          {/* Status indicator */}
          {aiStatus === "pending" && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Analyzing...</span>
            </div>
          )}
          
          {aiStatus === "completed" && (
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Complete</span>
            </div>
          )}
          
          {aiStatus === "error" && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Unavailable</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  )
}