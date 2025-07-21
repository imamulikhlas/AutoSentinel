import { Brain } from "lucide-react"

export const SecurityBadge = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl sm:rounded-2xl p-6 sm:p-10 border-blue-500/30 text-center backdrop-blur-xl">
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 sm:p-6 rounded-full border-blue-500/30 animate-pulse">
          <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
        </div>
      </div>
      <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Advanced AI Security Technology</h4>
      <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
        Powered by next-generation artificial intelligence and machine learning algorithms. Our threat detection system
        analyzes patterns across millions of smart contracts to identify sophisticated attack vectors before they can
        cause damage.
      </p>
    </div>
  )
}
