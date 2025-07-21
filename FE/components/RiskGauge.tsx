"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface RiskGaugeProps {
  score: number
  label: string
  delay?: number
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, label, delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentScore = 0
      const interval = setInterval(() => {
        currentScore += 2
        if (currentScore >= score) {
          setAnimatedScore(score)
          setHasAnimated(true)
          clearInterval(interval)
        } else {
          setAnimatedScore(currentScore)
        }
      }, 20)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [score, delay])

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  const strokeColor = animatedScore >= 80 ? "#10b981" : animatedScore >= 60 ? "#f59e0b" : "#ef4444"

  return (
    <div className="flex flex-col items-center group transform hover:scale-110 transition-all duration-500">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
        <svg className="relative w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{animatedScore}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-300 text-center group-hover:text-white transition-colors px-2">
        {label}
      </p>
    </div>
  )
}
