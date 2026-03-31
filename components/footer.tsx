import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/logoft.png"
                alt="Food Theatre Logo"
                width={70}
                height={70}
                className="object-contain"
              />
              <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-black/75">
                Food Theatre
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-black/55">
              A curated platform for food, culture, and experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-black/55">
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
            <Link href="/about" className="transition hover:text-black">
              About
            </Link>
            <Link
              href="/contact?type=general-contact"
              className="transition hover:text-black"
            >
              General Inquiry
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6">
          <p className="text-xs leading-6 text-black/45">
            © {new Date().getFullYear()} Food Theatre. A product of Future Food
            Institute. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
