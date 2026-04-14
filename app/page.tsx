import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type FoodCharacter = {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
  bio?: string;
  categories?: (
    | {
        _id: string;
        title: string;
      }
    | null
  )[];
  image?: unknown;
};

type Experience = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  shortDescription?: string;
  city?: string;
  country?: string;
  format?: {
    title: string;
  } | null;
  coverImage?: unknown;
};

type Chapter = {
  _id: string;
  city: string;
  slug?: {
    current: string;
  };
  country?: string;
  shortDescription?: string;
  chapterStyle?: {
    title: string;
  } | null;
  coverImage?: unknown;
};

type JournalPost = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  category?: string;
  excerpt?: string;
  coverImage?: unknown;
};

type BrandTone = {
  color: string;
  foreground: string;
};

const homeCharactersQuery = groq`
  *[_type == "foodCharacter"] | order(name asc)[0...3] {
    _id,
    name,
    slug {
      current
    },
    bio,
    categories[]->{
      _id,
      title
    },
    image
  }
`;

const featuredExperiencesQuery = groq`
  *[_type == "experience" && featured == true] | order(title asc)[0...3] {
    _id,
    title,
    slug {
      current
    },
    shortDescription,
    city,
    country,
    format->{
      title
    },
    coverImage
  }
`;

const featuredChaptersQuery = groq`
  *[_type == "chapter" && featured == true] | order(city asc)[0...3] {
    _id,
    city,
    slug {
      current
    },
    country,
    shortDescription,
    chapterStyle->{
      title
    },
    coverImage
  }
`;

const featuredJournalQuery = groq`
  *[_type == "journalPost" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug {
      current
    },
    category,
    excerpt,
    coverImage
  }
`;

const brandTones: BrandTone[] = [
  { color: "#EFD11E", foreground: "#111111" },
  { color: "#0072AE", foreground: "#FFFFFF" },
  { color: "#37AF87", foreground: "#FFFFFF" },
  { color: "#EE542E", foreground: "#FFFFFF" },
  { color: "#F3B7BF", foreground: "#111111" },
  { color: "#7A73B5", foreground: "#FFFFFF" },
];

const manifestoCards = [
  {
    title: "Vision",
    copy: "Celebrate people and stories around food to create new experiences.",
    tone: brandTones[0],
  },
  {
    title: "Promise",
    copy: "An inclusive identity that can host new brands, cities, and collaborators without losing itself.",
    tone: brandTones[2],
  },
  {
    title: "Typography",
    copy: "Righteous headlines bring the theatrical voice. Poppins keeps the reading experience clean and modern.",
    tone: brandTones[3],
  },
  {
    title: "Imagery",
    copy: "People and food remain central, often framed with strong color fields, circles, and soft geometric cutouts.",
    tone: brandTones[5],
  },
];

function withAlpha(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((value) => `${value}${value}`)
          .join("")
      : sanitized;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function toneStyle(tone: BrandTone): CSSProperties {
  return {
    "--ft-chip": tone.color,
    background: `linear-gradient(180deg, ${withAlpha(tone.color, 0.22)} 0%, rgba(255,255,255,0.92) 100%)`,
    boxShadow: `0 24px 56px ${withAlpha(tone.color, 0.18)}`,
  } as CSSProperties;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent: BrandTone;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
      <div>
        <p className="ft-eyebrow">{eyebrow}</p>
        <h2 className="mt-4 text-4xl leading-[0.95] md:text-6xl">{title}</h2>
      </div>

      <div className="ft-surface relative overflow-hidden p-6 md:p-8">
        <div
          className="absolute -right-10 top-0 h-28 w-28 rounded-full md:h-32 md:w-32"
          style={{ background: accent.color }}
        />
        <div
          className="absolute bottom-0 right-16 h-24 w-24 rounded-t-full"
          style={{ background: withAlpha(accent.color, 0.82) }}
        />
        <p className="relative max-w-2xl text-base leading-8 text-black/68 md:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

function ExperienceStageCard({
  experience,
  tone,
}: {
  experience: Experience;
  tone: BrandTone;
}) {
  const imageUrl = experience.coverImage
    ? urlFor(experience.coverImage).width(1400).height(1000).url()
    : null;

  const href = experience.slug?.current
    ? `/experiences/${experience.slug.current}`
    : "/experiences";

  return (
    <Link href={href} className="ft-card group block overflow-hidden">
      <div className="relative h-72 overflow-hidden bg-black/6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={experience.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : null}
        <div
          className="absolute left-5 top-5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            background: withAlpha(tone.color, 0.94),
            color: tone.foreground,
          }}
        >
          {experience.format?.title || "Featured format"}
        </div>
      </div>

      <div className="relative p-6">
        <div
          className="absolute -top-8 right-6 h-16 w-16 rounded-full border-[12px]"
          style={{
            borderColor: withAlpha(tone.color, 0.78),
            background: "rgba(255,255,255,0.85)",
          }}
        />
        <p className="ft-eyebrow">
          {[experience.city, experience.country].filter(Boolean).join(" / ") ||
            "Experiences"}
        </p>
        <h3 className="mt-3 text-3xl leading-none">{experience.title}</h3>
        {experience.shortDescription ? (
          <p className="mt-4 text-sm leading-7 text-black/68">
            {experience.shortDescription}
          </p>
        ) : null}
        <span className="ft-link mt-6">Explore experience</span>
      </div>
    </Link>
  );
}

