"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LineItem } from "@/lib/types";

const CHART_COLORS = [
  "#F59E0B",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#FBBF24",
  "#FCD34D",
  "#FDE68A",
  "#FEF3C7",
  "#A16207",
];

interface CostBreakdownChartProps {
  lineItems: LineItem[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{payload[0].name}</p>
      <p className="font-tabular text-sm font-semibold text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function CostBreakdownChart({
  lineItems,
}: CostBreakdownChartProps) {
  const categoryTotals = lineItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.totalCost;
      return acc;
    },
    {} as Record<string, number>
  );

  const sorted = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a);

  const top8 = sorted.slice(0, 8);
  const otherTotal = sorted
    .slice(8)
    .reduce((sum, [, val]) => sum + val, 0);

  const data = top8.map(([name, value]) => ({ name, value }));
  if (otherTotal > 0) {
    data.push({ name: "Other", value: otherTotal });
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card
      className="overflow-hidden border-border/50"
      style={{ animation: "fade-in 0.4s ease-out 0.3s both" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[11px] text-muted-foreground">Total</p>
              <p className="font-tabular text-sm font-bold text-foreground">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <div className="w-full space-y-1.5">
            {data.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-[12px]">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {entry.name}
                </span>
                <span className="shrink-0 font-tabular text-foreground">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
