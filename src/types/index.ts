export type StageType = string

export type StatutStage = "En cours" | "Terminé" | "À venir"

export interface Stagiaire {
  id: string
  candidat: string
  filiere: string
  etablissement: string
  numeroTelephone: string
  email: string
  dateDebut: string
  dateFin: string
  typeStage: StageType
}

export interface StagiaireAirtable {
  id: string
  fields: {
    "Condidat": string
    "Filiere": string
    "Etablissement": string
    "Numero Telephone": string
    "Email": string
    "Date de Debut": string
    "Date de Fin": string
    "Type de stage": string
  }
}

export interface Statistiques {
  total: number
  enCours: number
  termines: number
  aVenir: number
  parType: { name: string; value: number; color: string }[]
  parFiliere: { name: string; count: number }[]
  parEtablissement: { name: string; count: number }[]
  prochaineFin: Stagiaire[]
  terminesCeMois: number
}

export interface Filtres {
  typeStage: StageType | ""
  filiere: string
  etablissement: string
  search: string
}

export type ViewMode = "month" | "week" | "day"
