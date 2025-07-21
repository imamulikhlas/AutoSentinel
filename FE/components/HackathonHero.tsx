"use client"

import { useState, useEffect } from "react"
import { SparklesIcon, TrophyIcon } from "./IconComponents"

export const HackathonHero = () => {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-${i % 3} opacity-20`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <SparklesIcon className="w-4 h-4 text-orange-400" />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center py-16 px-4">
        {/* Main Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border-2 border-orange-500/30 rounded-full px-8 py-4 mb-8 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 group">
          <div className="relative mr-4">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-8 w-auto group-hover:animate-pulse"
            />
            <div className="absolute inset-0 -m-2 border-2 border-orange-400/30 rounded-full animate-ping"></div>
          </div>
          <div className="text-left font-space-grotesk">
            <p className="text-orange-400 font-bold text-lg">BI - OJK HACKATHON 2025</p>
            <p className="text-orange-300 text-sm">🏆 INNOVATION IN FINTECH SECURITY</p>
          </div>
        </div>

        {/* Dynamic Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-orbitron">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            AUTO SENTINEL
          </span>
          <span className="animate-wave inline-block ml-2">✌️</span>
          <br />
          <span
            className={`transition-all duration-1000 font-space-grotesk ${
              animationPhase === 0
                ? "bg-gradient-to-r from-orange-400 to-red-500"
                : animationPhase === 1
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : animationPhase === 2
                    ? "bg-gradient-to-r from-green-400 to-cyan-500"
                    : "bg-gradient-to-r from-pink-400 to-orange-500"
            } bg-clip-text text-transparent`}
          >
            {animationPhase === 0 && "AI-POWERED SECURITY"}
            {animationPhase === 1 && "BLOCKCHAIN PROTECTION"}
            {animationPhase === 2 && "SMART CONTRACT AUDIT"}
            {animationPhase === 3 && "THREAT DETECTION"}
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-space-grotesk">
          Revolutionary AI technology that stops web3 threats before they cause damage
        </p>

        {/* Achievement Badges */}
        {/* <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: "🏆", text: "HACKATHON WINNER", color: "from-yellow-400 to-orange-500" },
            { icon: "🤖", text: "AI INNOVATION", color: "from-purple-400 to-pink-500" },
            { icon: "⚡", text: "REAL-TIME ANALYSIS", color: "from-blue-400 to-cyan-500" },
            { icon: "🛡️", text: "SECURITY FIRST", color: "from-green-400 to-emerald-500" },
          ].map(({ icon, text, color }, i) => (
            <div
              key={i}
              className={`inline-flex items-center bg-gradient-to-r ${color} bg-opacity-20 backdrop-blur-xl border-white/20 rounded-full px-4 py-2 text-white font-medium text-sm hover:scale-105 transition-all duration-300 shadow-lg font-space-grotesk`}
            >
              <span className="mr-2">{icon}</span>
              {text}
            </div>
          ))}
        </div> */}

        {/* Hackathon Stats */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { value: "72", label: "HOURS BUILT", icon: "⏱️" },
            { value: "100+", label: "TEAMS COMPETED", icon: "👥" },
            { value: "$50K", label: "PRIZE POOL", icon: "💰" },
            { value: "#1", label: "SECURITY CATEGORY", icon: "🥇" },
          ].map(({ value, label, icon }, i) => (
            <div
              key={i}
              className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors font-orbitron">
                {value}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-space-grotesk tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div> */}
        
      </div>
    </div>
  )
}
