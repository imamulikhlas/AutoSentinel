"use client"

import { useState } from "react"
import { ShieldIcon } from "./IconComponents"
import { Menu, X, User, LogOut, BarChart3, Code, Home } from "lucide-react"

interface NavigationProps {
  onNavigate: (page: "landing" | "dashboard" | "docs") => void
  user: any
  onLogout: () => void
}

export const Navigation = ({ onNavigate, user, onLogout }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    setMobileMenuOpen(false) // Close mobile menu after logout
  }

  const handleNavigation = (page: "landing" | "dashboard" | "docs") => {
    onNavigate(page)
    setMobileMenuOpen(false) // Close mobile menu after navigation
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('landing')}
          >
            <div className="bg-white/50 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-inner mr-3">
              <img
                src="/assets/logo3.png"
                alt="Auto Sentinel Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-white font-bold text-xl font-orbitron">AUTO SENTINEL</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-space-grotesk">
            <button
              onClick={() => handleNavigation("landing")}
              className="text-gray-300 hover:text-white transition-colors flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              HOME
            </button>
            <button
              onClick={() => handleNavigation("dashboard")}
              className="text-gray-300 hover:text-white transition-colors flex items-center"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              DASHBOARD
            </button>
            <button
              onClick={() => handleNavigation("docs")}
              className="text-gray-300 hover:text-white transition-colors flex items-center"
            >
              <Code className="w-4 h-4 mr-2" />
              API DOCS
            </button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-800/50 rounded-lg px-3 py-2 border-gray-700/50">
                  <User className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-white text-sm font-space-grotesk">{user.name.toUpperCase()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors flex items-center hover:bg-red-500/20 px-3 py-2 rounded-lg border-transparent hover:border-red-500/30 font-space-grotesk"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("dashboard")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all border-blue-400/30 font-space-grotesk"
              >
                SIGN IN
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700/50 py-4">
            <div className="space-y-4 font-space-grotesk">
              <button
                onClick={() => handleNavigation("landing")}
                className="block text-gray-300 hover:text-white transition-colors flex items-center w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                HOME
              </button>
              <button
                onClick={() => handleNavigation("dashboard")}
                className="block text-gray-300 hover:text-white transition-colors flex items-center w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                DASHBOARD
              </button>
              <button
                onClick={() => handleNavigation("docs")}
                className="block text-gray-300 hover:text-white transition-colors flex items-center w-full"
              >
                <Code className="w-4 h-4 mr-2" />
                API DOCS
              </button>

              {user ? (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex items-center mb-4">
                    <User className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-white">{user.name.toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors flex items-center hover:bg-red-500/20 px-3 py-2 rounded-lg border-transparent hover:border-red-500/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    LOGOUT
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => handleNavigation("dashboard")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all border-blue-400/30 w-full"
                  >
                    SIGN IN
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
