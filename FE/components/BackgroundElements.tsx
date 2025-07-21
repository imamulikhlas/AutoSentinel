interface BackgroundElementsProps {
  mousePosition: { x: number; y: number }
}

export const BackgroundElements = ({ mousePosition }: BackgroundElementsProps) => {
  return (
    <>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>

        {/* Interactive mouse follower - Hidden on mobile */}
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl transition-all duration-300 pointer-events-none hidden lg:block"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
          }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </>
  )
}
