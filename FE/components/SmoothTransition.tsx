"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface SmoothTransitionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export const SmoothTransition = ({ children, className = "", delay = 0, direction = "up" }: SmoothTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const getTransitionClasses = () => {
    const base = "transition-all duration-500 ease-out"

    if (!isVisible) {
      switch (direction) {
        case "up":
          return `${base} opacity-0 translate-y-6`
        case "down":
          return `${base} opacity-0 -translate-y-6`
        case "left":
          return `${base} opacity-0 translate-x-6`
        case "right":
          return `${base} opacity-0 -translate-x-6`
        case "fade":
          return `${base} opacity-0`
        default:
          return `${base} opacity-0 translate-y-6`
      }
    }

    return `${base} opacity-100 translate-y-0 translate-x-0`
  }

  return <div className={`${getTransitionClasses()} ${className}`}>{children}</div>
}
