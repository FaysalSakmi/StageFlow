"use client"

interface ProgressBarProps {
  value: number
  color?: string
  showLabel?: boolean
}

export default function ProgressBar({ value, color = "#2563eb", showLabel = true }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
          {value}%
        </span>
      )}
    </div>
  )
}
