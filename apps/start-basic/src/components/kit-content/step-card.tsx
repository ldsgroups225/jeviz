import { ReactNode } from "react";

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="relative border rounded-lg p-6 mt-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {step}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}
