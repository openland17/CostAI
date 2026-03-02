"use client";

import { useProject } from "@/lib/store";
import { getProjectTotals } from "@/lib/utils";
import BudgetSummary from "@/components/dashboard/BudgetSummary";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CostBreakdownChart from "@/components/dashboard/CostBreakdownChart";

export default function DashboardPage() {
  const { projects, lineItems, getProjectLineItems } = useProject();

  const totalPortfolio = projects.reduce(
    (sum, p) => sum + p.estimatedBudget,
    0
  );

  const totalCommitted = lineItems.reduce(
    (sum, li) => sum + li.totalCost,
    0
  );

  const totalVariance = totalPortfolio - totalCommitted;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Portfolio overview across all active projects
        </p>
      </div>

      <BudgetSummary
        totalPortfolio={totalPortfolio}
        totalCommitted={totalCommitted}
        totalVariance={totalVariance}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Active Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project, i) => {
              const items = getProjectLineItems(project.id);
              const totals = getProjectTotals(items, project.estimatedBudget);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  committed={totals.totalCommitted}
                  delay={0.15 + i * 0.08}
                />
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Cost Distribution
          </h2>
          <CostBreakdownChart lineItems={lineItems} />
        </div>
      </div>
    </div>
  );
}
