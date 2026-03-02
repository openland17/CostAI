# CostAI — Construction Cost Estimating

AI-powered construction cost scheduling and estimating for Australian property developers. Built for Engage Group (Brisbane).

## Features

- **Dashboard** — Portfolio overview with budget summaries, project cards, and cost breakdown chart
- **Cost Schedule** — Tabbed cost schedule with 15 categories, inline editing, and real-time totals
- **AI Document Extraction** — Upload supplier quotes / BOQs and let Claude AI auto-extract line items
- **Demo Mode** — Try the extraction with a sample Beaumont Tiles supplier quote

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix primitives)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone <repo-url>
cd CostAI
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` as an environment variable
4. Deploy

## Project Structure

```
app/
├── page.tsx                 # Dashboard
├── project/[id]/page.tsx    # Project cost schedule
├── upload/page.tsx          # Document upload + AI extraction
├── api/extract/route.ts     # Claude API extraction endpoint
├── api/parse-pdf/route.ts   # PDF text extraction endpoint
├── layout.tsx               # Root layout with sidebar
└── globals.css              # Theme and global styles

components/
├── layout/Sidebar.tsx       # Navigation sidebar
├── dashboard/               # Dashboard components
├── project/                 # Cost schedule components
├── upload/                  # Upload + extraction components
└── ui/                      # shadcn/ui primitives

lib/
├── types.ts                 # TypeScript interfaces
├── utils.ts                 # Formatting + calculation helpers
├── mockData.ts              # Realistic AU construction data
├── store.tsx                # React Context state management
└── extractionPrompt.ts      # Claude system prompt + demo data
```
