"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";

const heroImages = [
  "/images/hero-dining-new.jpg",
  "/images/hero-dining1.jpg",
  "/images/hero-dining2.jpg",
  "/images/hero-dining3.jpg",
  "/images/hero-dining4.jpg",
  "/images/hero-dining5.jpg",
  "/images/hero-dining6.jpg",
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advanceSlide = useEffectEvent(() => {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % heroImages.length);
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      advanceSlide();
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  function goToPrevious() {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? heroImages.length - 1 : previousIndex - 1
    );
  }

  function goToNext() {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % heroImages.length);
  }

  return (
    <div className="ft-surface relative overflow-hidden p-3 md:p-4">
      <div className="absolute left-6 top-6 z-20 flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full bg-[var(--ft-citrine)]"
          aria-hidden="true"
        />
        <p className="ft-eyebrow text-white/90 mix-blend-difference">
          Stage visuals
        </p>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-[1.7rem] bg-black md:h-[560px]">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Food Theatre scene ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
          </div>
        ))}

        <div className="absolute left-5 right-5 top-5 z-10 flex items-start justify-between">
          <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            Curated dining atmospheres
          </div>

          <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(heroImages.length).padStart(2, "0")}
          </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-4">
          <div className="max-w-sm rounded-[1.5rem] border border-white/14 bg-black/35 px-5 py-4 text-white backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Food Theatre
            </p>
            <p className="mt-2 text-sm leading-6 text-white/85">
              A stage for immersive dining, food characters, and local cultural
              chapters.
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/14 text-lg text-white backdrop-blur-sm transition hover:bg-white/22"
            >
              &larr;
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/14 text-lg text-white backdrop-blur-sm transition hover:bg-white/22"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:hidden">
          {heroImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
              className={`h-2.5 rounded-full transition ${
                index === currentIndex ? "w-9 bg-white" : "w-2.5 bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
