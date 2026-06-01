"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, Download, Search, Eye, SlidersHorizontal } from "lucide-react"
import { useStagiaires } from "@/hooks/useStagiaires"
import { Stagiaire, Filtres, StageType } from "@/types"
import { filtrerStagiaires, trierStagiaires, formatDate, getStatut, exporterCSV } from "@/lib/utils"
import { filieres, etablissements } from "@/lib/demo-data"
import StageBadge from "@/components/ui/StageBadge"
import StatutIndicator from "@/components/ui/StatutIndicator"
import { TableSkeleton } from "@/components/ui/Skeleton"
import Modal from "@/components/ui/Modal"

const PAGE_SIZE = 10

export default function StagiairesPage() {
  const { data: stagiaires, isLoading, error } = useStagiaires()
  const [filtres, setFiltres] = useState<Filtres>({
    typeStage: "",
    filiere: "",
    etablissement: "",
    search: "",
  })
  const [sortKey, setSortKey] = useState<keyof Stagiaire>("candidat")
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(0)
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const handleSort = (key: keyof Stagiaire) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const filtered = useMemo(() => {
    if (!stagiaires) return []
    const f = filtrerStagiaires(stagiaires, filtres)
    return trierStagiaires(f, sortKey, sortAsc)
  }, [stagiaires, filtres, sortKey, sortAsc])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const SortIcon = ({ colKey }: { colKey: keyof Stagiaire }) => {
    if (sortKey !== colKey) return null
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  type FiltreKey = "typeStage" | "filiere" | "etablissement"

  const updateFilter = (key: FiltreKey, value: string) => {
    setFiltres((prev) => ({ ...prev, [key]: value }))
    setPage(0)
  }

  const FilterSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (v: string) => void
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )

  const stageTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "Tous les types" },
    { value: "PFE", label: "PFE" },
    { value: "PFA", label: "PFA" },
    { value: "Stage d'application", label: "Stage d'application" },
  ]

  const filiereOptions = [
    { value: "", label: "Toutes les filières" },
    ...filieres.map((f) => ({ value: f, label: f })),
  ]

  const etabOptions = [
    { value: "", label: "Tous les établissements" },
    ...etablissements.map((e) => ({ value: e, label: e })),
  ]

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stagiaires</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} stagiaire(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <SlidersHorizontal size={16} />
            Filtres
          </button>
          <button
            onClick={() => stagiaires && exporterCSV(stagiaires)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filtres.search}
            onChange={(e) => {
              setFiltres((prev) => ({ ...prev, search: e.target.value }))
              setPage(0)
            }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
        <FilterSelect
          label="Type"
          value={filtres.typeStage}
          options={stageTypeOptions}
          onChange={(v) => updateFilter("typeStage", v)}
        />
        <FilterSelect
          label="Filière"
          value={filtres.filiere}
          options={filiereOptions}
          onChange={(v) => updateFilter("filiere", v)}
        />
        <FilterSelect
          label="Établissement"
          value={filtres.etablissement}
          options={etabOptions}
          onChange={(v) => updateFilter("etablissement", v)}
        />
      </div>

      {/* Mobile Filter Modal */}
      <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} title="Filtres">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher..."
              value={filtres.search}
              onChange={(e) => setFiltres((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Type de stage</label>
            <select
              value={filtres.typeStage}
              onChange={(e) => updateFilter("typeStage", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              {stageTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Filière</label>
            <select
              value={filtres.filiere}
              onChange={(e) => updateFilter("filiere", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              {filiereOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Établissement</label>
            <select
              value={filtres.etablissement}
              onChange={(e) => updateFilter("etablissement", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              {etabOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr>
                  {[
                    { key: "candidat", label: "Candidat" },
                    { key: "filiere", label: "Filière" },
                    { key: "etablissement", label: "Établissement" },
                    { key: "email", label: "Email" },
                    { key: "dateDebut", label: "Début" },
                    { key: "dateFin", label: "Fin" },
                    { key: "typeStage", label: "Type" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as keyof Stagiaire)}
                      className="cursor-pointer px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon colKey={col.key as keyof Stagiaire} />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paginated.map((s) => (
                  <tr
                    key={s.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {s.candidat}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.filiere}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {s.etablissement}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      <a
                        href={`mailto:${s.email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {s.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(s.dateDebut)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(s.dateFin)}
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge type={s.typeStage} />
                    </td>
                    <td className="px-4 py-3">
                      <StatutIndicator statut={getStatut(s)} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/stagiaires/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        <Eye size={14} />
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                      Aucun stagiaire trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {page + 1} sur {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium ${
                      i === page
                        ? "bg-primary-600 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
