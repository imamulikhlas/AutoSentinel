import { Shield } from "lucide-react"

export const HeroSection = () => {
  return (
    <div className="text-center mb-12 sm:mb-20">
      {/* Enhanced Hackathon Badge */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-2 sm:p-3 border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center space-x-2">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-6 sm:h-8 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                Built for BI - OJK
              </p>
              <p className="text-xs text-gray-400">Hackathon 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathon Badge */}
      <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
        <img
          src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
          alt="BI - OJK Hackathon 2025"
          className="h-4 sm:h-5 md:h-6 w-auto mr-2 sm:mr-3 group-hover:animate-pulse"
        />
        <span className="text-gray-300 font-medium text-xs sm:text-sm group-hover:text-white transition-colors">
          Proudly built for BI - OJK Hackathon 2025
        </span>
      </div>

      {/* Main Logo */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border-blue-400/30 hover:scale-105 transition-transform duration-300 group">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:rotate-12 transition-transform" />
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4">
        <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Auto Sentinel
        </span>
        <span className="animate-wave inline-block">✌️</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-light px-4">
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
          Auto Sentinel stops web3 threats before they do any damage
        </span>{" "}
        with the most accurate real-time advanced warning system powered by AI.
      </p>
    </div>
  )
}
