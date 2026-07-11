interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
}

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="px-3 pb-4 pt-20 md:px-6 md:pt-24">
      <p className="font-label text-xs uppercase tracking-wider text-flame-text">{eyebrow}</p>
      <h1 className="mt-2 max-w-3xl break-words font-display text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-8xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-4 max-w-xl font-body text-lg text-ink-muted">{intro}</p>
      )}
    </header>
  );
}
