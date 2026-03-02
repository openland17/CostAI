# CostAI — Construction Cost Estimating MVP
## For Engage Group (Ben Grootemaat) | Built by Zephyr Systems

---

## 1. WHAT WE'RE BUILDING

**CostAI** is an AI-powered construction cost scheduling and estimating app that replaces the manual Excel workflow currently used by property developers and builders.

**The Problem:**
Staff at Engage Group are manually entering data across multiple Excel tabs — square metres of tiles, costs of materials, labour rates, supplier quotes, quantities for every trade category. This is slow, error-prone, and doesn't scale across their portfolio of projects (M-Space industrial, PARC Bulimba luxury residential, Vicinity Robina, etc).

**The Solution:**
A web app where users upload documents (supplier quotes, BOQs, plans) and AI automatically extracts costs, quantities, and line items into a structured cost schedule — eliminating hours of manual data entry.

**MVP Scope (tonight's build):**
- Beautiful, polished UI (dark theme, construction/industrial aesthetic)
- Document upload → AI extraction of cost data
- Structured cost schedule dashboard with categories/tabs
- Mock data pre-populated to demonstrate the full workflow
- Working AI extraction using Claude API (real functionality, not just UI)
- Deploy to Vercel

---

## 2. PRODUCT ARCHITECTURE

### Core Pages/Views

1. **Dashboard** — Overview of all projects with total budget, cost breakdown summary, and status
2. **Project View** — Single project with tabbed cost schedule (like Excel tabs but better)
3. **Document Upload** — Drag & drop PDFs/images, AI processes and extracts line items
4. **Extraction Review** — AI-extracted data shown for user to confirm/edit before adding to schedule

### Cost Schedule Categories (Excel Tab Equivalents)
These are the typical categories a property developer like Engage would track:

| Category | Example Line Items |
|----------|-------------------|
| **Preliminaries** | Site setup, temporary fencing, scaffolding, project management |
| **Site Works** | Demolition, excavation, earthworks, retaining walls |
| **Concrete & Structure** | Foundations, slabs, structural steel, formwork |
| **Brickwork & Masonry** | External walls, internal walls, block work |
| **Roofing** | Roof framing, roof sheeting, guttering, fascia |
| **Waterproofing** | Membrane, wet area waterproofing, balcony waterproofing |
| **Tiling & Flooring** | Floor tiles (m²), wall tiles (m²), carpet, timber flooring |
| **Plastering & Painting** | Internal plaster, external render, painting |
| **Joinery & Cabinetry** | Kitchen joinery, bathroom vanities, wardrobes |
| **Plumbing** | Rough-in, fixtures, hot water system, drainage |
| **Electrical** | Rough-in, fixtures, switchboard, data/comms |
| **HVAC / Mechanical** | Air conditioning, ventilation, fire services |
| **External Works** | Driveways, landscaping, fencing, retaining walls |
| **Finishes & Fixtures** | Door hardware, tapware, appliances, mirrors |
| **Contingency & Margins** | Builder's margin, contingency %, escalation |

### Data Model (per line item)
```
{
  id: string,
  category: string,           // e.g. "Tiling & Flooring"
  description: string,        // e.g. "Bathroom floor tiles - 600x600 porcelain"
  unit: string,               // e.g. "m²", "lm", "ea", "lot"
  quantity: number,           // e.g. 145.5
  unitRate: number,           // e.g. 85.00
  totalCost: number,          // quantity × unitRate
  supplier: string,           // e.g. "Beaumont Tiles"
  status: string,             // "estimated" | "quoted" | "contracted" | "invoiced"
  source: string,             // "manual" | "ai-extracted" | "imported"
  notes: string,
  createdAt: date,
  updatedAt: date
}
```

### Mock Project Data
Use a realistic Engage Group-style project:

**Project: "M-Space Brendale — Stage 2"**
- Type: Industrial warehouse/office units
- Location: Brendale, Brisbane
- Total Units: 12
- Total Area: 3,200 m²
- Estimated Budget: $4.2M
- Status: Pre-construction / Estimating

Pre-populate ~40-50 realistic line items across all categories with plausible Brisbane 2025/2026 pricing.

---

## 3. TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| AI Extraction | Anthropic Claude API (claude-sonnet-4-20250514) |
| PDF Parsing | pdf-parse (for text extraction before sending to Claude) |
| State Management | React state + Context (keep it simple for MVP) |
| Charts | Recharts |
| Deployment | Vercel |
| Repository | GitHub |

---

## 4. UI/UX DESIGN DIRECTION

### Aesthetic
- **Dark theme** — deep charcoal (#0F1117) with warm accent (#F59E0B amber/gold)
- **Industrial refined** — clean lines, generous spacing, subtle texture
- **Data-dense but readable** — financial data needs to breathe
- Font: "DM Sans" for body, "Space Mono" for numbers/financial data
- Cards with subtle borders, no heavy shadows
- Status indicators: color-coded pills (green=contracted, amber=quoted, gray=estimated)

### Key UI Patterns
- **Sidebar navigation** — Projects list + global nav
- **Tabbed cost schedule** — Each category is a tab (like Excel, but modern)
- **Summary cards** — Total budget, total committed, variance, % complete
- **Upload zone** — Prominent drag-and-drop area with processing animation
- **AI extraction preview** — Side-by-side: original document ↔ extracted data table
- **Real-time totals** — Category subtotals and grand total update as data changes

---

## 5. AI EXTRACTION FEATURE (Core Differentiator)

### How It Works
1. User uploads a PDF/image (supplier quote, BOQ, invoice)
2. App extracts text from PDF using pdf-parse
3. Extracted text is sent to Claude API with a structured prompt
4. Claude returns structured JSON with line items (description, quantity, unit, rate, total)
5. User reviews extracted data in a confirmation UI
6. User confirms → items are added to the cost schedule

### Claude Extraction Prompt (System)
```
You are a construction cost data extraction assistant for Australian property developers.

Extract ALL cost line items from the following document text. For each item, provide:
- description: What the item is
- category: Best matching category from: Preliminaries, Site Works, Concrete & Structure, Brickwork & Masonry, Roofing, Waterproofing, Tiling & Flooring, Plastering & Painting, Joinery & Cabinetry, Plumbing, Electrical, HVAC / Mechanical, External Works, Finishes & Fixtures, Contingency & Margins
- unit: The unit of measurement (m², lm, ea, lot, hr, etc.)
- quantity: The quantity (number only)
- unitRate: The rate per unit in AUD (number only)
- totalCost: Total cost in AUD (number only)
- supplier: Supplier name if mentioned

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "description": "...",
      "category": "...",
      "unit": "...",
      "quantity": 0,
      "unitRate": 0,
      "totalCost": 0,
      "supplier": "..."
    }
  ],
  "documentSummary": "Brief summary of what this document is",
  "confidence": "high" | "medium" | "low"
}

If a value is not present in the document, use null.
Calculate totalCost as quantity × unitRate where possible.
Use Australian construction terminology and AUD pricing.
```

---

## 6. FILE STRUCTURE

```
costai/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Dashboard (project overview)
│   ├── project/
│   │   └── [id]/
│   │       └── page.tsx        # Project detail with cost schedule
│   ├── upload/
│   │   └── page.tsx            # Document upload + AI extraction
│   └── api/
│       └── extract/
│           └── route.ts        # API route for Claude extraction
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── ProjectCard.tsx
│   │   ├── BudgetSummary.tsx
│   │   └── CostBreakdownChart.tsx
│   ├── project/
│   │   ├── CostSchedule.tsx     # Main tabbed schedule component
│   │   ├── CategoryTab.tsx      # Individual category tab content
│   │   ├── LineItemRow.tsx      # Single line item row
│   │   ├── AddLineItem.tsx      # Manual add form
│   │   └── ProjectSummary.tsx   # Top summary cards
│   ├── upload/
│   │   ├── DropZone.tsx         # File upload component
│   │   ├── ExtractionPreview.tsx # AI extraction results
│   │   └── ProcessingIndicator.tsx
│   └── ui/                      # shadcn components
├── lib/
│   ├── mockData.ts              # All mock project/line item data
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Formatting, calculations
│   └── extractionPrompt.ts     # Claude prompt template
├── public/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 7. CURSOR PROMPTS

### PROMPT 1: Plan Mode (Initial Setup + Full MVP)

Copy this ENTIRE prompt into Cursor **Plan Mode**:

---

```
I'm building CostAI — an AI-powered construction cost scheduling and estimating web app for an Australian property developer (Engage Group, Brisbane). This is an MVP to demonstrate the concept.

## Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Anthropic Claude API for AI document extraction
- Recharts for data visualization
- Deploy to Vercel via GitHub

## What To Build

### 1. Dashboard Page (app/page.tsx)
- Shows project cards with name, type, location, total budget, status
- Budget summary cards: Total Portfolio Value, Total Committed, Total Variance
- Donut chart showing cost breakdown by category
- Use mock data for 2-3 projects (primary: "M-Space Brendale — Stage 2", industrial, $4.2M)

### 2. Project Detail Page (app/project/[id]/page.tsx)
- Top summary: project name, total budget, total committed, variance, % complete
- TABBED cost schedule — each tab is a cost category:
  Preliminaries, Site Works, Concrete & Structure, Brickwork & Masonry, Roofing, Waterproofing, Tiling & Flooring, Plastering & Painting, Joinery & Cabinetry, Plumbing, Electrical, HVAC / Mechanical, External Works, Finishes & Fixtures, Contingency & Margins
- Each tab shows a table: Description | Unit | Qty | Rate ($/unit) | Total | Supplier | Status
- Status pills: estimated (gray), quoted (amber), contracted (green), invoiced (blue)
- Category subtotal at bottom of each tab
- "Add Line Item" button that opens an inline form
- Line items are editable inline (click to edit)
- "Upload Document" button that navigates to /upload

### 3. Document Upload Page (app/upload/page.tsx)
- Large drag-and-drop zone for PDF/image upload
- On upload: show processing animation, extract text from PDF
- Send extracted text to /api/extract (Claude API)
- Show extraction results in a review table
- User can edit extracted values, toggle items on/off
- "Add to Cost Schedule" button adds confirmed items to the project
- Project selector dropdown to choose which project to add items to

### 4. API Route (app/api/extract/route.ts)
- POST endpoint that receives document text
- Calls Anthropic Claude API (claude-sonnet-4-20250514) with extraction prompt
- System prompt instructs Claude to extract construction cost line items
- Returns structured JSON with items array
- Handle errors gracefully

### 5. Layout & Navigation
- Dark sidebar with: Logo ("CostAI"), Dashboard link, Projects list, Upload link
- Dark theme throughout: bg #0F1117, card bg #1A1D23, borders #2A2D35
- Accent color: amber/gold #F59E0B
- Font: DM Sans for body text, monospace for numbers
- Clean, data-dense but spacious feel

### 6. Mock Data (lib/mockData.ts)
Create realistic Australian construction data:
- Project: "M-Space Brendale — Stage 2" (Industrial, Brendale Brisbane, 3200m², $4.2M)
- Project: "PARC Bulimba — Residences" (Luxury Residential, Bulimba Brisbane, 2800m², $6.8M)
- Project: "Vicinity Robina — Commercial" (Mixed Use, Robina Gold Coast, 1500m², $2.1M)
- 40-50 line items for the primary project across ALL categories
- Use realistic Brisbane 2025/2026 construction pricing:
  - Concrete supply: $280-320/m³
  - Structural steel: $4,500-6,000/t
  - Floor tiling 600x600: $75-95/m²
  - Electrical rough-in: $85-110/point
  - Plumbing rough-in: $450-600/point
  - Painting internal: $15-22/m²
  - Kitchen joinery: $8,000-15,000/unit
  - Air conditioning: $350-500/kW
  - Scaffolding: $25-35/m²
  - Excavation: $45-65/m³

### 7. TypeScript Types (lib/types.ts)
```typescript
interface Project {
  id: string;
  name: string;
  type: 'industrial' | 'residential' | 'commercial' | 'mixed-use';
  location: string;
  totalArea: number;
  estimatedBudget: number;
  status: 'estimating' | 'pre-construction' | 'in-progress' | 'complete';
  createdAt: string;
}

interface LineItem {
  id: string;
  projectId: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  supplier: string | null;
  status: 'estimated' | 'quoted' | 'contracted' | 'invoiced';
  source: 'manual' | 'ai-extracted' | 'imported';
  notes: string;
}

interface ExtractionResult {
  items: ExtractedItem[];
  documentSummary: string;
  confidence: 'high' | 'medium' | 'low';
}
```

### Design Requirements
- This must look PREMIUM — like a $50k SaaS product, not a hackathon project
- Dark mode only, no light mode
- Use shadcn/ui components (Table, Tabs, Card, Badge, Button, Input, Dialog)
- Subtle animations on page load and tab switches
- Numbers right-aligned, formatted with $ and commas (Australian format)
- Responsive but desktop-first (this is a work tool)
- Empty states with helpful messaging
- Loading states with skeleton animations

### Environment Variables Needed
- ANTHROPIC_API_KEY (for Claude API extraction)

Build the complete MVP. Start with project scaffolding, then layout, then each page, then mock data, then API route. Ensure everything compiles and runs.
```

---

### PROMPT 2: Agent Mode — Polish UI & Animations

```
Review the current CostAI app and enhance the UI polish:

1. Add smooth page transitions and staggered fade-in animations for dashboard cards and table rows
2. Ensure all financial numbers use Australian format: $1,234,567.00 with right-alignment
3. Add a subtle gradient border glow on the active tab in the cost schedule
4. Add hover states on all table rows (subtle highlight)
5. Ensure the donut/pie chart on dashboard uses the amber accent color scheme
6. Add skeleton loading states for the project page and extraction results
7. Make the upload dropzone have a dashed border animation when dragging files over it
8. Add a "powered by AI" subtle badge near the extraction results
9. Ensure mobile responsiveness doesn't break (sidebar collapses to hamburger)
10. Add a professional favicon and page titles
```

---

### PROMPT 3: Agent Mode — Wire Up Claude API Extraction

```
Wire up the AI document extraction feature:

1. In app/api/extract/route.ts:
   - Install @anthropic-ai/sdk
   - Create POST handler that receives { text: string } in the body
   - Call Claude API (claude-sonnet-4-20250514) with this system prompt:

"You are a construction cost data extraction assistant for Australian property developers. Extract ALL cost line items from the following document text. For each item provide: description, category (from: Preliminaries, Site Works, Concrete & Structure, Brickwork & Masonry, Roofing, Waterproofing, Tiling & Flooring, Plastering & Painting, Joinery & Cabinetry, Plumbing, Electrical, HVAC / Mechanical, External Works, Finishes & Fixtures, Contingency & Margins), unit, quantity, unitRate, totalCost, supplier. Return ONLY valid JSON with an items array, documentSummary string, and confidence field (high/medium/low). Use AUD pricing and Australian construction terminology."

   - Parse the response and return JSON
   - Handle errors with proper status codes

2. In the upload page:
   - Install pdf-parse for PDF text extraction
   - On file upload, extract text from PDF client-side (or via a separate API route)
   - Send extracted text to /api/extract
   - Display results in the ExtractionPreview component
   - Allow user to check/uncheck items and edit values before confirming
   - On confirm, add items to the project's line items (in state for MVP)

3. Add a demo mode: if no file is uploaded, have a "Try Demo Extraction" button that sends a sample supplier quote text to the API and shows results. This is critical for the Loom demo.
```

---

### PROMPT 4: Agent Mode — Deploy

```
Prepare CostAI for deployment:

1. Create a .env.example file listing ANTHROPIC_API_KEY
2. Add a .gitignore (node_modules, .next, .env, .env.local)
3. Ensure next.config.js has no issues for Vercel deployment
4. Run a build check (npm run build) and fix any TypeScript errors
5. Create a README.md with:
   - Project name and description
   - Screenshots placeholder
   - Tech stack
   - Setup instructions (clone, npm install, add .env, npm run dev)
   - Deployment instructions for Vercel
6. Initialize git repo, create initial commit
7. Confirm the app builds successfully with no errors
```

---

## 8. LOOM DEMO SCRIPT (2-3 minutes)

Use this script when recording your Loom video for Ben:

**[Screen: Dashboard]**
"Hey Ben — built something I want to show you. This is CostAI, an AI-powered cost scheduling tool I'm developing specifically for Engage Group's workflow."

**[Click into M-Space Brendale project]**
"So instead of managing cost schedules across Excel tabs, everything lives here. You've got your categories — tiling, concrete, electrical — each one is a tab with all your line items, quantities, rates, and totals. Everything auto-calculates."

**[Scroll through a few tabs, show line items]**
"All the data your team currently enters manually — square metres of tiles, costs per unit, supplier details — it's all structured and searchable."

**[Navigate to Upload page]**
"But here's where it gets interesting. Instead of your team manually entering supplier quotes into Excel..."

**[Upload a PDF or click Demo Extraction]**
"...they just upload the document. AI reads the PDF, extracts every line item — quantities, rates, totals — and maps them to the right category automatically."

**[Show extraction results]**
"Your team just reviews, confirms, and it's added to the schedule. What used to take hours of manual entry now takes 30 seconds."

**[Back to Dashboard]**
"This is an early MVP — I'd love to sit down tomorrow and understand exactly how your team works so we can tailor this to Engage's workflow. Keen to chat."

---

## 9. TOMORROW'S DISCOVERY (Questions for Ben)

Bring these to the meeting:

1. Can you walk me through how a cost schedule gets built from scratch at Engage?
2. What documents does your team work from? (supplier quotes, BOQs, architect specs, QS reports?)
3. How many tabs/categories does a typical Engage cost schedule have?
4. What file formats are most common? (PDF, Excel, Word, email?)
5. Who enters the data — project managers, QS, admin staff?
6. What takes the longest — finding the data, entering it, or verifying it?
7. Where do errors typically creep in?
8. Are you using any software beyond Excel? (Xero, Buildxact, Procore?)
9. How many active projects does Engage typically run simultaneously?
10. What would make you say "I need this tool yesterday"?

---

## 10. COMPETITIVE LANDSCAPE (Know This Going In)

| Competitor | Price | Gap CostAI Fills |
|-----------|-------|-------------------|
| Buildxact | $149-399/mo | Generic — not tailored to developer workflow |
| Constructor | Custom pricing | Heavy, enterprise — too complex for mid-market |
| SmarteBuild | $99-299/mo | QUT-backed, good but no AI extraction |
| Excel | Free | Manual, error-prone, no intelligence |
| **CostAI** | **TBD** | **AI-first, extraction-native, built for AU developers** |

**Our differentiator:** None of these competitors let you upload a supplier quote PDF and have AI auto-populate your cost schedule. That's the killer feature.
