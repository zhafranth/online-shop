import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "pending" | "active" | "done";
}

interface StepBarProps {
  steps: Step[];
}

export function StepBar({ steps }: StepBarProps) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.label} className="contents">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0",
              step.status === "active" && "bg-navy text-white border-navy",
              step.status === "done" && "bg-gold text-white border-gold",
              step.status === "pending" && "bg-white text-site-gray border-site-border"
            )}>
              {step.status === "done" ? "✓" : i + 1}
            </div>
            <span className={cn(
              "text-xs font-medium whitespace-nowrap",
              step.status === "active" ? "text-navy" : "text-site-gray"
            )}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-px mx-2 min-w-5",
              step.status === "done" ? "bg-gold" : "bg-site-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
