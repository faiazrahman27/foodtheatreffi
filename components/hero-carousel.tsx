"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  function goToPrevious() {
    setCurrentIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  }

  function goToNext() {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }

  function goToSlide(index: number) {
    setCurrentIndex(index);
  }

  return (
    <div className="overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="relative h-[360px] w-full md:h-[500px]">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Food Theatre hero ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-black shadow transition hover:bg-white"
        >
          ←
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-black shadow transition hover:bg-white"
        >
          →
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm">
          {heroImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === currentIndex ? "bg-white" : "bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
