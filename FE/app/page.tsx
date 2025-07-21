"use client"

import { useState } from "react"
import { LandingPage } from "@/components/LandingPage"
import { Dashboard } from "@/components/Dashboard"
import { ApiDocs } from "@/components/ApiDocs"
import { LoginModal } from "@/components/LoginModal"
import { InitialLoader } from "@/components/InitialLoader"
import { useAuth } from "@/hooks/useAuth"
import { useLenis } from "@/hooks/useLenis"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "docs">("landing")
  const [showLogin, setShowLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, login, logout } = useAuth()

  // Initialize Lenis smooth scrolling
  useLenis()

  const handleNavigation = (page: "landing" | "dashboard" | "docs") => {
    if (page === "dashboard" && !user) {
      setShowLogin(true)
      return
    }
    setCurrentPage(page)
  }

  const handleLogin = (credentials: { email: string; password: string }) => {
    login(credentials)
    setShowLogin(false)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    logout()
    setCurrentPage("landing") // Redirect to landing page after logout
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <InitialLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigation} user={user} onLogout={handleLogout} />}
      {currentPage === "dashboard" && user && (
        <Dashboard onNavigate={handleNavigation} user={user} onLogout={handleLogout} />
      )}
      {currentPage === "docs" && <ApiDocs onNavigate={handleNavigation} user={user} onLogout={handleLogout} />}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
    </div>
  )
}
