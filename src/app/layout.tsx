import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppShell from "@/components/AppShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StageFlow - Gestion des stagiaires",
  description: "Tableau de bord interactif pour gérer et visualiser les stagiaires",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
