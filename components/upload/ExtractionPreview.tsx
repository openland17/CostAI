"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ExtractionResult, ExtractedItem } from "@/lib/types";
import { formatCurrencyExact } from "@/lib/utils";

interface ExtractionPreviewProps {
  result: ExtractionResult;
  onConfirm: (items: ExtractedItem[]) => void;
  onDiscard: () => void;
}

export default function ExtractionPreview({
  result,
  onConfirm,
  onDiscard,
}: ExtractionPreviewProps) {
  const [items, setItems] = useState<(ExtractedItem & { selected: boolean })[]>(
    result.items.map((item) => ({ ...item, selected: true }))
  );

  const selectedCount = items.filter((i) => i.selected).length;

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateItem = (
    index: number,
    field: keyof ExtractedItem,
    value: string | number | null
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleConfirm = () => {
    onConfirm(items.filter((i) => i.selected));
  };

  const confidenceColor = {
    high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div
      className="space-y-4"
      style={{ animation: "fade-in 0.4s ease-out both" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Extraction Results
            </h3>
            <p className="text-xs text-muted-foreground">
              {result.documentSummary}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-[11px] ${confidenceColor[result.confidence]}`}
        >
          {result.confidence} confidence
        </Badge>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-16">Unit</TableHead>
              <TableHead className="w-20 text-right">Qty</TableHead>
              <TableHead className="w-28 text-right">Rate</TableHead>
              <TableHead className="w-28 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, i) => (
              <TableRow
                key={i}
                className={!item.selected ? "opacity-40" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={item.selected}
                    onCheckedChange={() => toggleItem(i)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(i, "description", e.target.value)
                    }
                    className="h-7 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
                  />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.category}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.unit}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.quantity ?? ""}
                    onChange={(e) =>
                      updateItem(
                        i,
                        "quantity",
                        parseFloat(e.target.value) || null
                      )
                    }
                    className="h-7 w-full border-0 bg-transparent px-0 text-right font-tabular text-sm focus-visible:ring-0"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.unitRate ?? ""}
                    onChange={(e) =>
                      updateItem(
                        i,
                        "unitRate",
                        parseFloat(e.target.value) || null
                      )
                    }
                    className="h-7 w-full border-0 bg-transparent px-0 text-right font-tabular text-sm focus-visible:ring-0"
                  />
                </TableCell>
                <TableCell className="text-right font-tabular text-sm font-medium">
                  {item.totalCost != null
                    ? formatCurrencyExact(item.totalCost)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {items.length} items extracted, {selectedCount} selected
        </p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onDiscard}>
            Discard
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleConfirm}
            disabled={selectedCount === 0}
          >
            <Check className="h-3.5 w-3.5" />
            Add {selectedCount} Items to Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
