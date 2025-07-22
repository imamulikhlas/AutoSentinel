"use client"

import { useState, useEffect } from "react"

interface InitialLoaderProps {
  onLoadingComplete: () => void
}

export const InitialLoader = ({ onLoadingComplete }: InitialLoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Simulate loading progress with accurate calculation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Start window opening transition
          setTimeout(() => {
            setIsTransitioning(true)
            setTimeout(() => {
              setIsVisible(false)
              setTimeout(() => {
                onLoadingComplete()
              }, 100)
            }, 1200) // Wait for window opening animation
          }, 800)
          return 100
        }

        // Calculate increment based on remaining progress
        const remaining = 100 - prev
        const increment = Math.min(
          Math.random() * 6 + 1, // Realistic progression
          remaining
        )

        const newProgress = prev + increment
        return Math.min(newProgress, 100)
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [onLoadingComplete])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center transition-all duration-1200 ${
      isTransitioning ? 'animate-window-open' : ''
    }`}>
      {/* Professional background effects - subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Loading Content */}
      <div className={`relative z-10 text-center transition-all duration-800 ${
        isTransitioning ? 'animate-content-fade-out' : ''
      }`}>
        
        {/* Logo - Professional Dark Theme */}
        <div className="relative mb-12 flex justify-center">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-30 h-30 mx-auto my-auto bg-blue-500/20 rounded-2xl blur-xl animate-gentle-glow"></div>
          
          {/* Logo Container */}
          <div className="relative bg-white-800/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 shadow-2xl animate-fade-in-scale">
            <img
              src="/assets/logo3.png"
              alt="Auto Sentinel Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = `
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 1L3 6v8l7 5 7-5V6l-7-5zM6.5 8.5l3-2.5 3 2.5v3l-3 2.5-3-2.5v-3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                `;
              }}
            />
          </div>
        </div>

        {/* App Name - Professional Typography */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2 tracking-tight">
            Auto Sentinel
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            AI-Powered Smart Contract Security
          </p>
        </div>

        {/* Hackathon Badge - Professional Dark */}
        <div className="inline-flex items-center bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2 mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <img
            src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
            alt="BI - OJK Hackathon 2025"
            className="h-4 w-auto mr-2"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-gray-300 font-medium text-xs">
            BI - OJK Hackathon 2025
          </span>
        </div>

        {/* Loading Progress - Professional Dark Theme */}
        <div className="w-72 max-w-sm mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {/* Progress info */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-medium">
              Initializing system...
            </span>
            <span className="text-gray-300 text-xs font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Progress bar container */}
          <div className="w-full bg-gray-800/50 rounded-full h-1.5 border border-gray-700/30">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Loading status text */}
        <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <p className="text-gray-500 text-xs font-medium">
            Securing blockchain infrastructure...
          </p>
        </div>
      </div>

      {/* Window Opening Effect - Curtain/Blind */}
      {isTransitioning && (
        <>
          {/* Top curtain */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 z-50 animate-curtain-up"></div>
          {/* Bottom curtain */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 z-50 animate-curtain-down"></div>
        </>
      )}

      {/* Professional Dark Theme Animations */}
      <style jsx>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gentle-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.02);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        /* WINDOW OPENING EFFECTS */
        @keyframes window-open {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        @keyframes content-fade-out {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          60% {
            opacity: 0.3;
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }

        @keyframes curtain-up {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        @keyframes curtain-down {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          opacity: 0;
        }
        
        .animate-gentle-glow {
          animation: gentle-glow 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-window-open {
          animation: window-open 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-content-fade-out {
          animation: content-fade-out 0.8s ease-out forwards;
        }

        .animate-curtain-up {
          animation: curtain-up 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-curtain-down {
          animation: curtain-down 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  )
}