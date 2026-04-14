import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const footerLinks = [
  { href: "/experiences", label: "Experiences", chip: "var(--ft-citrine)" },
  { href: "/characters", label: "Characters", chip: "var(--ft-pomodori)" },
  { href: "/chapters", label: "Chapters", chip: "var(--ft-denim)" },
  { href: "/journal", label: "Journal", chip: "var(--ft-viola)" },
  { href: "/about", label: "About", chip: "var(--ft-blush)" },
  {
    href: "/contact?type=general-contact",
    label: "General Inquiry",
    chip: "var(--ft-menta)",
  },
];

export function Footer() {
  return (
    <footer className="ft-shell mt-20 border-t border-black/8 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="ft-surface-strong relative overflow-hidden p-8 md:p-10">
            <div className="absolute -right-12 top-6 h-36 w-36 rounded-full bg-[var(--ft-citrine)]/90" />
            <div className="absolute bottom-0 right-20 h-44 w-44 rounded-t-full bg-[var(--ft-menta)]/85" />
            <div className="absolute -bottom-8 right-8 h-28 w-28 rounded-full border-[20px] border-[var(--ft-blush)]" />

            <div className="relative max-w-xl">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] border border-black/8 bg-white">
                  <Image
                    src="/logoft.png"
                    alt="Food Theatre logo"
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <p className="ft-eyebrow">Food Theatre</p>
                  <h2 className="mt-2 text-[2.35rem] leading-none md:text-[2.9rem]">
                    The stage stays open.
                  </h2>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-base leading-8 text-black/68">
                A multi-color brand system built for immersive dining, local
                chapters, and the people who make hospitality feel alive.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact?type=general-contact">Start a Conversation</Link>
                </Button>

                <Button asChild variant="outline" className="bg-white/80">
                  <Link href="/open-a-chapter">Open a Chapter</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="ft-surface p-6">
              <p className="ft-eyebrow">Explore</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ft-stage-chip"
                    style={{ "--ft-chip": link.chip } as CSSProperties}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="ft-surface p-6">
              <p className="ft-eyebrow">Vision</p>
              <h3 className="mt-4 text-3xl leading-none">
                Celebrate people and stories around food.
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/68">
                The brand book frames Food Theatre as a flexible, inclusive
                system that can host new voices without losing its identity.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-black/8 pt-6 text-sm text-black/52 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Food Theatre. A product of Future
            Food Institute. All rights reserved.
          </p>
          <p>Built with a colorful stage language inspired by the brand book.</p>
        </div>
      </div>
    </footer>
  );
}
