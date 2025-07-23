import { Shield } from "lucide-react"
import { SmoothTransition } from "./SmoothTransition"
import { InteractiveCard } from "./InteractiveCard"

export const HeroSection = () => {
  return (
    <div className="text-center mb-12 sm:mb-20">
      {/* Enhanced Hackathon Badge */}
      <SmoothTransition delay={0}>
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <InteractiveCard className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-2 sm:p-3 border-gray-700/50 shadow-2xl">
            <div className="flex items-center space-x-2">
              <img
                src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                alt="BI - OJK Hackathon 2025"
                className="h-6 sm:h-8 w-auto transition-transform duration-300 hover:scale-110"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white transition-colors duration-300 hover:text-blue-300">
                  Built for BI - OJK
                </p>
                <p className="text-xs text-gray-400 transition-colors duration-300">Hackathon 2025</p>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </SmoothTransition>

      {/* Hackathon Badge */}
      <SmoothTransition delay={200}>
        <InteractiveCard
          hoverScale={false}
          className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-xl hover:shadow-blue-500/20 transition-all duration-400"
        >
          <img
            src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
            alt="BI - OJK Hackathon 2025"
            className="h-4 sm:h-5 md:h-6 w-auto mr-2 sm:mr-3 transition-transform duration-300 hover:scale-110"
          />
          <span className="text-gray-300 font-medium text-xs sm:text-sm transition-colors duration-300 hover:text-white">
            Proudly built for BI - OJK Hackathon 2025
          </span>
        </InteractiveCard>
      </SmoothTransition>

      {/* Main Logo */}
      <SmoothTransition delay={400}>
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 animate-pulse"></div>
            <InteractiveCard className="relative bg-gradient-to-r from-orange-500 to-red-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border-blue-400/30">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-white transition-transform duration-300 hover:rotate-12" />
            </InteractiveCard>
          </div>
        </div>
      </SmoothTransition>

      {/* Hero Text */}
      <SmoothTransition delay={600}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4 transition-all duration-500 hover:scale-105">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent transition-all duration-500 hover:from-blue-300 hover:via-purple-300 hover:to-pink-300">
            Auto Sentinel
          </span>
          <span className="animate-wave inline-block">✌️</span>
        </h1>
      </SmoothTransition>

      <SmoothTransition delay={800}>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-light px-4 transition-all duration-400 hover:text-gray-200">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold transition-all duration-400 hover:from-blue-300 hover:to-purple-300">
            Auto Sentinel stops web3 threats before they do any damage
          </span>{" "}
          with the most accurate real-time advanced warning system powered by AI.
        </p>
      </SmoothTransition>
    </div>
  )
}
