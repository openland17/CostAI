"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineItemStatus } from "@/lib/types";
import { formatCurrencyExact } from "@/lib/utils";
import { useProject } from "@/lib/store";

interface AddLineItemProps {
  projectId: string;
  category: string;
  onClose: () => void;
}

export default function AddLineItem({
  projectId,
  category,
  onClose,
}: AddLineItemProps) {
  const { addLineItem } = useProject();
  const [form, setForm] = useState({
    description: "",
    unit: "m²",
    quantity: 0,
    unitRate: 0,
    supplier: "",
    status: "estimated" as LineItemStatus,
  });

  const total = form.quantity * form.unitRate;

  const handleSave = () => {
    if (!form.description) return;
    addLineItem({
      projectId,
      category,
      description: form.description,
      unit: form.unit,
      quantity: form.quantity,
      unitRate: form.unitRate,
      totalCost: total,
      supplier: form.supplier || null,
      status: form.status,
      source: "manual",
      notes: "",
    });
    onClose();
  };

  return (
    <TableRow className="bg-primary/5 border-primary/20">
      <TableCell>
        <Input
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Description"
          className="h-8 text-sm"
          autoFocus
        />
      </TableCell>
      <TableCell>
        <Select value={form.unit} onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["m²", "m³", "lm", "ea", "lot", "hr", "t", "kg", "point", "kW"].map(
              (u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={form.quantity || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))
          }
          placeholder="0"
          className="h-8 w-24 text-right font-tabular text-sm"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={form.unitRate || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, unitRate: parseFloat(e.target.value) || 0 }))
          }
          placeholder="0.00"
          className="h-8 w-28 text-right font-tabular text-sm"
        />
      </TableCell>
      <TableCell className="text-right font-tabular text-sm">
        {formatCurrencyExact(total)}
      </TableCell>
      <TableCell>
        <Input
          value={form.supplier}
          onChange={(e) =>
            setForm((f) => ({ ...f, supplier: e.target.value }))
          }
          placeholder="Supplier"
          className="h-8 text-sm"
        />
      </TableCell>
      <TableCell>
        <Select
          value={form.status}
          onValueChange={(v) =>
            setForm((f) => ({ ...f, status: v as LineItemStatus }))
          }
        >
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estimated">Estimated</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="contracted">Contracted</SelectItem>
            <SelectItem value="invoiced">Invoiced</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={handleSave}
            disabled={!form.description}
          >
            <Plus className="h-3 w-3" /> Add
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
