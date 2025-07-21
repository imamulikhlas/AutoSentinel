"use client"

import { useState, useEffect } from "react"
import { Trophy, Calendar, Users, Target, Sparkles, Award, Zap, Code } from "lucide-react"

export const HackathonShowcase = () => {
  const [currentStat, setCurrentStat] = useState(0)

  const hackathonStats = [
    { label: "Days of Innovation", value: "3", icon: Calendar },
    { label: "Participating Teams", value: "100+", icon: Users },
    { label: "Prize Pool", value: "$50K", icon: Trophy },
    { label: "Categories", value: "5", icon: Target },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % hackathonStats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hackathon Banner */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            {/* Animated Ring */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-dashed border-orange-500/30 rounded-full"></div>
            </div>

            {/* Logo Container */}
            <div className="relative bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-full p-6 sm:p-8 border-2 border-orange-500/30 shadow-2xl hover:scale-110 transition-all duration-500 group">
              <img
                src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                alt="BI - OJK Hackathon 2025"
                className="h-16 w-auto sm:h-20 group-hover:animate-pulse"
              />

              {/* Floating Sparkles */}
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce delay-300">
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              BI - OJK Hackathon 2025
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            🏆 <span className="font-semibold text-orange-400">Auto Sentinel</span> - Revolutionizing blockchain
            security with AI-powered threat detection
          </p>

          {/* Hackathon Theme Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-500/30 rounded-full px-8 py-4 shadow-xl hover:shadow-orange-500/20 transition-all duration-300 group mb-12">
            <Award className="w-6 h-6 text-orange-400 mr-3 group-hover:animate-spin" />
            <span className="text-orange-300 font-bold text-lg">"Innovation in Financial Technology Security"</span>
          </div>
        </div>

        {/* Animated Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {hackathonStats.map(({ label, value, icon: Icon }, i) => (
            <div
              key={i}
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 hover:scale-105 group ${
                currentStat === i
                  ? "border-orange-500/50 shadow-lg shadow-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10"
                  : "border-gray-700/50 hover:border-orange-500/30"
              }`}
            >
              {/* Animated Background */}
              {currentStat === i && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-2xl animate-pulse"></div>
              )}

              <div className="relative z-10 text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    currentStat === i
                      ? "bg-gradient-to-r from-orange-500/30 to-red-500/30 border-orange-500/50"
                      : "bg-gray-700/50 border-gray-600/50 group-hover:bg-orange-500/20"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-300 ${
                      currentStat === i ? "text-orange-400" : "text-gray-400 group-hover:text-orange-400"
                    }`}
                  />
                </div>
                <div
                  className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                    currentStat === i ? "text-orange-400" : "text-white"
                  }`}
                >
                  {value}
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Innovation Highlights */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border-gray-700/50 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <Code className="w-8 h-8 mr-3 text-orange-400" />
              Our Hackathon Innovation
            </h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Built in 72 hours, Auto Sentinel represents the future of blockchain security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Detection",
                description: "Revolutionary machine learning algorithms that identify threats in real-time",
                icon: "🤖",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/30",
              },
              {
                title: "Comprehensive API",
                description: "Enterprise-grade REST API with extensive documentation and SDKs",
                icon: "⚡",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30",
              },
              {
                title: "User-Friendly Interface",
                description: "Intuitive dashboard that makes complex security analysis accessible",
                icon: "🎨",
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-500/30",
              },
            ].map(({ title, description, icon, gradient, border }, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${gradient} backdrop-blur-xl rounded-2xl p-6 border ${border} hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  {icon}
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h4 className="text-white font-bold text-xl mb-3 group-hover:text-orange-200 transition-colors">
                    {title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl border-orange-400/30 group">
            <Trophy className="w-6 h-6 mr-3 group-hover:animate-bounce" />
            <span>Experience Our Hackathon Innovation</span>
            <Zap className="w-5 h-5 ml-3 group-hover:animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
