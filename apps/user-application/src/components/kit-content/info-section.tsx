import { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function InfoSection({ title, children, className }: InfoSectionProps) {
  return (
    <section className={`space-y-4 ${className || ""}`}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}