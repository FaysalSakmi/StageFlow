"use client"

import { useState, useEffect, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { ToastProvider } from "@/components/ui/ToastProvider"

const queryClient = new QueryClient()

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("darkMode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = stored ? stored === "true" : prefersDark
    setDarkMode(isDark)
    if (isDark) document.documentElement.classList.add("dark")
  }, [])

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem("darkMode", String(next))
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              darkMode={darkMode}
              onToggleDark={toggleDark}
            />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  )
}
