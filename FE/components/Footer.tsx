import { Shield, Lock, Brain, Zap } from "lucide-react"

export const Footer = () => {
  return (
    <div className="text-center mt-16 sm:mt-24 py-12 sm:py-16 border-t border-gray-700/50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 mb-8 sm:mb-12 text-left">
        {/* Logo BI-OJK */}
        <div className="flex items-center group hover:scale-105 transition-transform duration-300">
          <img
            src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
            alt="BI Hackathon 2025"
            className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto group-hover:animate-pulse"
          />
          <div className="ml-3 sm:ml-4">
            <p className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
              Proudly built for
            </p>
            <p className="font-bold text-white text-base sm:text-lg group-hover:text-blue-300 transition-colors">
              BI - OJK Hackathon 2025
            </p>
          </div>
        </div>
        {/* Divider */}
        <div className="hidden md:block w-px h-12 sm:h-16 bg-gray-600 animate-pulse"></div>
        {/* Auto Sentinel Info */}
        <div className="flex items-center group hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 rounded-2xl border-blue-400/30 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div className="ml-3 sm:ml-4">
            <span className="text-white font-bold text-xl sm:text-2xl group-hover:text-blue-300 transition-colors">
              Auto Sentinel
              <span className="animate-wave inline-block ml-2">✌️</span>
            </span>
            <p className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
              By Anjay Mabar Team
            </p>
          </div>
        </div>
      </div>
      {/* Description */}
      <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4">
        This cutting-edge security platform was developed during the hackathon to demonstrate the future of{" "}
        <span className="text-blue-400 font-semibold">AI-powered blockchain security</span> and threat detection.
      </p>
      {/* Feature Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 group-hover:animate-pulse" />
          <span className="text-base sm:text-lg group-hover:text-white transition-colors">
            Check Your Smart Contract
          </span>
        </div>
        <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 group-hover:animate-pulse" />
          <span className="text-base sm:text-lg group-hover:text-white transition-colors">AI-Powered Detection</span>
        </div>
        <div className="flex items-center justify-center text-gray-400 group hover:scale-105 transition-all duration-300">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-400 group-hover:animate-pulse" />
          <span className="text-base sm:text-lg group-hover:text-white transition-colors">AI Analytics</span>
        </div>
      </div>
    </div>
  )
}
