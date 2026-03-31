interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-18">
      <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] md:text-6xl">
            {title}
          </h1>
        </div>

        <p className="max-w-2xl text-lg leading-8 text-black/65 md:justify-self-end">
          {description}
        </p>
      </div>
    </section>
  );
}