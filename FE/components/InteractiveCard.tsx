"use client"

import type React from "react"

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: boolean
  onClick?: () => void
}

export const InteractiveCard = ({ children, className = "", hoverScale = true, onClick, ...rest }: InteractiveCardProps) => {
  const Component = onClick ? "button" : "div"

  return (
    <Component
      onClick={onClick}
      className={`
        transition-all duration-300 ease-out
        ${hoverScale ? "hover:scale-[1.02] hover:-translate-y-1" : ""}
        ${onClick ? "cursor-pointer" : ""}
        hover:shadow-xl
        ${className}
      `}
      {...rest}
    >
      {children}
    </Component>
  )
}
