"use client"

import { StatutStage } from "@/types"
import { getStatutColor } from "@/lib/utils"

interface StatutIndicatorProps {
  statut: StatutStage
}

export default function StatutIndicator({ statut }: StatutIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${getStatutColor(statut)}`} />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{statut}</span>
    </div>
  )
}
