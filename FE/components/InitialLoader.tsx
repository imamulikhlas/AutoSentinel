"use client"

import { useState, useEffect } from "react"
import { ShieldIcon, SparklesIcon } from "./IconComponents"

interface InitialLoaderProps {
  onLoadingComplete: () => void
}

export const InitialLoader = ({ onLoadingComplete }: InitialLoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate loading progress with accurate calculation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Start fade out animation
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => {
              onLoadingComplete()
            }, 500) // Wait for fade out animation
          }, 500)
          return 100
        }

        // Calculate increment based on remaining progress
        // This ensures smooth progression and never exceeds 100%
        const remaining = 100 - prev
        const increment = Math.min(
          Math.random() * 8 + 2, // Random increment between 2-10
          remaining // Never exceed what's remaining
        )

        const newProgress = prev + increment
        return Math.min(newProgress, 100) // Extra safety to ensure never > 100
      })
    }, 150)

    return () => clearInterval(progressInterval)
  }, [onLoadingComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center transition-opacity duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-${i % 3} opacity-30`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <SparklesIcon className="w-4 h-4 text-orange-400" />
          </div>
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">

        {/* Logo Container - CINEMATIC EFFECT */}
        <div className="relative mb-12 flex justify-center">
          {/* Outer Ring Effect */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border border-purple-500/40 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border border-cyan-500/20 rounded-full animate-pulse"></div>
          </div>
          
          {/* Energy Pulses */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-ping"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>

          {/* Main Glow Effect - Multiple Layers */}
          <div className="absolute inset-0 w-28 h-28 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-full blur-3xl opacity-60 animate-pulse scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse scale-125" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse scale-110" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Logo Container with Cinematic Reveal */}
          <div className="relative bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-2xl transform transition-all duration-1000 hover:scale-105 animate-logo-reveal">
            {/* Inner Glow */}
            <div className="absolute inset-1 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-2xl"></div>
            
            <img
              src="/assets/logo3.png"
              alt="Auto Sentinel Logo"
              className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl animate-logo-float"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = `
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl animate-logo-float">
                    <svg class="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 1L3 6v8l7 5 7-5V6l-7-5zM6.5 8.5l3-2.5 3 2.5v3l-3 2.5-3-2.5v-3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                `;
              }}
            />
            
            {/* Lens Flare Effects */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-80 animate-twinkle"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-twinkle" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-twinkle" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Particle Effects */}
          <div className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float-particle opacity-60"
                style={{
                  left: `${50 + Math.cos((i * 30) * Math.PI / 180) * 60}%`,
                  top: `${50 + Math.sin((i * 30) * Math.PI / 180) * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Wave Emoji */}
        {/* <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight font-orbitron">
          <span className="animate-wave inline-block">✌️</span>
        </h1> */}

        {/* App Name with Futuristic Font */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight font-orbitron">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            AUTO SENTINEL
          </span>
        </h1>

        {/* Hackathon Badge */}
        <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-full px-6 py-3 mb-8 shadow-xl font-space-grotesk">
          <img
            src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
            alt="BI - OJK Hackathon 2025"
            className="h-5 w-auto mr-3 animate-pulse"
            onError={(e) => {
              // Fallback jika logo hackathon tidak ada
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-gray-300 font-medium text-sm">By Anjay Mabar Team</span>
        </div>

        {/* Loading Progress */}
        <div className="w-80 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-space-grotesk">INITIALIZING...</span>
            <span className="text-blue-400 text-sm font-bold font-jetbrains-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 backdrop-blur-xl border border-gray-700/50">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-400 text-sm mt-6 animate-pulse font-space-grotesk tracking-wider">
          AI-POWERED SECURITY SYSTEM LOADING...
        </p>
      </div>

      {/* Custom CSS untuk cinematic effects */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes logo-reveal {
          0% { 
            opacity: 0; 
            transform: scale(0.5) rotateY(180deg); 
            filter: blur(10px);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.1) rotateY(90deg); 
            filter: blur(2px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotateY(0deg); 
            filter: blur(0px);
          }
        }
        
        @keyframes logo-float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-3px) scale(1.05); 
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(0.5);
            opacity: 0;
          }
          50% { 
            transform: translateY(-20px) translateX(10px) scale(1);
            opacity: 0.8;
          }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        .animate-logo-reveal { animation: logo-reveal 2s ease-out forwards; }
        .animate-logo-float { animation: logo-float 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
        .animate-float-0 { animation: float-0 3s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}