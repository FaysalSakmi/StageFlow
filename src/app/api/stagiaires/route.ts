import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME

export async function GET() {
  if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    return NextResponse.json(
      { error: "Airtable credentials not configured on server" },
      { status: 500 }
    )
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`
    const allRecords: unknown[] = []
    let offset: string | null = null

    do {
      const params = new URLSearchParams()
      if (offset) params.set("offset", offset)

      const res = await fetch(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        cache: "no-store",
      })

      if (!res.ok) {
        const errBody = await res.text()
        return NextResponse.json(
          { error: `Airtable error ${res.status}: ${errBody}` },
          { status: res.status }
        )
      }

      const data = await res.json()
      allRecords.push(...(data.records || []))
      offset = data.offset ?? null
    } while (offset)

    return NextResponse.json(allRecords, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (err) {
    console.error("Airtable proxy error:", err)
    return NextResponse.json(
      { error: "Failed to fetch from Airtable" },
      { status: 500 }
    )
  }
}
