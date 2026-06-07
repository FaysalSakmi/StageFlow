"use client"

import { useMemo, useState, useEffect } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Stagiaire, StageType } from "@/types"
import { parseDate, getStatut, getTypeColor } from "@/lib/utils"
import { Skeleton } from "@/components/ui/Skeleton"

moment.locale("fr")
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Stagiaire
  type: StageType
}


interface CalendarViewProps {
  stagiaires: Stagiaire[]
}

export default function CalendarView({ stagiaires }: CalendarViewProps) {
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [date, setDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const events: CalendarEvent[] = useMemo(() => {
    if (!stagiaires) return []
    return stagiaires
      .filter((s) => {
        const statut = getStatut(s)
        return statut !== "Terminé"
      })
      .map((s) => ({
        id: s.id,
        title: `${s.candidat} - ${s.typeStage}`,
        start: parseDate(s.dateDebut),
        end: parseDate(s.dateFin),
        resource: s,
        type: s.typeStage,
      }))
  }, [stagiaires])

  const eventPropGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: getTypeColor(event.type),
      borderRadius: "6px",
      border: "none",
      fontSize: "12px",
    },
  })

const legendTypes = useMemo(
  () => Array.from(new Set(stagiaires?.map((s) => s.typeStage))),
  [stagiaires]
)

  if (!mounted) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />
  }

  return (
    <div className="space-y-6">
{/* Legend */}
       <div className="flex items-center gap-6">
         {legendTypes.map((type) => (
           <div key={type} className="flex items-center gap-2">
             <div
               className="h-3 w-3 rounded-full"
               style={{ backgroundColor: getTypeColor(type) }}
             />
             <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span>
           </div>
         ))}
       </div>

      {/* Calendar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          date={date}
          onView={(v) => setView(v as "month" | "week" | "day")}
          onNavigate={(d) => setDate(d)}
          eventPropGetter={eventPropGetter}
          onSelectEvent={(event: CalendarEvent) => setSelectedEvent(event)}
          popup
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
          }}
          culture="fr"
        />
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedEvent.resource.candidat}
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Fermer
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-sm font-medium">{selectedEvent.resource.typeStage}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Filière</p>
              <p className="text-sm font-medium">{selectedEvent.resource.filiere}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Établissement</p>
              <p className="text-sm font-medium">{selectedEvent.resource.etablissement}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Début</p>
              <p className="text-sm font-medium">
                {selectedEvent.start.toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fin</p>
              <p className="text-sm font-medium">
                {selectedEvent.end.toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-primary-600">
                {selectedEvent.resource.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
