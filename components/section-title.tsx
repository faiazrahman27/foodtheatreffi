interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.3em] text-white/45">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-white/70">{description}</p>
      ) : null}
    </div>
  );
}