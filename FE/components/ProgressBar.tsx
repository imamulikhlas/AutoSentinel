interface ProgressBarProps {
  loading: boolean
  progressStep: number
  loadingMessage?: string
}

export const ProgressBar = ({ loading, progressStep, loadingMessage }: ProgressBarProps) => {
  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${progressStep}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>
      {loadingMessage && (
        <div className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3">
          <div className="container mx-auto">
            <p className="text-blue-300 text-sm font-medium animate-pulse flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-bounce"></div>
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
