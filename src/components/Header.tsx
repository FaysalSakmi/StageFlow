"use client"

import { useState } from "react"
import { Menu, Moon, Sun, Search, RefreshCw, Bell } from "lucide-react"
import { useRefreshStagiaires } from "@/hooks/useStagiaires"

interface HeaderProps {
  onMenuClick: () => void
  darkMode: boolean
  onToggleDark: () => void
  searchValue?: string
  onSearchChange?: (v: string) => void
}

export default function Header({
  onMenuClick,
  darkMode,
  onToggleDark,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  const refresh = useRefreshStagiaires()
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    await refresh()
    setTimeout(() => setLoading(false), 800)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div className="flex items-center gap-3">
        <button
          className="text-gray-500 hover:text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        {onSearchChange !== undefined && (
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un stagiaire..."
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-72 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Actualiser"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          onClick={onToggleDark}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3 dark:border-gray-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            AD
          </div>
        </div>
      </div>
    </header>
  )
}
