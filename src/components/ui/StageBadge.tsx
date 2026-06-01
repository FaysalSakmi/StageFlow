"use client"

import { StageType } from "@/types"
import { getTypeBadgeBg } from "@/lib/utils"

interface StageBadgeProps {
  type: StageType
}

export default function StageBadge({ type }: StageBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getTypeBadgeBg(type)}`}>
      {type}
    </span>
  )
}
