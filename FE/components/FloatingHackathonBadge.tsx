"use client"
import { useState } from "react"
import { Trophy, X, ExternalLink } from "lucide-react"

export const FloatingHackathonBadge = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`transition-all duration-300 ${isExpanded ? "w-80" : "w-auto"}`}>
        {/* Default State - Minimalist Style */}
        {!isExpanded && (
          <div 
            onClick={() => setIsExpanded(true)}
            className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-2 sm:p-3 border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <img
                src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                alt="BI - OJK Hackathon 2025"
                className="h-6 sm:h-8 w-auto"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Built for BI - OJK
                </p>
                <p className="text-xs text-gray-400">Hackathon 2025</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Expanded State - Detailed Style */}
        {isExpanded && (
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-orange-500/30 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <img
                  src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                  alt="BI Hackathon"
                  className="h-10 w-auto mr-3"
                />
                <div>
                  <h3 className="text-white font-bold text-lg">BI-OJK Hackathon</h3>
                  <p className="text-orange-400 text-sm">2025 Submission</p>
                  {/* <p className="text-orange-400 text-sm">2025 Winner 🏆</p> */}
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border-orange-500/30">
                <p className="text-orange-300 text-sm font-medium mb-1">🚀 Innovation Category</p>
                <p className="text-gray-300 text-xs">Financial Technology Security</p>
              </div>
              {/* <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border-blue-500/30">
                <p className="text-blue-300 text-sm font-medium mb-1">⚡ Built in 72 Hours</p>
                <p className="text-gray-300 text-xs">AI-Powered Smart Contract Security</p>
              </div> */}
              <button
                onClick={() => window.open("https://hackathon.fekdi.co.id", "_blank")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center group"
              >
                <span>About BI-OJK Hackathon</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}