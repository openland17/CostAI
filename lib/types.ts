export const COST_CATEGORIES = [
  "Preliminaries",
  "Site Works",
  "Concrete & Structure",
  "Brickwork & Masonry",
  "Roofing",
  "Waterproofing",
  "Tiling & Flooring",
  "Plastering & Painting",
  "Joinery & Cabinetry",
  "Plumbing",
  "Electrical",
  "HVAC / Mechanical",
  "External Works",
  "Finishes & Fixtures",
  "Contingency & Margins",
] as const;

export type CostCategory = (typeof COST_CATEGORIES)[number];

export type ProjectType = "industrial" | "residential" | "commercial" | "mixed-use";
export type ProjectStatus = "estimating" | "pre-construction" | "in-progress" | "complete";
export type LineItemStatus = "estimated" | "quoted" | "contracted" | "invoiced";
export type LineItemSource = "manual" | "ai-extracted" | "imported";
export type Confidence = "high" | "medium" | "low";

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  totalArea: number;
  estimatedBudget: number;
  status: ProjectStatus;
  createdAt: string;
}

export interface LineItem {
  id: string;
  projectId: string;
  category: CostCategory | string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  supplier: string | null;
  status: LineItemStatus;
  source: LineItemSource;
  notes: string;
}

export interface ExtractedItem {
  description: string;
  category: string;
  unit: string;
  quantity: number | null;
  unitRate: number | null;
  totalCost: number | null;
  supplier: string | null;
  selected?: boolean;
}

export interface ExtractionResult {
  items: ExtractedItem[];
  documentSummary: string;
  confidence: Confidence;
}
