"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/lib/store";
import { ExtractionResult, ExtractedItem } from "@/lib/types";
import { DEMO_SUPPLIER_QUOTE } from "@/lib/extractionPrompt";
import DropZone from "@/components/upload/DropZone";
import ProcessingIndicator from "@/components/upload/ProcessingIndicator";
import ExtractionPreview from "@/components/upload/ExtractionPreview";

type PageState = "idle" | "processing" | "results" | "success";

export default function UploadPage() {
  return (
    <Suspense>
      <UploadPageInner />
    </Suspense>
  );
}

function UploadPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addLineItems } = useProject();

  const [state, setState] = useState<PageState>("idle");
  const [selectedProject, setSelectedProject] = useState(
    searchParams.get("project") || projects[0]?.id || ""
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processExtraction = useCallback(
    async (text: string) => {
      setState("processing");
      setError(null);
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data: ExtractionResult = await res.json();
        setResult(data);
        setState("results");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Extraction failed"
        );
        setState("idle");
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      try {
        const formData = new FormData();
        formData.append("file", file);
        setState("processing");
        const parseRes = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });
        if (!parseRes.ok) {
          throw new Error("Failed to parse document");
        }
        const { text } = await parseRes.json();
        await processExtraction(text);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process file"
        );
        setState("idle");
      }
    },
    [processExtraction]
  );

  const handleDemoExtraction = useCallback(() => {
    processExtraction(DEMO_SUPPLIER_QUOTE);
  }, [processExtraction]);

  const handleConfirm = useCallback(
    (items: ExtractedItem[]) => {
      const lineItems = items.map((item) => ({
        projectId: selectedProject,
        category: item.category,
        description: item.description,
        unit: item.unit || "lot",
        quantity: item.quantity || 0,
        unitRate: item.unitRate || 0,
        totalCost: item.totalCost || 0,
        supplier: item.supplier,
        status: "quoted" as const,
        source: "ai-extracted" as const,
        notes: "",
      }));
      addLineItems(lineItems);
      setState("success");
      setTimeout(() => {
        router.push(`/project/${selectedProject}`);
      }, 1500);
    },
    [selectedProject, addLineItems, router]
  );

  const handleDiscard = useCallback(() => {
    setState("idle");
    setResult(null);
    setSelectedFile(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Upload Document
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload supplier quotes, BOQs, or invoices — AI extracts the cost
            data automatically
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">Add items to:</label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {state === "success" && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-emerald-400">
                Items added successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to project...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {state === "idle" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Document Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DropZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />

            <div className="relative flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleDemoExtraction}
              >
                <Zap className="h-4 w-4 text-primary" />
                Try Demo Extraction
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Extract data from a sample Beaumont Tiles supplier quote
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {state === "processing" && (
        <Card className="border-border/50">
          <CardContent>
            <ProcessingIndicator />
          </CardContent>
        </Card>
      )}

      {state === "results" && result && (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <ExtractionPreview
              result={result}
              onConfirm={handleConfirm}
              onDiscard={handleDiscard}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
