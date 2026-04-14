import type { CSSProperties } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <p className="ft-eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.92] md:text-7xl">
            {title}
          </h1>
        </div>

        <div className="ft-surface relative overflow-hidden p-8 md:p-10">
          <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[var(--ft-citrine)]" />
          <div className="absolute bottom-0 right-14 h-36 w-36 rounded-t-full bg-[var(--ft-denim)]/88" />
          <div className="absolute bottom-6 left-6 h-6 w-6 rounded-full bg-[var(--ft-blush)]" />

          <div className="relative">
            <p className="text-base leading-8 text-black/70 md:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-citrine)" } as CSSProperties}
              >
                Multi-color identity
              </span>
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-pomodori)" } as CSSProperties}
              >
                Immersive storytelling
              </span>
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-menta)" } as CSSProperties}
              >
                Community platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
