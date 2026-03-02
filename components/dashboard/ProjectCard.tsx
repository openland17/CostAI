"use client";

import Link from "next/link";
import { MapPin, Ruler, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatNumber,
  getProjectStatusColor,
  getProjectTypeLabel,
} from "@/lib/utils";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  committed: number;
  delay?: number;
}

export default function ProjectCard({
  project,
  committed,
  delay = 0,
}: ProjectCardProps) {
  const progress =
    project.estimatedBudget > 0
      ? Math.min(
          Math.round((committed / project.estimatedBudget) * 100),
          100
        )
      : 0;

  return (
    <Link href={`/project/${project.id}`}>
      <Card
        className="group cursor-pointer border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        style={{
          animation: `fade-in 0.4s ease-out ${delay}s both`,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  {formatNumber(project.totalArea)} m²
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-medium"
            >
              {getProjectTypeLabel(project.type)}
            </Badge>
            <Badge
              className={`text-[11px] font-medium ${getProjectStatusColor(project.status)}`}
            >
              {project.status.replace("-", " ")}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-muted-foreground">Budget</span>
              <span className="font-tabular text-lg font-bold text-foreground">
                {formatCurrency(project.estimatedBudget)}
              </span>
            </div>

            <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/80 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[12px] text-muted-foreground">
              <span>
                {formatCurrency(committed)} committed
              </span>
              <span>{progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
