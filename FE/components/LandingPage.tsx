"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, Brain, Code, Users, ArrowRight, CheckCircle, BarChart3, Lock, Globe } from "lucide-react"
import { Navigation } from "./Navigation"
import { BackgroundElements } from "./BackgroundElements"
import { HackathonHero } from "./HackathonHero"
import { HackathonShowcase } from "./HackathonShowcase"
import { FloatingHackathonBadge } from "./FloatingHackathonBadge"

interface LandingPageProps {
  onNavigate: (page: "landing" | "dashboard" | "docs") => void
  user: any
  onLogout: () => void
}

export const LandingPage = ({ onNavigate, user, onLogout }: LandingPageProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <BackgroundElements mousePosition={mousePosition} />
      <FloatingHackathonBadge />

      {/* Navigation */}
      <Navigation onNavigate={onNavigate} user={user} onLogout={onLogout} />

      {/* Hero Section with Hackathon Theme */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <HackathonHero />

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => onNavigate("dashboard")}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center border-orange-400/30 group"
            >
              <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Start Security Analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("docs")}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border-gray-700/50 hover:border-gray-600/50 flex items-center group backdrop-blur-xl"
            >
              <Code className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              View API Docs
            </button>
          </div>
        </div>
      </section>

      {/* Hackathon Showcase Section */}
      <HackathonShowcase />

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Why Choose Auto Sentinel?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI technology meets enterprise-grade security analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Detection",
                description: "Advanced machine learning algorithms analyze patterns across millions of smart contracts",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: Zap,
                title: "Real-time Analysis",
                description: "Instant threat detection and comprehensive security assessment in seconds",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: Code,
                title: "Developer API",
                description: "RESTful API with comprehensive documentation for seamless integration",
                gradient: "from-green-400 to-blue-500",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Detailed insights, usage statistics, and security trends visualization",
                gradient: "from-blue-400 to-cyan-500",
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-grade security with API key management and rate limiting",
                gradient: "from-red-400 to-pink-500",
              },
              {
                icon: Globe,
                title: "Multi-Chain Support",
                description: "Support for Ethereum, Polygon, BSC, Arbitrum, and more blockchains",
                gradient: "from-indigo-400 to-purple-500",
              },
            ].map(({ icon: Icon, title, description, gradient }, i) => (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div
                  className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 relative z-10 group-hover:text-blue-200 transition-colors">
                  {title}
                </h3>

                <p className="text-gray-400 leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-3xl p-12 border-orange-500/20 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "Contracts Analyzed", icon: Shield },
                { number: "99.9%", label: "Accuracy Rate", icon: CheckCircle },
                { number: "500+", label: "Developers", icon: Users },
                { number: "24/7", label: "API Uptime", icon: Zap },
              ].map(({ number, label, icon: Icon }, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-orange-400 group-hover:animate-pulse" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {number}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Secure Your Smart Contracts?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers using Auto Sentinel for comprehensive security analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("dashboard")}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center border-orange-400/30 group"
            >
              <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate("docs")}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center group backdrop-blur-xl"
            >
              <Code className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Explore API
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl border-orange-400/30 mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-xl">Auto Sentinel</div>
                <div className="text-gray-400 text-sm">By Anjay Mabar Team</div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-400">
              <span className="text-sm">© 2025 Auto Sentinel. Built for BI-OJK Hackathon.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
