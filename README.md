# StageFlow - Gestion des stagiaires

Application web moderne pour gérer et visualiser une base de données de stagiaires/candidats, connectée à Airtable.

## Fonctionnalités

- **Tableau de bord** : Cartes de statistiques, graphiques (répartition par type, par filière), liste des stages à venir
- **Liste des stagiaires** : Tableau interactif avec filtres, recherche, tri, pagination et export CSV
- **Détail d'un stagiaire** : Carte profil, progression visuelle, historique des stages
- **Calendrier** : Vue mensuelle/hebdomadaire avec coloration par type de stage
- **Statistiques** : Graphiques avancés (répartition, évolution, occupation)
- **Mode sombre/clair**
- **Responsive** : Desktop, tablette, mobile

## Technologies

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) (graphiques)
- [react-big-calendar](https://github.com/jquense/react-big-calendar) (calendrier)
- [TanStack Query](https://tanstack.com/query) (fetching/cache)
- [Lucide React](https://lucide.dev/) (icônes)

## Installation

```bash
# Cloner le dépôt
git clone <votre-repo>
cd stagiaires-dashboard

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local
```

## Configuration Airtable

Éditez le fichier `.env.local` :

```env
AIRTABLE_API_KEY=votre_clé_api
AIRTABLE_BASE_ID=votre_base_id
AIRTABLE_TABLE_NAME=nom_de_la_table
NEXT_PUBLIC_USE_DEMO=true
```

Mettez `NEXT_PUBLIC_USE_DEMO=true` pour utiliser les données de démonstration (aucune connexion Airtable nécessaire).

## Démarrage

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Déploiement sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connectez votre dépôt GitHub
2. Ajoutez les variables d'environnement dans les paramètres du projet
3. Déployez

## Structure des données Airtable

| Champ | Type |
|-------|------|
| Candidat | Texte |
| Filière | Texte |
| Etablissement | Texte |
| Numero Telephone | Texte |
| Email | Texte |
| Date de Début | Date (YYYY-MM-DD) |
| Date de Fin | Date (YYYY-MM-DD) |
| Type de stage | Texte (PFE, PFA, Stage d'application) |
