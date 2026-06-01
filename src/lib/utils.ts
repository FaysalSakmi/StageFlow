import { Stagiaire, StatutStage, StageType } from "@/types"

export function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function getStatut(stagiaire: Stagiaire): StatutStage {
  const now = new Date()
  const debut = parseDate(stagiaire.dateDebut)
  const fin = parseDate(stagiaire.dateFin)
  if (now < debut) return "À venir"
  if (now > fin) return "Terminé"
  return "En cours"
}

export function getProgression(dateDebut: string, dateFin: string): number {
  const now = new Date()
  const debut = parseDate(dateDebut)
  const fin = parseDate(dateFin)
  if (now <= debut) return 0
  if (now >= fin) return 100
  const total = fin.getTime() - debut.getTime()
  const elapsed = now.getTime() - debut.getTime()
  return Math.round((elapsed / total) * 100)
}

export function dureeStage(dateDebut: string, dateFin: string): string {
  const debut = parseDate(dateDebut)
  const fin = parseDate(dateFin)
  const diffMs = fin.getTime() - debut.getTime()
  const jours = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const mois = Math.floor(jours / 30)
  const rest = jours % 30
  if (mois > 0) return `${mois} mois${rest > 0 ? ` ${rest} jours` : ""}`
  return `${jours} jours`
}

export function getTypeColor(type: StageType): string {
  const map: Record<StageType, string> = {
    "PFE": "#2563eb",
    "PFA": "#16a34a",
    "Stage d'application": "#d97706",
  }
  return map[type] || "#6b7280"
}

export function getTypeBadgeBg(type: StageType): string {
  const map: Record<StageType, string> = {
    "PFE": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "PFA": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Stage d'application": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  }
  return map[type] || "bg-gray-100 text-gray-800"
}

export function getStatutColor(statut: StatutStage): string {
  const map: Record<StatutStage, string> = {
    "En cours": "bg-emerald-500",
    "Terminé": "bg-gray-400",
    "À venir": "bg-amber-500",
  }
  return map[statut]
}

export function filtrerStagiaires(
  stagiaires: Stagiaire[],
  filtres: { typeStage: StageType | ""; filiere: string; etablissement: string; search: string }
): Stagiaire[] {
  return stagiaires.filter((s) => {
    if (filtres.typeStage && s.typeStage !== filtres.typeStage) return false
    if (filtres.filiere && s.filiere !== filtres.filiere) return false
    if (filtres.etablissement && s.etablissement !== filtres.etablissement) return false
    if (filtres.search) {
      const q = filtres.search.toLowerCase()
      if (
        !s.candidat.toLowerCase().includes(q) &&
        !s.email.toLowerCase().includes(q) &&
        !s.filiere.toLowerCase().includes(q) &&
        !s.etablissement.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })
}

export function trierStagiaires(
  stagiaires: Stagiaire[],
  key: keyof Stagiaire,
  asc: boolean
): Stagiaire[] {
  return [...stagiaires].sort((a, b) => {
    const va = (a[key] || "") as string
    const vb = (b[key] || "") as string
    const cmp = va.localeCompare(vb)
    return asc ? cmp : -cmp
  })
}

export function exporterCSV(stagiaires: Stagiaire[]): void {
  const headers = [
    "Candidat", "Filière", "Établissement", "Téléphone", "Email",
    "Date Début", "Date Fin", "Type de stage",
  ]
  const rows = stagiaires.map((s) => [
    s.candidat, s.filiere, s.etablissement, s.numeroTelephone,
    s.email, s.dateDebut, s.dateFin, s.typeStage,
  ])
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "stagiaires.csv"
  a.click()
  URL.revokeObjectURL(url)
}
