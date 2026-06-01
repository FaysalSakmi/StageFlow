"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Building2, Clock } from "lucide-react"
import { useStagiaires } from "@/hooks/useStagiaires"
import {
  formatDate,
  getStatut,
  getProgression,
  dureeStage,
  getStatutColor,
  getTypeColor,
  getTypeBadgeBg,
} from "@/lib/utils"
import StageBadge from "@/components/ui/StageBadge"
import StatutIndicator from "@/components/ui/StatutIndicator"
import ProgressBar from "@/components/ui/ProgressBar"
import { Skeleton } from "@/components/ui/Skeleton"

export default function StagiaireDetailPage() {
  const params = useParams()
  const { data: stagiaires, isLoading, error } = useStagiaires()

  const stagiaire = useMemo(() => {
    if (!stagiaires) return null
    return stagiaires.find((s) => s.id === params.id)
  }, [stagiaires, params.id])

  const historique = useMemo(() => {
    if (!stagiaires || !stagiaire) return []
    return stagiaires
      .filter((s) => s.candidat === stagiaire.candidat && s.id !== stagiaire.id)
      .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut))
  }, [stagiaires, stagiaire])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !stagiaire) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-red-600">Stagiaire introuvable</p>
        <Link
          href="/stagiaires"
          className="mt-2 text-sm text-primary-600 hover:underline"
        >
          Retour à la liste
        </Link>
      </div>
    )
  }

  const statut = getStatut(stagiaire)
  const progression = getProgression(stagiaire.dateDebut, stagiaire.dateFin)
  const color = getTypeColor(stagiaire.typeStage)

  return (
    <div className="space-y-6">
      <Link
        href="/stagiaires"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {stagiaire.candidat.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {stagiaire.candidat}
                  </h1>
                  <div className="mt-1 flex items-center gap-2">
                    <StageBadge type={stagiaire.typeStage} />
                    <StatutIndicator statut={statut} />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Filière</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {stagiaire.filiere}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Établissement</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {stagiaire.etablissement}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <a
                      href={`mailto:${stagiaire.email}`}
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      {stagiaire.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                    <a
                      href={`tel:${stagiaire.numeroTelephone}`}
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      {stagiaire.numeroTelephone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Période de stage
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Début</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatDate(stagiaire.dateDebut)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Fin</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatDate(stagiaire.dateFin)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Durée</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {dureeStage(stagiaire.dateDebut, stagiaire.dateFin)}
              </span>
            </div>
            <div className="pt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Progression</span>
                <span className="text-xs font-medium" style={{ color }}>
                  {progression}%
                </span>
              </div>
              <ProgressBar value={progression} color={color} showLabel={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Historique */}
      {historique.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Historique des stages — {stagiaire.candidat}
          </h3>
          <div className="space-y-3">
            {historique.map((s) => (
              <Link
                key={s.id}
                href={`/stagiaires/${s.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition hover:border-primary-100 hover:bg-primary-50/30 dark:border-gray-700 dark:hover:border-primary-900 dark:hover:bg-primary-900/20"
              >
                <div className="flex items-center gap-3">
                  <StageBadge type={s.typeStage} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {s.etablissement}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(s.dateDebut)} — {formatDate(s.dateFin)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{dureeStage(s.dateDebut, s.dateFin)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Print button */}
      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        >
          Imprimer / PDF
        </button>
      </div>
    </div>
  )
}
