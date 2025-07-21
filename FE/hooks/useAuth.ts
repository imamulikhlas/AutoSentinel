"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "enterprise"
  apiKey: string
  usage: {
    requests: number
    limit: number
    resetDate: string
  }
  joinDate: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session with smooth loading
    const checkSession = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading

      const savedUser = localStorage.getItem("auto-sentinel-user")
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          localStorage.removeItem("auto-sentinel-user")
        }
      }
      setIsLoading(false)
    }

    checkSession()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)

    // Simulate API call with smooth loading
    await new Promise((resolve) => setTimeout(resolve, 800))

    const dummyUser: User = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.email.split("@")[0],
      plan: "pro",
      apiKey: "as_" + Math.random().toString(36).substr(2, 32),
      usage: {
        requests: Math.floor(Math.random() * 500),
        limit: 1000,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      joinDate: new Date().toISOString(),
    }

    setUser(dummyUser)
    localStorage.setItem("auto-sentinel-user", JSON.stringify(dummyUser))
    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)

    // Smooth logout animation
    await new Promise((resolve) => setTimeout(resolve, 300))

    setUser(null)
    localStorage.removeItem("auto-sentinel-user")
    sessionStorage.clear()

    setIsLoading(false)

    // Show logout success message
    const event = new CustomEvent("show-toast", {
      detail: {
        type: "success",
        message: "Successfully logged out",
      },
    })
    window.dispatchEvent(event)
  }

  const regenerateApiKey = () => {
    if (user) {
      const updatedUser = {
        ...user,
        apiKey: "as_" + Math.random().toString(36).substr(2, 32),
      }
      setUser(updatedUser)
      localStorage.setItem("auto-sentinel-user", JSON.stringify(updatedUser))
    }
  }

  return { user, login, logout, regenerateApiKey, isLoading }
}
