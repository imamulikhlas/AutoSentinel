"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, Brain, Code, Users, ArrowRight, CheckCircle, BarChart3, Lock, Globe } from "lucide-react"
import { Navigation } from "./Navigation"
import { BackgroundElements } from "./BackgroundElements"
import { HackathonHero } from "./HackathonHero"
import { HackathonShowcase } from "./HackathonShowcase"
import { FloatingHackathonBadge } from "./FloatingHackathonBadge"
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"
import { SmoothButton } from "./SmoothButton"

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

          <SmoothTransition delay={1000}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3">
              <SmoothButton
                onClick={() => onNavigate("dashboard")}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-orange-400/30 shadow-2xl"
              >
                <Shield className="w-6 h-6 mr-3 transition-transform duration-300 hover:rotate-12" />
                Start Security Analysis
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 hover:translate-x-1" />
              </SmoothButton>

              <SmoothButton onClick={() => onNavigate("docs")} variant="secondary" size="lg">
                <Code className="w-6 h-6 mr-3 transition-all duration-300 hover:scale-110" />
                View API Docs
              </SmoothButton>
            </div>
          </SmoothTransition>
        </div>
      </section>

      {/* Hackathon Showcase Section */}
      <HackathonShowcase />

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SmoothTransition delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 transition-all duration-400 hover:scale-105">
                Why Choose Auto Sentinel?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto transition-colors duration-300 hover:text-gray-200">
                Advanced AI technology meets enterprise-grade security analysis
              </p>
            </div>
          </SmoothTransition>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Detection",
                description: "Advanced machine learning algorithms analyze patterns across millions of smart contracts",
                gradient: "from-purple-400 to-pink-500",
                glowEffect: "purple" as const,
              },
              {
                icon: Zap,
                title: "Real-time Analysis",
                description: "Instant threat detection and comprehensive security assessment in seconds",
                gradient: "from-yellow-400 to-orange-500",
                glowEffect: "orange" as const,
              },
              {
                icon: Code,
                title: "Developer API",
                description: "RESTful API with comprehensive documentation for seamless integration",
                gradient: "from-green-400 to-blue-500",
                glowEffect: "blue" as const,
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Detailed insights, usage statistics, and security trends visualization",
                gradient: "from-blue-400 to-cyan-500",
                glowEffect: "blue" as const,
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-grade security with API key management and rate limiting",
                gradient: "from-red-400 to-pink-500",
                glowEffect: "orange" as const,
              },
              {
                icon: Globe,
                title: "Multi-Chain Support",
                description: "Support for Ethereum, Polygon, BSC, Arbitrum, and more blockchains",
                gradient: "from-indigo-400 to-purple-500",
                glowEffect: "purple" as const,
              },
            ].map(({ icon: Icon, title, description, gradient, glowEffect }, i) => (
              <SmoothTransition key={i} delay={400 + i * 100}>
                <InteractiveCard
                  glowEffect={glowEffect}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 hover:opacity-100 transition-opacity duration-400"></div>

                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110 hover:rotate-12 relative z-10`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 relative z-10 transition-colors duration-300 hover:text-blue-200">
                    {title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed relative z-10 transition-colors duration-300 hover:text-gray-300">
                    {description}
                  </p>
                </InteractiveCard>
              </SmoothTransition>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SmoothTransition delay={200}>
            <InteractiveCard
              glowEffect="orange"
              className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-3xl p-12 border-orange-500/20 backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "All", label: "Smart Contract Can Analyze", icon: Shield },
                  { number: "99.9%", label: "Accuracy Rate", icon: CheckCircle },
                  { number: "4", label: "Team Members", icon: Users },
                  { number: "24/7", label: "API Uptime", icon: Zap },
                ].map(({ number, label, icon: Icon }, i) => (
                  <SmoothTransition key={i} delay={300 + i * 100}>
                    <div className="group">
                      <div className="flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-orange-300 group-hover:scale-105">
                        {number}
                      </div>
                      <div className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                        {label}
                      </div>
                    </div>
                  </SmoothTransition>
                ))}
              </div>
            </InteractiveCard>
          </SmoothTransition>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <SmoothTransition delay={0}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 transition-all duration-400 hover:scale-105">
              Ready to Secure or Checking Your Smart Contracts?
            </h2>
          </SmoothTransition>

          <SmoothTransition delay={200}>
            <p className="text-xl text-gray-300 mb-8 transition-colors duration-300 hover:text-gray-200">
              Join thousands of developers using Auto Sentinel for comprehensive security analysis
            </p>
          </SmoothTransition>

          <SmoothTransition delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SmoothButton
                onClick={() => onNavigate("dashboard")}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-orange-400/30 shadow-2xl"
              >
                <Shield className="w-6 h-6 mr-3 transition-transform duration-300 hover:rotate-12" />
                Get Started Free
              </SmoothButton>
              <SmoothButton onClick={() => onNavigate("docs")} variant="secondary" size="lg">
                <Code className="w-6 h-6 mr-3 transition-all duration-300 hover:scale-110" />
                Explore API
              </SmoothButton>
            </div>
          </SmoothTransition>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SmoothTransition delay={0}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <InteractiveCard className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl border-orange-400/30 mr-4">
                  <Shield className="w-6 h-6 text-white transition-transform duration-300 hover:rotate-12" />
                </InteractiveCard>
                <div>
                  <div className="text-white font-bold text-xl transition-colors duration-300 hover:text-orange-300">
                    Auto Sentinel
                  </div>
                  <div className="text-gray-400 text-sm transition-colors duration-300 hover:text-gray-300">
                    By Anjay Mabar Team
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-400">
                <span className="text-sm transition-colors duration-300 hover:text-gray-300">
                  © 2025 Auto Sentinel. Built for BI-OJK Hackathon.
                </span>
              </div>
            </div>
          </SmoothTransition>
        </div>
      </footer>
    </div>
  )
}
