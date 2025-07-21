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

  // Function untuk generate API
  const generateApiKey = () => {
    // Menggunakan format AUTOSENTINEL dengan timestamp dan random segments
    const version = 'V1';
    const timestamp = Date.now().toString().slice(-8);
    const randomAlpha = Math.random().toString(36).substr(2, 10).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const randomAlpha2 = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    return `AUTOSENTINEL_${version}_${timestamp}_${randomAlpha}_${randomNum}_${randomAlpha2}`;
  }

  useEffect(() => {
    const checkSession = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
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
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const dummyUser: User = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.email.split("@")[0],
      plan: "pro",
      apiKey: generateApiKey(), // Pakai function baru
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
    await new Promise((resolve) => setTimeout(resolve, 300))
    setUser(null)
    localStorage.removeItem("auto-sentinel-user")
    sessionStorage.clear()
    setIsLoading(false)
    
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
        apiKey: generateApiKey(), // Pakai function baru juga
      }
      setUser(updatedUser)
      localStorage.setItem("auto-sentinel-user", JSON.stringify(updatedUser))
      
      // Opsional: Kasih notifikasi kalau API key berhasil di-regenerate
      const event = new CustomEvent("show-toast", {
        detail: {
          type: "success",
          message: "API key successfully regenerated",
        },
      })
      window.dispatchEvent(event)
    }
  }

  return { user, login, logout, regenerateApiKey, isLoading }
}