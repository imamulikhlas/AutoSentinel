import { CheckCircle, XCircle, Info } from "lucide-react"
import type { ToastMessage } from "@/types"

interface ToastNotificationProps {
  toastMessage: ToastMessage | null
}

export const ToastNotification = ({ toastMessage }: ToastNotificationProps) => {
  if (!toastMessage) return null

  const bgColor =
    toastMessage.type === "success"
      ? "bg-emerald-500/20 border-emerald-500/30"
      : toastMessage.type === "error"
        ? "bg-red-500/20 border-red-500/30"
        : "bg-blue-500/20 border-blue-500/30"

  const textColor =
    toastMessage.type === "success"
      ? "text-emerald-300"
      : toastMessage.type === "error"
        ? "text-red-300"
        : "text-blue-300"

  return (
    <div className="fixed top-20 sm:top-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-[60] animate-slide-down">
      <div
        className={`${bgColor} ${textColor} px-4 sm:px-6 py-3 sm:py-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center space-x-3 max-w-sm sm:max-w-md mx-auto`}
      >
        {toastMessage.type === "success" && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
        {toastMessage.type === "error" && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
        {toastMessage.type === "info" && <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
        <span className="font-medium text-sm sm:text-base">{toastMessage.message}</span>
      </div>
    </div>
  )
}
