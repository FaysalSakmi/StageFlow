"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { useStagiaires } from "@/hooks/useStagiaires"
import { Stagiaire, Statistiques } from "@/types"
import { parseDate, getStatut } from "@/lib/utils"
import { CardSkeleton } from "@/components/ui/Skeleton"
import { Download } from "lucide-react"
import { exporterCSV } from "@/lib/utils"

const COLORS = [
  "#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#db2777", "#ca8a04", "#4f46e5",
]

export default function StatistiquesPage() {
  const { data: stagiaires, isLoading, error } = useStagiaires()

  const stats = useMemo(() => {
    if (!stagiaires) return null

    // Par établissement
    const etabCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      const key = s.etablissement
      etabCount[key] = (etabCount[key] || 0) + 1
    })
    const parEtablissement = Object.entries(etabCount)
      .map(([name, count]) => ({ name: name.length > 20 ? name.substring(0, 20) + "..." : name, count }))
      .sort((a, b) => b.count - a.count)

    // Par filière
    const filiereCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      filiereCount[s.filiere] = (filiereCount[s.filiere] || 0) + 1
    })
    const parFiliere = Object.entries(filiereCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Évolution mensuelle des débuts
    const moisCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      const d = parseDate(s.dateDebut)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      moisCount[key] = (moisCount[key] || 0) + 1
    })
    const evolution = Object.entries(moisCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => {
        const [y, m] = month.split("-")
        const date = new Date(parseInt(y), parseInt(m) - 1)
        const label = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
        return { month: label, count }
      })

    // Stages actifs dans le temps
    const dates: Date[] = []
    stagiaires.forEach((s) => {
      dates.push(parseDate(s.dateDebut))
      dates.push(parseDate(s.dateFin))
    })
    dates.sort((a, b) => a.getTime() - b.getTime())

    const occupationMap: Record<string, number> = {}
    const debut = dates[0]
    const fin = dates[dates.length - 1]
    if (debut && fin) {
      let cursor = new Date(debut.getFullYear(), debut.getMonth(), 1)
      while (cursor <= fin) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`
        const monthStart = new Date(cursor)
        const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
        let actif = 0
        stagiaires.forEach((s) => {
          const dDebut = parseDate(s.dateDebut)
          const dFin = parseDate(s.dateFin)
          if (dDebut <= monthEnd && dFin >= monthStart) actif++
        })
        occupationMap[key] = actif
        cursor.setMonth(cursor.getMonth() + 1)
      }
    }
    const occupation = Object.entries(occupationMap)
      .map(([month, count]) => {
        const [y, m] = month.split("-")
        const date = new Date(parseInt(y), parseInt(m) - 1)
        const label = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
        return { month: label, count }
      })

    // Par type
    const typeCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      typeCount[s.typeStage] = (typeCount[s.typeStage] || 0) + 1
    })
    const parType = Object.entries(typeCount).map(([name, value]) => ({ name, value }))

    return { parEtablissement, parFiliere, evolution, occupation, parType }
  }, [stagiaires])

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg font-medium text-red-600">Erreur de chargement</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiques</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Analyse détaillée des données
          </p>
        </div>
        <button
          onClick={() => stagiaires && exporterCSV(stagiaires)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Répartition par établissement */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Répartition par établissement
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.parEtablissement} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={150}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par filière */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Répartition par filière
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.parFiliere} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={160}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution mensuelle des débuts */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Évolution mensuelle des débuts de stage
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.evolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupation / Stages actifs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Stages actifs dans le temps
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.occupation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      {/* Tableau récapitulatif */}
      {stats && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tableau récapitulatif
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                    Type de stage
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                    Nombre
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                    Pourcentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.parType.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.value}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {stagiaires
                        ? ((row.value / stagiaires.length) * 100).toFixed(1) + "%"
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
