"use client";

import { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineItem, LineItemStatus } from "@/lib/types";
import { formatCurrencyExact, getStatusColor } from "@/lib/utils";
import { useProject } from "@/lib/store";

interface LineItemRowProps {
  item: LineItem;
}

export default function LineItemRow({ item }: LineItemRowProps) {
  const { updateLineItem, deleteLineItem } = useProject();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    description: item.description,
    unit: item.unit,
    quantity: item.quantity,
    unitRate: item.unitRate,
    supplier: item.supplier || "",
    status: item.status,
  });

  const handleSave = () => {
    updateLineItem(item.id, {
      ...form,
      supplier: form.supplier || null,
      totalCost: form.quantity * form.unitRate,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitRate: item.unitRate,
      supplier: item.supplier || "",
      status: item.status,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <TableRow className="bg-secondary/20">
        <TableCell>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="h-8 text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            className="h-8 w-16 text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm((f) => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))
            }
            className="h-8 w-24 text-right font-tabular text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={form.unitRate}
            onChange={(e) =>
              setForm((f) => ({ ...f, unitRate: parseFloat(e.target.value) || 0 }))
            }
            className="h-8 w-28 text-right font-tabular text-sm"
          />
        </TableCell>
        <TableCell className="text-right font-tabular text-sm">
          {formatCurrencyExact(form.quantity * form.unitRate)}
        </TableCell>
        <TableCell>
          <Input
            value={form.supplier}
            onChange={(e) =>
              setForm((f) => ({ ...f, supplier: e.target.value }))
            }
            className="h-8 text-sm"
            placeholder="—"
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
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="group cursor-pointer" onClick={() => setEditing(true)}>
      <TableCell className="max-w-[240px]">
        <span className="text-sm text-foreground">{item.description}</span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{item.unit}</TableCell>
      <TableCell className="text-right font-tabular text-sm text-foreground">
        {item.quantity.toLocaleString("en-AU")}
      </TableCell>
      <TableCell className="text-right font-tabular text-sm text-foreground">
        {formatCurrencyExact(item.unitRate)}
      </TableCell>
      <TableCell className="text-right font-tabular text-sm font-medium text-foreground">
        {formatCurrencyExact(item.totalCost)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {item.supplier || "—"}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-[11px] capitalize ${getStatusColor(item.status)}`}
        >
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              deleteLineItem(item.id);
            }}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-400" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
