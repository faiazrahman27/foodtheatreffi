import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type FoodCharacterDetail = {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
  bio?: string;
  location?: string;
  country?: string;
  pricing?: string;
  canRelocate?: boolean;
  menu?: string;
  socialLinks?: string[];
  image?: unknown;
  cityRef?: {
    name?: string;
    country?: string;
  };
  categories?: (
    | {
        _id: string;
        title: string;
      }
    | null
  )[];
  chapter?: {
    city?: string;
    country?: string;
    slug?: {
      current: string;
    };
  };
};

type Experience = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  shortDescription?: string;
  format?: {
    title: string;
  } | null;
  city?: string;
  country?: string;
  coverImage?: unknown;
};

type ChapterLink = {
  city: string;
  slug?: {
    current: string;
  };
  country?: string;
};

const characterBySlugQuery = groq`
  *[_type == "foodCharacter" && slug.current == $slug][0]{
    _id,
    name,
    slug { current },
    bio,
    location,
    country,
    pricing,
    canRelocate,
    menu,
    socialLinks,
    image,
    cityRef->{
      name,
      country
    },
    categories[]->{
      _id,
      title
    },
    chapter->{
      city,
      country,
      slug {
        current
      }
    }
  }
`;

const characterSlugsQuery = groq`
  *[_type == "foodCharacter" && defined(slug.current)]{
    "slug": slug.current
  }
`;

const relatedExperiencesQuery = groq`
  *[_type == "experience" && foodCharacter->slug.current == $slug] | order(title asc){
    _id,
    title,
    slug { current },
    shortDescription,
    format->{
      title
    },
    city,
    country,
    coverImage
  }
`;

const chapterByCityQuery = groq`
  *[_type == "chapter" && city == $city][0]{
    city,
    slug {
      current
    },
    country
  }
`;

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(characterSlugsQuery);
  return slugs.map((item) => ({ slug: item.slug }));
}

export default async function FoodCharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const character: FoodCharacterDetail | null = await sanityClient.fetch(
    characterBySlugQuery,
    { slug }
  );

  if (!character) {
    notFound();
  }

  const relatedExperiences: Experience[] = await sanityClient.fetch(
    relatedExperiencesQuery,
    { slug }
  );

  const fallbackChapter: ChapterLink | null =
    !character.chapter && (character.cityRef?.name || character.location)
      ? await sanityClient.fetch(chapterByCityQuery, {
          city: character.cityRef?.name || character.location,
        })
      : null;

  const relatedChapter: ChapterLink | null = character.chapter
    ? {
        city: character.chapter.city || "",
        country: character.chapter.country,
        slug: character.chapter.slug,
      }
    : fallbackChapter;

  const imageUrl = character.image
    ? urlFor(character.image).width(1600).height(1800).url()
    : null;

  const connectHref = `/contact?type=character-connection&subject=${encodeURIComponent(
    `Connect about ${character.name}`
  )}&context=${encodeURIComponent(character.name)}&characterSlug=${encodeURIComponent(
    character.slug?.current || ""
  )}`;

  const chapterHref = relatedChapter?.slug?.current
    ? `/chapters/${relatedChapter.slug.current}`
    : null;

  const displayCity = character.cityRef?.name || character.location;
  const displayCountry = character.cityRef?.country || character.country;

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10 md:pb-10 md:pt-16">
        <Link
          href="/characters"
          className="text-sm text-black/60 transition hover:text-black"
        >
          ← Back to Characters
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:pb-20">
        <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div>
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
              <div className="relative h-[420px] w-full md:h-[760px]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={character.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-black/45">
              Food Character
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.04] md:text-6xl">
              {character.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-black/68">
              {[displayCity, displayCountry].filter(Boolean).join(", ")}
            </p>

            {character.categories?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {character.categories.map((tag, index) =>
                  tag?.title ? (
                    <span
                      key={tag._id || `${character._id}-tag-${index}`}
                      className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65"
                    >
                      {tag.title}
                    </span>
                  ) : null
                )}
              </div>
            ) : null}

            {character.bio ? (
              <p className="mt-8 text-lg leading-8 text-black/68">
                {character.bio}
              </p>
            ) : null}

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Location
                </p>
                <p className="mt-3 text-lg font-medium">
                  {displayCity || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Country
                </p>
                <p className="mt-3 text-lg font-medium">
                  {displayCountry || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Pricing
                </p>
                <p className="mt-3 text-lg font-medium">
                  {character.pricing || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Relocation
                </p>
                <p className="mt-3 text-lg font-medium">
                  {typeof character.canRelocate === "boolean"
                    ? character.canRelocate
                      ? "Available to relocate"
                      : "Location-based"
                    : "Not specified"}
                </p>
              </div>
            </div>

            {relatedChapter ? (
              <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                  Chapter Connection
                </p>

                <h2 className="mt-4 text-2xl font-semibold">
                  Connected to the {relatedChapter.city} chapter.
                </h2>

                <p className="mt-4 leading-8 text-black/68">
                  This Food Character belongs to a wider local ecosystem of
                  atmosphere, people, hospitality, and curated experiences.
                </p>

                {chapterHref ? (
                  <Link
                    href={chapterHref}
                    className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
                  >
                    Explore {relatedChapter.city} →
                  </Link>
                ) : null}
              </div>
            ) : null}

            {character.menu ? (
              <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                  Format & Menu
                </p>

                <h2 className="mt-4 text-2xl font-semibold">
                  A style shaped by craft, rhythm, and hospitality.
                </h2>

                <p className="mt-4 leading-8 text-black/68">
                  {character.menu}
                </p>
              </div>
            ) : null}

            <div className="mt-8 rounded-[2rem] bg-black px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                Connect
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                Curious about collaborating or building something together?
              </h2>

              <p className="mt-4 leading-8 text-white/70">
                Reach out with collaboration ideas, curatorial concepts,
                hosting questions, or interest in future formats connected to
                this Food Character.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={connectHref}
                  className="rounded-full bg-white px-6 py-3 text-black transition hover:bg-white/90"
                >
                  Connect About {character.name}
                </Link>
                <Link
                  href="/experiences"
                  className="rounded-full border border-white/20 px-6 py-3 text-white transition hover:bg-white/10"
                >
                  Browse Experiences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-black/45">
            Hosted Experiences
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Experiences by {character.name}
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-black/65">
            Explore the formats, settings, and atmospheres this character helps
            bring to life through Food Theatre.
          </p>
        </div>

        {relatedExperiences.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-black/65">No experiences linked yet.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {relatedExperiences.map((exp) => {
              const expImageUrl = exp.coverImage
                ? urlFor(exp.coverImage).width(1200).height(900).url()
                : null;

              const href = exp.slug?.current
                ? `/experiences/${exp.slug.current}`
                : "/experiences";

              return (
                <Link
                  key={exp._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                    {expImageUrl ? (
                      <Image
                        src={expImageUrl}
                        alt={exp.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                      {[exp.city, exp.country].filter(Boolean).join(" · ")}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">{exp.title}</h3>

                    {exp.format?.title ? (
                      <p className="mt-2 text-sm text-black/55">{exp.format.title}</p>
                    ) : null}

                    {exp.shortDescription ? (
                      <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                        {exp.shortDescription}
                      </p>
                    ) : null}

                    <p className="mt-6 text-sm font-medium text-black/80 transition group-hover:text-black">
                      View Experience →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
