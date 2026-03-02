export const EXTRACTION_SYSTEM_PROMPT = `You are a construction cost data extraction assistant for Australian property developers.

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
Use Australian construction terminology and AUD pricing.`;

export const DEMO_SUPPLIER_QUOTE = `QUOTE #Q-2024-0847
Beaumont Tiles — Commercial Division
Date: 15 January 2026
Project: M-Space Brendale Stage 2 — Industrial Units
To: Engage Group Pty Ltd

Description of Works: Supply and delivery of tiles and flooring materials for 12 industrial warehouse/office units.

ITEM SCHEDULE:

1. Warehouse Floor Tiles — 600x600 Porcelain (Anti-slip R11)
   Area: 2,400 m²
   Rate: $82.00 / m²
   Subtotal: $196,800.00

2. Office Floor Tiles — 600x600 Polished Porcelain
   Area: 640 m²
   Rate: $95.00 / m²
   Subtotal: $60,800.00

3. Amenities Wall Tiles — 300x600 Ceramic Gloss White
   Area: 380 m²
   Rate: $65.00 / m²
   Subtotal: $24,700.00

4. Amenities Floor Tiles — 300x300 Non-slip Ceramic
   Area: 190 m²
   Rate: $72.00 / m²
   Subtotal: $13,680.00

5. Tile Adhesive — Dunlop Multipurpose (20kg bags)
   Quantity: 180 bags
   Rate: $38.00 / bag
   Subtotal: $6,840.00

6. Tile Grout — Davco Sanitized Colour Grout (15kg)
   Quantity: 95 bags
   Rate: $42.00 / bag
   Subtotal: $3,990.00

7. Waterproof Membrane — Davco K10 Plus (under tiles)
   Area: 190 m²
   Rate: $28.00 / m²
   Subtotal: $5,320.00

8. Expansion Joints & Trims — Aluminium L-profile
   Length: 320 lm
   Rate: $18.50 / lm
   Subtotal: $5,920.00

DELIVERY: Free delivery to site within Brisbane Metro.
VALIDITY: This quote is valid for 30 days.
PAYMENT TERMS: 30 days from invoice.

Subtotal (ex GST): $318,050.00
GST (10%): $31,805.00
TOTAL (inc GST): $349,855.00

Prepared by: Sarah Mitchell, Commercial Sales Manager
Beaumont Tiles — 127 Kremzow Rd, Brendale QLD 4500
Ph: (07) 3205 4600 | sarah.mitchell@beaumonttiles.com.au`;
