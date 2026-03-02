"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineItem } from "@/lib/types";
import { formatCurrencyExact, getCategoryTotal } from "@/lib/utils";
import LineItemRow from "./LineItemRow";
import AddLineItem from "./AddLineItem";

interface CategoryTabProps {
  category: string;
  items: LineItem[];
  projectId: string;
}

export default function CategoryTab({
  category,
  items,
  projectId,
}: CategoryTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const categoryItems = items.filter((i) => i.category === category);
  const subtotal = getCategoryTotal(items, category);

  if (categoryItems.length === 0 && !showAdd) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-16"
        style={{ animation: "fade-in 0.3s ease-out both" }}
      >
        <Package className="mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          No line items in {category}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Add your first line item to get started
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-4 gap-1.5"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Line Item
        </Button>
      </div>
    );
  }

  return (
    <div style={{ animation: "fade-in 0.3s ease-out both" }}>
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="w-[240px]">Description</TableHead>
            <TableHead className="w-[60px]">Unit</TableHead>
            <TableHead className="w-[90px] text-right">Qty</TableHead>
            <TableHead className="w-[110px] text-right">Rate ($/unit)</TableHead>
            <TableHead className="w-[120px] text-right">Total</TableHead>
            <TableHead className="w-[140px]">Supplier</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryItems.map((item) => (
            <LineItemRow key={item.id} item={item} />
          ))}
          {showAdd && (
            <AddLineItem
              projectId={projectId}
              category={category}
              onClose={() => setShowAdd(false)}
            />
          )}
        </TableBody>
        {categoryItems.length > 0 && (
          <TableFooter>
            <TableRow className="border-t border-primary/20 bg-primary/5 hover:bg-primary/5">
              <TableCell colSpan={4} className="text-right text-sm font-semibold text-primary">
                {category} Subtotal
              </TableCell>
              <TableCell className="text-right font-tabular text-sm font-bold text-primary">
                {formatCurrencyExact(subtotal)}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {!showAdd && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="h-3 w-3" />
            Add Line Item
          </Button>
        </div>
      )}
    </div>
  );
}
