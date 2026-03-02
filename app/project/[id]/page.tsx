"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/lib/store";
import { getProjectTotals } from "@/lib/utils";
import ProjectSummary from "@/components/project/ProjectSummary";
import CostSchedule from "@/components/project/CostSchedule";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, getProjectLineItems } = useProject();

  const project = projects.find((p) => p.id === params.id);
  const items = getProjectLineItems(params.id as string);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-lg font-medium text-foreground">
          Project not found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const totals = getProjectTotals(items, project.estimatedBudget);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => router.push(`/upload?project=${project.id}`)}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </Button>
      </div>

      <ProjectSummary
        project={project}
        totalCommitted={totals.totalCommitted}
        variance={totals.variance}
        percentComplete={totals.percentComplete}
      />

      <div className="pt-2">
        <CostSchedule items={items} projectId={project.id} />
      </div>
    </div>
  );
}