function CharacterStageCard({
  character,
  tone,
}: {
  character: FoodCharacter;
  tone: BrandTone;
}) {
  const imageUrl = character.image
    ? urlFor(character.image).width(1200).height(1400).url()
    : null;

  const href = character.slug?.current
    ? `/characters/${character.slug.current}`
    : "/characters";

  return (
    <Link href={href} className="ft-card group block p-6">
      <div className="relative overflow-hidden rounded-[1.7rem] p-4">
        <div
          className="absolute inset-x-0 bottom-0 top-10 rounded-full"
          style={{ background: tone.color }}
        />
        <div className="absolute left-6 top-4 h-7 w-7 rounded-full bg-white/92" />
        <div className="absolute bottom-5 right-4 h-12 w-12 rounded-full border-[11px] border-white/80" />

        <div className="relative mx-auto aspect-square max-w-[17rem] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 28vw"
              className="object-contain object-bottom grayscale transition duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <p className="ft-eyebrow">Food Character</p>
        <h3 className="mt-3 text-3xl leading-none">{character.name}</h3>

        {character.categories?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {character.categories.map((tag, index) =>
              tag?.title ? (
                <span
                  key={tag._id || `${character._id}-tag-${index}`}
                  className="ft-stage-chip text-[0.72rem]"
                  style={
                    {
                      "--ft-chip":
                        brandTones[(index + 2) % brandTones.length].color,
                    } as CSSProperties
                  }
                >
                  {tag.title}
                </span>
              ) : null
            )}
          </div>
        ) : null}

        {character.bio ? (
          <p className="mt-4 text-sm leading-7 text-black/68">
            {character.bio}
          </p>
        ) : null}

        <span className="ft-link mt-6">Meet the character</span>
      </div>
    </Link>
  );
}

function ChapterStageCard({
  chapter,
  tone,
}: {
  chapter: Chapter;
  tone: BrandTone;
}) {
  const imageUrl = chapter.coverImage
    ? urlFor(chapter.coverImage).width(1400).height(1100).url()
    : null;

  const href = chapter.slug?.current
    ? `/chapters/${chapter.slug.current}`
    : "/chapters";

  return (
    <Link href={href} className="ft-card group block overflow-hidden">
      <div
        className="relative p-5"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(tone.color, 0.26)} 0%, rgba(255,255,255,0.4) 100%)`,
        }}
      >
        <div className="relative h-64 overflow-hidden rounded-[1.6rem]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={chapter.city}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : null}
        </div>

        <div
          className="absolute right-10 top-10 flex h-14 w-14 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.18em]"
          style={{
            background: tone.color,
            color: tone.foreground,
          }}
        >
          FT
        </div>
      </div>

      <div className="p-6">
        <p className="ft-eyebrow">{chapter.country || "Chapter"}</p>
        <h3 className="mt-3 text-3xl leading-none">{chapter.city}</h3>
        {chapter.chapterStyle?.title ? (
          <p className="mt-3 text-sm font-semibold text-black/58">
            {chapter.chapterStyle.title}
          </p>
        ) : null}
        {chapter.shortDescription ? (
          <p className="mt-4 text-sm leading-7 text-black/68">
            {chapter.shortDescription}
          </p>
        ) : null}
        <span className="ft-link mt-6">Explore chapter</span>
      </div>
    </Link>
  );
}

function JournalStageCard({
  post,
  tone,
}: {
  post: JournalPost;
  tone: BrandTone;
}) {
  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1400).height(1000).url()
    : null;

  const href = post.slug?.current ? `/journal/${post.slug.current}` : "/journal";

  return (
    <Link href={href} className="ft-card group block overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${withAlpha(
              tone.color,
              0.8
            )} 100%)`,
          }}
        />
      </div>

      <div className="p-6">
        <p className="ft-eyebrow">{post.category || "Journal"}</p>
        <h3 className="mt-3 text-3xl leading-none">{post.title}</h3>
        {post.excerpt ? (
          <p className="mt-4 text-sm leading-7 text-black/68">
            {post.excerpt}
          </p>
        ) : null}
        <span className="ft-link mt-6">Read the article</span>
      </div>
    </Link>
  );
}

