import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/experiences", label: "Experiences", chip: "var(--ft-citrine)" },
  { href: "/characters", label: "Characters", chip: "var(--ft-pomodori)" },
  { href: "/chapters", label: "Chapters", chip: "var(--ft-denim)" },
  { href: "/journal", label: "Journal", chip: "var(--ft-viola)" },
  { href: "/about", label: "About", chip: "var(--ft-blush)" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-[rgba(255,253,248,0.78)] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.45rem] border border-black/8 bg-white shadow-[0_14px_34px_rgba(17,17,17,0.08)]">
                <Image
                  src="/logoft.png"
                  alt="Food Theatre logo"
                  fill
                  sizes="56px"
                  className="object-contain p-2"
                />
              </div>

              <div className="min-w-0">
                <p className="font-heading text-[1.8rem] leading-none text-black">
                  Food Theatre
                </p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-black/55">
                  Stories, stages, and shared tables
                </p>
              </div>
            </Link>

            <Link
              href="/search"
              className="ft-stage-chip shrink-0 xl:hidden"
              style={{ "--ft-chip": "var(--ft-denim)" } as CSSProperties}
            >
              Search
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center xl:flex">
            <nav className="ft-surface flex items-center gap-2 px-3 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ft-stage-chip hover:bg-white"
                  style={{ "--ft-chip": link.chip } as CSSProperties}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/search"
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-menta)" } as CSSProperties}
              >
                Search
              </Link>
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="outline" className="bg-white/80">
              <Link href="/become-a-character">Become a Character</Link>
            </Button>

            <Button asChild>
              <Link href="/open-a-chapter">Open a Chapter</Link>
            </Button>
          </div>
        </div>

        <div className="ft-no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 xl:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ft-stage-chip shrink-0"
              style={{ "--ft-chip": link.chip } as CSSProperties}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <form
          action="/search"
          method="GET"
          className="ft-surface mt-3 flex items-center gap-2 p-2 xl:hidden"
        >
          <input
            type="text"
            name="q"
            placeholder="Search experiences, characters, chapters..."
            className="ft-input min-w-0 border-0 bg-transparent px-3 py-2 shadow-none focus:shadow-none"
          />

          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
      </div>
    </header>
  );
}
