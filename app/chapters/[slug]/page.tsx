import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type ChapterDetail = {
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

const chapterBySlugQuery = groq`
  *[_type == "chapter" && slug.current == $slug][0]{
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

const chapterSlugsQuery = groq`
  *[_type == "chapter" && defined(slug.current)]{
    "slug": slug.current
  }
`;

const relatedExperiencesQuery = groq`
  *[
    _type == "experience" &&
    (
      chapter._ref == $chapterId
      || (!defined(chapter) && city == $city)
    )
  ] | order(title asc)[0...6]{
    _id,
    title,
    slug {
      current
    },
    shortDescription,
    format->{
      title
    },
    city,
    country,
    coverImage
  }
`;

const localCharactersQuery = groq`
  *[
    _type == "foodCharacter" &&
    (
      chapter._ref == $chapterId
      || (!defined(chapter) && location match $locationPattern)
    )
  ] | order(name asc)[0...6]{
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

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(chapterSlugsQuery);
  return slugs.map((item) => ({ slug: item.slug }));
}

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const chapter: ChapterDetail | null = await sanityClient.fetch(
    chapterBySlugQuery,
    { slug }
  );

  if (!chapter) {
    notFound();
  }

  const [relatedExperiences, localCharacters]: [Experience[], FoodCharacter[]] =
    await Promise.all([
      sanityClient.fetch(relatedExperiencesQuery, {
        chapterId: chapter._id,
        city: chapter.city,
      }),
      sanityClient.fetch(localCharactersQuery, {
        chapterId: chapter._id,
        locationPattern: `*${chapter.city}*`,
      }),
    ]);

  const imageUrl = chapter.coverImage
    ? urlFor(chapter.coverImage).width(1800).height(1300).url()
    : null;

  const collaborationHref = `/contact?type=chapter-collaboration&subject=${encodeURIComponent(
    `Propose collaboration for ${chapter.city}`
  )}&context=${encodeURIComponent(chapter.city)}`;

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10 md:pb-10 md:pt-16">
        <Link
          href="/chapters"
          className="text-sm text-black/60 transition hover:text-black"
        >
          ← Back to Chapters
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
                    alt={chapter.city}
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
              Chapter
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.04] md:text-6xl">
              {chapter.city}
            </h1>

            <p className="mt-5 text-lg leading-8 text-black/68">
              {chapter.country || "Location not specified"}
            </p>

            {chapter.chapterStyle?.title ? (
              <div className="mt-6">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65">
                  {chapter.chapterStyle.title}
                </span>
              </div>
            ) : null}

            {chapter.shortDescription ? (
              <p className="mt-8 text-lg leading-8 text-black/68">
                {chapter.shortDescription}
              </p>
            ) : null}

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  City
                </p>
                <p className="mt-3 text-lg font-medium">
                  {chapter.city || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Country
                </p>
                <p className="mt-3 text-lg font-medium">
                  {chapter.country || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Chapter Style
                </p>
                <p className="mt-3 text-lg font-medium">
                  {chapter.chapterStyle?.title || "Not specified"}
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Role
                </p>
                <p className="mt-3 text-lg font-medium">
                  Cultural and hospitality stage
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                Chapter Identity
              </p>

              <h2 className="mt-4 text-2xl font-semibold">
                A city becomes a stage for food culture.
              </h2>

              <p className="mt-4 leading-8 text-black/68">
                A Food Theatre chapter is more than geography. It is a local
                expression of atmosphere, hospitality, cultural rhythm, and
                creative identity. Through people, venues, and formats, each
                chapter shapes its own tone.
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] bg-black px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                Collaborate
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                Bring an idea, venue, or partnership into this city.
              </h2>

              <p className="mt-4 leading-8 text-white/70">
                Use this chapter as a starting point for local collaborations,
                venue concepts, programming ideas, cultural formats, or future
                hospitality partnerships.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={collaborationHref}
                  className="rounded-full bg-white px-6 py-3 text-black transition hover:bg-white/90"
                >
                  Propose Collaboration
                </Link>
                <Link
                  href="/open-a-chapter"
                  className="rounded-full border border-white/20 px-6 py-3 text-white transition hover:bg-white/10"
                >
                  Open a Chapter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-black/45">
            Experiences in {chapter.city}
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Curated formats shaped by this city.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-black/65">
            Explore experiences connected to the chapter and discover how local
            culture, tone, and hospitality translate into format.
          </p>
        </div>

        {relatedExperiences.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-black/65">
              No experiences linked to this chapter yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {relatedExperiences.map((experience) => {
              const relatedImageUrl = experience.coverImage
                ? urlFor(experience.coverImage).width(1200).height(900).url()
                : null;

              const href = experience.slug?.current
                ? `/experiences/${experience.slug.current}`
                : "/experiences";

              return (
                <Link
                  key={experience._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                    {relatedImageUrl ? (
                      <Image
                        src={relatedImageUrl}
                        alt={experience.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">
                      {experience.title}
                    </h3>

                    {experience.format?.title ? (
                      <p className="mt-2 text-sm text-black/55">
                        {experience.format.title}
                      </p>
                    ) : null}

                    {experience.shortDescription ? (
                      <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                        {experience.shortDescription}
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

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-black/45">
            Food Characters in {chapter.city}
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            The people shaping the atmosphere here.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-black/65">
            Meet the chefs, hosts, and creative presences who help define how
            this chapter feels in practice.
          </p>
        </div>

        {localCharacters.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-black/65">
              No Food Characters linked to this chapter yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {localCharacters.map((character) => {
              const characterImageUrl = character.image
                ? urlFor(character.image).width(1200).height(1400).url()
                : null;

              const href = character.slug?.current
                ? `/characters/${character.slug.current}`
                : "/characters";

              return (
                <Link
                  key={character._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-80 w-full overflow-hidden bg-neutral-100">
                    {characterImageUrl ? (
                      <Image
                        src={characterImageUrl}
                        alt={character.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                      Food Character
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {character.name}
                    </h3>

                    {character.categories?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
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
                      <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                        {character.bio}
                      </p>
                    ) : null}

                    <p className="mt-6 text-sm font-medium text-black/80 transition group-hover:text-black">
                      View Profile →
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
