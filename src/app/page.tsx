"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Users, Clock, CheckCircle2, Calendar, ArrowRight } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { useStagiaires } from "@/hooks/useStagiaires"
import { Stagiaire, Statistiques } from "@/types"
import {
  getStatut,
  parseDate,
  formatDate,
  getTypeColor,
  dureeStage,
} from "@/lib/utils"
import StatsCard from "@/components/ui/StatsCard"
import StageBadge from "@/components/ui/StageBadge"
import StatutIndicator from "@/components/ui/StatutIndicator"
import { CardSkeleton } from "@/components/ui/Skeleton"

export default function DashboardPage() {
  const { data: stagiaires, isLoading, error } = useStagiaires()

  const stats = useMemo<Statistiques | null>(() => {
    if (!stagiaires) return null
    const now = new Date()
    const enCours = stagiaires.filter((s) => getStatut(s) === "En cours")
    const termines = stagiaires.filter((s) => getStatut(s) === "Terminé")
    const aVenir = stagiaires.filter((s) => getStatut(s) === "À venir")

    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
    const terminesCeMois = termines.filter((s) => {
      const fin = parseDate(s.dateFin)
      return fin >= debutMois && fin <= now
    }).length

    const typeCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      typeCount[s.typeStage] = (typeCount[s.typeStage] || 0) + 1
    })
    const typeColors: Record<string, string> = {
      PFE: "#2563eb",
      PFA: "#16a34a",
      "Stage d'application": "#d97706",
    }
    const parType = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
      color: typeColors[name] || "#6b7280",
    }))

    const filiereCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      filiereCount[s.filiere] = (filiereCount[s.filiere] || 0) + 1
    })
    const parFiliere = Object.entries(filiereCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const etabCount: Record<string, number> = {}
    stagiaires.forEach((s) => {
      etabCount[s.etablissement] = (etabCount[s.etablissement] || 0) + 1
    })
    const parEtablissement = Object.entries(etabCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const prochaineFin = [...stagiaires]
      .filter((s) => getStatut(s) !== "Terminé")
      .sort((a, b) => parseDate(a.dateFin).getTime() - parseDate(b.dateFin).getTime())
      .slice(0, 5)

    return {
      total: stagiaires.length,
      enCours: enCours.length,
      termines: termines.length,
      aVenir: aVenir.length,
      parType,
      parFiliere,
      parEtablissement,
      prochaineFin,
      terminesCeMois,
    }
  }, [stagiaires])

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Erreur de chargement des données</p>
          <p className="mt-1 text-sm text-gray-500">Veuillez réessayer plus tard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Aperçu général des stages
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total stagiaires"
              value={stats.total}
              icon={<Users size={20} />}
              color="#2563eb"
            />
            <StatsCard
              title="Stages en cours"
              value={stats.enCours}
              icon={<Clock size={20} />}
              color="#16a34a"
            />
            <StatsCard
              title="Stages terminés"
              value={stats.termines}
              icon={<CheckCircle2 size={20} />}
              color="#6b7280"
              description={`${stats.terminesCeMois} terminé(s) ce mois`}
            />
            <StatsCard
              title="À venir"
              value={stats.aVenir}
              icon={<Calendar size={20} />}
              color="#d97706"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      ) : stats ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart - Type */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Répartition par type de stage
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.parType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.parType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Filière */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Répartition par filière
            </h3>
            <ResponsiveContainer width="100%" height={280}>
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
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      {/* Prochaines fins */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Prochains stages à se terminer
          </h3>
          <Link
            href="/stagiaires"
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-2">
            {stats.prochaineFin.map((s) => {
              const fin = parseDate(s.dateFin)
              const diff = Math.ceil((fin.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              const urgent = diff >= 0 && diff <= 7
              return (
                <Link
                  key={s.id}
                  href={`/stagiaires/${s.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:border-primary-100 hover:bg-primary-50/30 dark:border-gray-700 dark:hover:border-primary-900 dark:hover:bg-primary-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      {s.candidat.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {s.candidat}
                      </p>
                      <div className="flex items-center gap-2">
                        <StageBadge type={s.typeStage} />
                        <span className="text-xs text-gray-400">{s.filiere}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fin: {formatDate(s.dateFin)}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      {dureeStage(s.dateDebut, s.dateFin)}
                    </p>
                    {urgent && (
                      <span className="text-xs font-semibold text-red-500">
                        {diff === 0 ? "Aujourd'hui" : `${diff} jours`}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
