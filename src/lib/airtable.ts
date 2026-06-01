import { Stagiaire, StagiaireAirtable } from "@/types"
import { demoStagiaires } from "./demo-data"

const USE_DEMO = process.env.NEXT_PUBLIC_USE_DEMO === "true"

function normalizeTypeStage(type: string): Stagiaire["typeStage"] {
  const t = type.replace(/\\u0027/g, "'").replace(/\\u00e9/g, "é").replace(/\\u00e0/g, "à")
  if (t.includes("PFA") || t.includes("Projet de Fin d'Année")) return "PFA"
  if (t.includes("PFE") || t.includes("Stage de fin d'études")) return "PFE"
  return "Stage d'application"
}

function mapAirtableRecord(record: StagiaireAirtable): Stagiaire {
  return {
    id: record.id,
    candidat: record.fields["Condidat"] || "",
    filiere: record.fields["Filiere"] || "",
    etablissement: record.fields["Etablissement"] || "",
    numeroTelephone: record.fields["Numero Telephone"] || "",
    email: record.fields["Email"] || "",
    dateDebut: record.fields["Date de Debut"] || "",
    dateFin: record.fields["Date de Fin"] || "",
    typeStage: normalizeTypeStage(record.fields["Type de stage"] || ""),
  }
}

export async function fetchStagiaires(): Promise<Stagiaire[]> {
  if (USE_DEMO) {
    await new Promise((r) => setTimeout(r, 600))
    return demoStagiaires
  }

  try {
    const res = await fetch("/api/stagiaires", {
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const records: StagiaireAirtable[] = await res.json()
    return records.map(mapAirtableRecord)
  } catch (err) {
    console.error("Failed to fetch stagiaires:", err)
    throw err
  }
}
