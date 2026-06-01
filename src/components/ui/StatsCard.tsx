"use client"

import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  color?: string
}

export default function StatsCard({ title, value, icon, description, color }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: color ? `${color}20` : undefined, color: color || "#2563eb" }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
