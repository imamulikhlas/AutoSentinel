"use client"

import { useState } from "react"
import type { ToastMessage } from "@/types"

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToastMessage({ type, message })
    setTimeout(() => setToastMessage(null), 4000)
  }

  return { toastMessage, showToast }
}
