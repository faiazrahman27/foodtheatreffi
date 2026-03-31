import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type ExperienceDetail = {
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
  };
  price?: string;
  bookingStyle?: string;
  tags?: string[];
  coverImage?: unknown;
  foodCharacter?: {
    name?: string;
    slug?: {
      current: string;
    };
  };
  chapter?: {
    city?: string;
    country?: string;
    slug?: {
      current: string;
    };
  };
};

type ChapterLink = {
  city: string;
  slug?: {
    current: string;
  };
  country?: string;
};

const experienceBySlugQuery = groq`
  *[_type == "experience" && slug.current == $slug][0]{
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
    price,
    bookingStyle,
    tags,
    coverImage,
    foodCharacter->{
      name,
      slug {
        current
      }
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

const experienceSlugsQuery = groq`
  *[_type == "experience" && defined(slug.current)]{
    "slug": slug.current
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
  const slugs: { slug: string }[] = await sanityClient.fetch(
    experienceSlugsQuery
  );

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const experience: ExperienceDetail | null = await sanityClient.fetch(
    experienceBySlugQuery,
    { slug }
  );

  if (!experience) {
    notFound();
  }

  const fallbackChapter: ChapterLink | null =
    !experience.chapter && experience.city
      ? await sanityClient.fetch(chapterByCityQuery, { city: experience.city })
      : null;

  const relatedChapter: ChapterLink | null = experience.chapter
    ? {
        city: experience.chapter.city || "",
        country: experience.chapter.country,
        slug: experience.chapter.slug,
      }
    : fallbackChapter;

  const imageUrl = experience.coverImage
    ? urlFor(experience.coverImage).width(1800).height(1300).url()
    : null;

  const hostHref = experience.foodCharacter?.slug?.current
    ? `/characters/${experience.foodCharacter.slug.current}`
    : null;

  const chapterHref = relatedChapter?.slug?.current
    ? `/chapters/${relatedChapter.slug.current}`
    : null;

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10 md:pb-10 md:pt-16">
        <Link
          href="/experiences"
          className="text-sm text-black/60 transition hover:text-black"
        >
          ← Back to Experiences
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:pb-20">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div>
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
              <div className="relative h-[380px] w-full md:h-[700px]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={experience.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 56vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-black/45">
              Experience
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.04] md:text-6xl">
              {experience.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-black/68">
              {[experience.city, experience.country].filter(Boolean).join(", ")}
            </p>

            {experience.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {experience.shortDescription ? (
              <p className="mt-8 text-lg leading-8 text-black/68">
                {experience.shortDescription}
              </p>
            ) : null}

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Format
                </p>
                <p className="mt-3 text-lg font-medium">
                  {experience.format?.title || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Price
                </p>
                <p className="mt-3 text-lg font-medium">
                  {experience.price || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Booking Style
                </p>
                <p className="mt-3 text-lg font-medium">
                  {experience.bookingStyle || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Host
                </p>
                <div className="mt-3 text-lg font-medium">
                  {hostHref ? (
                    <Link
                      href={hostHref}
                      className="transition hover:text-black/70"
                    >
                      {experience.foodCharacter?.name}
                    </Link>
                  ) : (
                    experience.foodCharacter?.name || "Not specified"
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                Hosted By
              </p>

              <h2 className="mt-4 text-2xl font-semibold">
                A distinct experience shaped by a real host.
              </h2>

              <p className="mt-4 leading-8 text-black/68">
                Food Theatre experiences are never anonymous. Each format is
                shaped by a person with their own style, rhythm, hospitality,
                and point of view.
              </p>

              <div className="mt-6">
                {hostHref ? (
                  <Link
                    href={hostHref}
                    className="inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
                  >
                    Meet {experience.foodCharacter?.name} →
                  </Link>
                ) : (
                  <p className="text-black/60">Host not linked yet.</p>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                Chapter Connection
              </p>

              {chapterHref ? (
                <>
                  <h2 className="mt-4 text-2xl font-semibold">
                    This experience belongs to the {relatedChapter?.city} chapter.
                  </h2>

                  <p className="mt-4 leading-8 text-black/68">
                    Explore the chapter to understand the wider cultural,
                    local, and hospitality setting around this experience.
                  </p>

                  <Link
                    href={chapterHref}
                    className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
                  >
                    Explore {relatedChapter?.city} →
                  </Link>
                </>
              ) : (
                <p className="mt-4 leading-8 text-black/68">
                  No chapter linked yet for this experience.
                </p>
              )}
            </div>

            <div className="mt-8 rounded-[2rem] bg-black px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                Why It Feels Different
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                More than a reservation. Closer to access.
              </h2>

              <p className="mt-4 leading-8 text-white/70">
                Food Theatre is built around atmosphere, curation, and people.
                The goal is not volume booking, but meaningful participation in
                a more memorable dining format.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Request Access
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Send your booking request.
            </h2>

            <p className="mt-5 text-base leading-8 text-black/68">
              Share your preferred date, guest count, and intent. This keeps the
              process more personal, selective, and aligned with the tone of the
              experience.
            </p>
          </div>

          <div>
            <BookingForm experienceTitle={experience.title} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
