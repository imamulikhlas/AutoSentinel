"use client"

import { useState, useEffect } from "react"
import { ShieldIcon, SparklesIcon } from "./IconComponents"

interface InitialLoaderProps {
  onLoadingComplete: () => void
}

export const InitialLoader = ({ onLoadingComplete }: InitialLoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate loading progress with accurate calculation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Start fade out animation
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => {
              onLoadingComplete()
            }, 500) // Wait for fade out animation
          }, 500)
          return 100
        }
        
        // Calculate increment based on remaining progress
        // This ensures smooth progression and never exceeds 100%
        const remaining = 100 - prev
        const increment = Math.min(
          Math.random() * 8 + 2, // Random increment between 2-10
          remaining // Never exceed what's remaining
        )
        
        const newProgress = prev + increment
        return Math.min(newProgress, 100) // Extra safety to ensure never > 100
      })
    }, 150)

    return () => clearInterval(progressInterval)
  }, [onLoadingComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center transition-opacity duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-${i % 3} opacity-30`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <SparklesIcon className="w-4 h-4 text-orange-400" />
          </div>
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl shadow-2xl border-blue-400/30 hover:scale-105 transition-transform duration-300 group">
            <ShieldIcon className="w-16 h-16 text-white group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        {/* App Name with Futuristic Font */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight font-orbitron">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            AUTO SENTINEL
          </span>
          <span className="animate-wave inline-block ml-2">✌️</span>
        </h1>

        {/* Hackathon Badge */}
        <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-full px-6 py-3 mb-8 shadow-xl font-space-grotesk">
          <img
            src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
            alt="BI - OJK Hackathon 2025"
            className="h-5 w-auto mr-3 animate-pulse"
          />
          <span className="text-gray-300 font-medium text-sm">BI - OJK HACKATHON 2025</span>
        </div>

        {/* Loading Progress */}
        <div className="w-80 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-space-grotesk">INITIALIZING...</span>
            <span className="text-blue-400 text-sm font-bold font-jetbrains-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 backdrop-blur-xl border-gray-700/50">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-400 text-sm mt-6 animate-pulse font-space-grotesk tracking-wider">
          AI-POWERED SECURITY SYSTEM LOADING...
        </p>
      </div>
    </div>
  )
}