"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import Toast from "./Toast"

interface ToastContextType {
  show: (message: string, type?: "success" | "error" | "info") => void
}

const ToastContext = createContext<ToastContextType>({ show: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

interface ToastItem {
  id: number
  message: string
  type: "success" | "error" | "info"
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </ToastContext.Provider>
  )
}
