"use client";

import { useEffect, useState } from "react";
import { Loader2, FileSearch, Brain, TableProperties } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Reading document", icon: FileSearch },
  { label: "Analyzing with AI", icon: Brain },
  { label: "Structuring results", icon: TableProperties },
];

export default function ProcessingIndicator() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-16" style={{ animation: "fade-in 0.3s ease-out both" }}>
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        Extracting cost data...
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        AI is reading and structuring your document
      </p>

      <div className="mt-8 space-y-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                i <= activeStep
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground/40"
              )}
            >
              <step.icon className="h-4 w-4" />
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                i <= activeStep
                  ? "text-foreground"
                  : "text-muted-foreground/40"
              )}
            >
              {step.label}
              {i === activeStep && i < steps.length - 1 && (
                <span className="ml-1 text-primary">...</span>
              )}
              {i < activeStep && (
                <span className="ml-1.5 text-xs text-emerald-400">Done</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
