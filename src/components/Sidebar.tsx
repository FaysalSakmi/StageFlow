"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  GraduationCap,
  X,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/stagiaires", label: "Stagiaires", icon: Users },
  { href: "/calendrier", label: "Calendrier", icon: CalendarDays },
  { href: "/statistiques", label: "Statistiques", icon: BarChart3 },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-600">
            <GraduationCap size={24} />
            <span>StageFlow</span>
          </Link>
          <button className="text-gray-400 hover:text-gray-600 lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">StageFlow v1.0</p>
        </div>
      </aside>
    </>
  )
}
