interface PageTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageTitle({ title, subtitle, badge }: PageTitleProps) {
  return (
    <div className="space-y-4 text-center mb-12">
      {badge && (
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {badge}
          </span>
        </div>
      )}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}