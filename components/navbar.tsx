import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f1ea]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative h-20 w-20 shrink-0">
              <Image
                src="/logoft.png"
                alt="Food Theatre logo"
                fill
                className="object-contain"
              />
            </div>

            <span className="text-sm uppercase tracking-[0.35em] text-black/80">
              Food Theatre
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden items-center gap-8 text-sm text-black/70 lg:flex">
            <Link href="/experiences" className="transition hover:text-black">
              Experiences
            </Link>
            <Link href="/characters" className="transition hover:text-black">
              Characters
            </Link>
            <Link href="/chapters" className="transition hover:text-black">
              Chapters
            </Link>
            <Link href="/journal" className="transition hover:text-black">
              Journal
            </Link>
            <Link href="/search" className="transition hover:text-black">
              Search
            </Link>
            <Link href="/about" className="transition hover:text-black">
              About
            </Link>
          </nav>

          {/* CENTER SEARCH (DESKTOP) */}
          <div className="hidden min-w-0 flex-1 justify-center xl:flex">
            <form
              action="/search"
              method="GET"
              className="flex w-full max-w-xs items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <input
                type="text"
                name="q"
                placeholder="Explore..."
                className="w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-black/40"
              />
              <button
                type="submit"
                className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-black/85"
              >
                Search
              </button>
            </form>
          </div>

          {/* ACTION BUTTONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/become-a-character">
              <Button
                variant="outline"
                className="rounded-full border-black bg-transparent text-black hover:bg-black/5"
              >
                Become a Character
              </Button>
            </Link>

            <Link href="/open-a-chapter">
              <Button className="rounded-full bg-black text-white hover:bg-black/90">
                Open a Chapter
              </Button>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-4 xl:hidden">
          <form
            action="/search"
            method="GET"
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            <input
              type="text"
              name="q"
              placeholder="Explore..."
              className="w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-black/85"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
