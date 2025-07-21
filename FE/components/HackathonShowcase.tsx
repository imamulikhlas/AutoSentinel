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
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Innovation Highlights */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border-gray-700/50 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <Code className="w-8 h-8 mr-3 text-orange-400" />
              Our Hackathon Innovation
            </h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Auto Sentinel represents the future of blockchain security
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
                icon: "🔥",
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
        {/* <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl border-orange-400/30 group">
            <Trophy className="w-6 h-6 mr-3 group-hover:animate-bounce" />
            <span>Experience Our Hackathon Innovation</span>
            <Zap className="w-5 h-5 ml-3 group-hover:animate-pulse" />
          </div>
        </div> */}
      </div>
    </section>
  )
}