export default async function Home() {
  const [characters, experiences, chapters, journalPosts]: [
    FoodCharacter[],
    Experience[],
    Chapter[],
    JournalPost[],
  ] = await Promise.all([
    sanityClient.fetch(homeCharactersQuery),
    sanityClient.fetch(featuredExperiencesQuery),
    sanityClient.fetch(featuredChaptersQuery),
    sanityClient.fetch(featuredJournalQuery),
  ]);

  return (
    <main className="ft-shell min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-citrine)" } as CSSProperties}
              >
                Brand book aligned
              </span>
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-denim)" } as CSSProperties}
              >
                Righteous + Poppins
              </span>
              <span
                className="ft-stage-chip"
                style={{ "--ft-chip": "var(--ft-pomodori)" } as CSSProperties}
              >
                Color-led stage system
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-[3.6rem] leading-[0.9] md:text-[6.65rem]">
              A colorful stage for food, people, and place.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/72">
              The redesign translates the PDF directly into product language:
              quiet off-white space, strong circular geometry, saturated six-color
              accents, bold theatrical headlines, and portraits that feel like
              protagonists instead of profile tiles.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/experiences">Explore Experiences</Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="bg-white/80">
                <Link href="/characters">Meet Food Characters</Link>
              </Button>
            </div>

            <form
              action="/search"
              method="GET"
              className="ft-surface-strong mt-10 p-4 md:p-5"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="ft-eyebrow">Search the stage</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      name="q"
                      placeholder="Search experiences, characters, chapters, journal..."
                      className="ft-input"
                    />

                    <Button type="submit" size="lg" className="shrink-0">
                      Search
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <span
                    className="ft-stage-chip"
                    style={{ "--ft-chip": "var(--ft-citrine)" } as CSSProperties}
                  >
                    Experiences
                  </span>
                  <span
                    className="ft-stage-chip"
                    style={{ "--ft-chip": "var(--ft-denim)" } as CSSProperties}
                  >
                    Chapters
                  </span>
                  <span
                    className="ft-stage-chip"
                    style={{ "--ft-chip": "var(--ft-menta)" } as CSSProperties}
                  >
                    Journal
                  </span>
                </div>
              </div>
            </form>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Experiences",
                  title: "Immersive formats",
                  tone: brandTones[0],
                },
                {
                  label: "Characters",
                  title: "Hosts and creators",
                  tone: brandTones[3],
                },
                {
                  label: "Chapters",
                  title: "City-based stages",
                  tone: brandTones[1],
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="ft-card p-5"
                  style={toneStyle(stat.tone)}
                >
                  <p className="ft-eyebrow">{stat.label}</p>
                  <p className="mt-3 text-2xl leading-none">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <HeroCarousel />

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/about"
                className="ft-card relative overflow-hidden p-6"
                style={toneStyle(brandTones[2])}
              >
                <div className="absolute -right-6 top-6 h-20 w-20 rounded-full bg-white/65" />
                <p className="ft-eyebrow">Vision / Promise</p>
                <h2 className="mt-4 text-3xl leading-none">
                  Celebrate people and stories around food.
                </h2>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  The brand book frames Food Theatre as a flexible system that
                  can welcome new communities without losing its voice.
                </p>
                <span className="ft-link mt-6">Read the story</span>
              </Link>

              <Link
                href="/contact?type=general-contact"
                className="ft-card relative overflow-hidden p-6"
                style={toneStyle(brandTones[4])}
              >
                <div className="absolute bottom-0 right-0 h-24 w-24 rounded-t-full bg-white/70" />
                <p className="ft-eyebrow">General Inquiry</p>
                <h2 className="mt-4 text-3xl leading-none">
                  Start a conversation with the team.
                </h2>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  Reach out about collaborations, formats, chapters, or how the
                  platform can show up in a specific city.
                </p>
                <span className="ft-link mt-6">Open inquiry</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 md:py-8">
        <div className="ft-surface-strong overflow-hidden p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="ft-eyebrow">Brand Translation</p>
              <h2 className="mt-4 text-4xl leading-[0.95] md:text-5xl">
                The homepage now behaves like the brand book, not just the logo.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-black/68">
                Instead of generic white cards, the experience now uses the
                exact brand palette, circular and cut-out geometry, bolder
                editorial hierarchy, and a more stage-like composition.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {manifestoCards.map((card) => (
                <div
                  key={card.title}
                  className="ft-card relative overflow-hidden p-6"
                  style={toneStyle(card.tone)}
                >
                  <div
                    className="absolute -right-8 bottom-0 h-20 w-20 rounded-t-full"
                    style={{ background: withAlpha(card.tone.color, 0.86) }}
                  />
                  <p className="ft-eyebrow">{card.title}</p>
                  <h3 className="mt-4 text-3xl leading-none">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-black/68">
                    {card.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeader
          eyebrow="Featured Experiences"
          title="Immersive formats with a stronger sense of atmosphere."
          description="Featured experiences now sit inside a more theatrical layout with color-coded accents, tighter hierarchy, and imagery that feels staged rather than slotted."
          accent={brandTones[3]}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {experiences.map((experience, index) => (
            <ExperienceStageCard
              key={experience._id}
              experience={experience}
              tone={brandTones[index % brandTones.length]}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/experiences" className="ft-link text-black/80">
            View more experiences
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeader
          eyebrow="Food Characters"
          title="Portraits treated like protagonists, not profile blocks."
          description="The brand book repeatedly frames people inside circles, cut-outs, and saturated color fields. The character cards now borrow that exact language."
          accent={brandTones[5]}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {characters.map((character, index) => (
            <CharacterStageCard
              key={character._id}
              character={character}
              tone={brandTones[(index + 1) % brandTones.length]}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/characters" className="ft-link text-black/80">
            View more characters
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeader
          eyebrow="Chapters"
          title="Cities feel like stages with their own local color."
          description="Chapter cards now land between editorial and wayfinding: big image frames, strong color moments, and a more confident sense of place."
          accent={brandTones[1]}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {chapters.map((chapter, index) => (
            <ChapterStageCard
              key={chapter._id}
              chapter={chapter}
              tone={brandTones[(index + 2) % brandTones.length]}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/chapters" className="ft-link text-black/80">
            View more chapters
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeader
          eyebrow="Journal"
          title="Editorial space for rituals, hospitality, and cultural context."
          description="The journal keeps the same palette-driven system but uses quieter overlays so it still reads like editorial content instead of event promotion."
          accent={brandTones[4]}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {journalPosts.map((post, index) => (
            <JournalStageCard
              key={post._id}
              post={post}
              tone={brandTones[(index + 4) % brandTones.length]}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/journal" className="ft-link text-black/80">
            View more journal articles
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="ft-surface-strong relative overflow-hidden p-8 md:p-12">
          <div className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-[var(--ft-citrine)]" />
          <div className="absolute bottom-0 right-32 h-56 w-56 rounded-t-full bg-[var(--ft-denim)]" />
          <div className="absolute -bottom-10 right-6 h-32 w-32 rounded-full border-[24px] border-[var(--ft-blush)] bg-transparent" />

          <div className="relative max-w-3xl">
            <p className="ft-eyebrow">Join the Stage</p>
            <h2 className="mt-4 text-5xl leading-[0.92] md:text-6xl">
              Build, host, and experience the next chapter of food culture.
            </h2>
            <p className="mt-6 text-lg leading-8 text-black/72">
              The new visual system is designed to support guests, chapters,
              partners, and Food Characters with the same confident identity
              across every touchpoint.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/become-a-character">Become a Food Character</Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="bg-white/86">
                <Link href="/open-a-chapter">Open a Chapter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
