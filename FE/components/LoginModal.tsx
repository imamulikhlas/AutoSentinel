"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { SmoothTransition } from "./SmoothTransition"
import { SmoothButton } from "./SmoothButton"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (credentials: { email: string; password: string }) => void
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onLogin({ email, password })
    setIsLoading(false)
    setEmail("")
    setPassword("")
  }

  const demoCredentials = [
    { email: "juri@hackathonbiojk.com", password: "biojkmaniamantap", plan: "Enterprise" },
    // { email: "enterprise@company.com", password: "enterprise", plan: "Enterprise" },
    // { email: "developer@startup.com", password: "dev123", plan: "Free" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <SmoothTransition delay={0} direction="fade">
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-gray-700/50 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          <SmoothTransition delay={100}>
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl border-blue-400/30 w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your dashboard</p>
            </div>
          </SmoothTransition>

          <SmoothTransition delay={200}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <SmoothButton type="submit" disabled={isLoading} loading={isLoading} variant="primary" className="w-full">
                {isLoading ? "Signing In..." : "Sign In"}
              </SmoothButton>
            </form>
          </SmoothTransition>

          <SmoothTransition delay={300}>
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-sm text-gray-400 mb-4 text-center">Demo Accounts:</p>
              <div className="space-y-2">
                {demoCredentials.map((cred, i) => (
                  <SmoothTransition key={i} delay={350 + i * 50}>
                    <button
                      onClick={() => {
                        setEmail(cred.email)
                        setPassword(cred.password)
                      }}
                      className="w-full text-left p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-white group-hover:text-blue-300 transition-colors duration-200">
                            {cred.email}
                          </div>
                          <div className="text-xs text-gray-400">{cred.plan} Plan</div>
                        </div>
                        <div className="text-xs text-gray-500">Click to use</div>
                      </div>
                    </button>
                  </SmoothTransition>
                ))}
              </div>
            </div>
          </SmoothTransition>
        </div>
      </SmoothTransition>
    </div>
  )
}
