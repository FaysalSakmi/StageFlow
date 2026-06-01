"use client"

import dynamic from "next/dynamic"
import { useStagiaires } from "@/hooks/useStagiaires"
import { Skeleton } from "@/components/ui/Skeleton"

const CalendarView = dynamic(() => import("@/components/CalendarView"), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full rounded-xl" />,
})

export default function CalendrierPage() {
  const { data: stagiaires, isLoading } = useStagiaires()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendrier</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visualisation des périodes de stage
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : stagiaires ? (
        <CalendarView stagiaires={stagiaires} />
      ) : null}
    </div>
  )
}
