"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
  isVisible: boolean
  onTransitionComplete?: () => void
}

export const PageTransition = ({ children, isVisible, onTransitionComplete }: PageTransitionProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
        onTransitionComplete?.()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onTransitionComplete])

  if (!shouldRender) return null

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  )
}
