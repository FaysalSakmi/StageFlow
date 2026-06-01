"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchStagiaires } from "@/lib/airtable"
import { Stagiaire } from "@/types"

export function useStagiaires() {
  return useQuery<Stagiaire[]>({
    queryKey: ["stagiaires"],
    queryFn: fetchStagiaires,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

export function useRefreshStagiaires() {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey: ["stagiaires"] })
}
