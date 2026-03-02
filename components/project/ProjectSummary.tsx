"use client";

import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getProjectStatusColor } from "@/lib/utils";
import { Project } from "@/lib/types";

interface ProjectSummaryProps {
  project: Project;
  totalCommitted: number;
  variance: number;
  percentComplete: number;
}

export default function ProjectSummary({
  project,
  totalCommitted,
  variance,
  percentComplete,
}: ProjectSummaryProps) {
  const cards = [
    {
      label: "Estimated Budget",
      value: formatCurrency(project.estimatedBudget),
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Committed",
      value: formatCurrency(totalCommitted),
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Variance",
      value: `${variance >= 0 ? "+" : ""}${formatCurrency(variance)}`,
      icon: variance >= 0 ? TrendingUp : TrendingDown,
      color: variance >= 0 ? "text-emerald-400" : "text-red-400",
      bgColor: variance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
      subtext: variance >= 0 ? "Under budget" : "Over budget",
    },
    {
      label: "% Complete",
      value: `${percentComplete}%`,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {project.name}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {project.location}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-sm text-muted-foreground">
              {project.totalArea.toLocaleString()} m²
            </span>
            <Badge
              className={`text-[11px] ${getProjectStatusColor(project.status)}`}
            >
              {project.status.replace("-", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Card
            key={card.label}
            className="border-border/50"
            style={{
              animation: `fade-in 0.4s ease-out ${i * 0.08}s both`,
            }}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bgColor}`}
              >
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-muted-foreground">
                  {card.label}
                </p>
                <p className="font-tabular text-lg font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
