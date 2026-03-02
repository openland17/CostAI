"use client";

import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface BudgetSummaryProps {
  totalPortfolio: number;
  totalCommitted: number;
  totalVariance: number;
}

export default function BudgetSummary({
  totalPortfolio,
  totalCommitted,
  totalVariance,
}: BudgetSummaryProps) {
  const cards = [
    {
      label: "Total Portfolio Value",
      value: totalPortfolio,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Committed",
      value: totalCommitted,
      icon: DollarSign,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Variance",
      value: totalVariance,
      icon: totalVariance >= 0 ? TrendingUp : TrendingDown,
      color: totalVariance >= 0 ? "text-emerald-400" : "text-red-400",
      bgColor:
        totalVariance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <Card
          key={card.label}
          className="overflow-hidden border-border/50"
          style={{
            animation: `fade-in 0.4s ease-out ${i * 0.1}s both`,
          }}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}
            >
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-muted-foreground">{card.label}</p>
              <p className="font-tabular text-xl font-bold tracking-tight text-foreground">
                {formatCurrency(card.value)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
