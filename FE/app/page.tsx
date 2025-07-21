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
    setCurrentPage("landing")
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Always render background to prevent white flash
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Fixed background to prevent white flash */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 -z-10" />
      
      {isLoading ? (
        <InitialLoader onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>          
          {/* Main content - NO transitions for now */}
          <div className="relative z-10">
            {currentPage === "landing" && (
              <LandingPage onNavigate={handleNavigation} user={user} onLogout={handleLogout} />
            )}
            {currentPage === "dashboard" && user && (
              <Dashboard onNavigate={handleNavigation} user={user} onLogout={handleLogout} />
            )}
            {currentPage === "docs" && (
              <ApiDocs onNavigate={handleNavigation} user={user} onLogout={handleLogout} />
            )}
          </div>
        </>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />
    </div>
  )
}