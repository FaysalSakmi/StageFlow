"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = "info", onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bgMap = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-primary-600",
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg transition-all duration-300 ${
        bgMap[type]
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        <X size={16} />
      </button>
    </div>
  )
}
