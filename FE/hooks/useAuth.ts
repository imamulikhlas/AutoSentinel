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

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("auto-sentinel-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("auto-sentinel-user")
      }
    }
  }, [])

  const login = (credentials: { email: string; password: string }) => {
    // Dummy login - in real app, this would call an API
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
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auto-sentinel-user")

    // Clear any other session data if needed
    sessionStorage.clear()

    // Optional: Show logout success message
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

  return { user, login, logout, regenerateApiKey }
}
