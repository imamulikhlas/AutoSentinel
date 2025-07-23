"use client"

import type React from "react"
import { useState } from "react"

interface SmoothButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const SmoothButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}: SmoothButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  const baseClasses =
    "relative overflow-hidden font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-oramge-400/30 hover:border-blue-300/50",
    secondary:
      "bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50 hover:border-gray-600/50 backdrop-blur-xl",
    outline: "bg-transparent hover:bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-400/50",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isPressed ? "scale-95" : "hover:scale-105"}
        ${loading ? "cursor-wait" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <span
        className={`relative z-10 flex items-center justify-center ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
      >
        {children}
      </span>
    </button>
  )
}
