import { Stagiaire, StagiaireAirtable } from "@/types"
import { demoStagiaires } from "./demo-data"

const USE_DEMO = process.env.NEXT_PUBLIC_USE_DEMO === "true"
const API_KEY = process.env.AIRTABLE_API_KEY || ""
const BASE_ID = process.env.AIRTABLE_BASE_ID || ""
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || ""

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

  if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    console.warn("Airtable credentials missing, falling back to demo data")
    await new Promise((r) => setTimeout(r, 600))
    return demoStagiaires
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`
    const allRecords: Stagiaire[] = []
    let offset: string | undefined

    do {
      const params = new URLSearchParams()
      if (offset) params.set("offset", offset)

      const res = await fetch(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      })

      if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

      const data = await res.json()
      const records = (data.records || []).map(mapAirtableRecord)
      allRecords.push(...records)
      offset = data.offset
    } while (offset)

    return allRecords
  } catch (err) {
    console.error("Failed to fetch from Airtable:", err)
    throw err
  }
}
