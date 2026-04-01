import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import Image from "next/image";

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
  format?: { title: string } | null;
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
    format,
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
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 md:pb-16 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-black/45">
              Food Theatre
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] md:text-7xl">
              Food as atmosphere, ritual, and experience.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-black/68">
              A curated platform where immersive dining, distinctive Food
              Characters, and city-based chapters come together into one living
              cultural ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/experiences">
                <Button className="rounded-full bg-black px-6 py-3 text-white hover:bg-black/85">
                  Explore Experiences
                </Button>
              </Link>

              <Link href="/characters">
                <Button
                  variant="outline"
                  className="rounded-full border-black bg-transparent px-6 py-3 text-black hover:bg-black/5"
                >
                  Meet Characters
                </Button>
              </Link>
            </div>

            <div className="mt-8 max-w-xl">
              <form
                action="/search"
                method="GET"
                className="rounded-[1.75rem] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  Search the Platform
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search experiences, characters, chapters, journal..."
                    className="w-full rounded-full border border-black/10 px-5 py-3 outline-none transition focus:border-black/20"
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-black/85"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-black/10 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-black/40">
                  Experiences
                </p>
                <p className="mt-2 text-xl font-semibold">Curated</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-black/40">
                  Characters
                </p>
                <p className="mt-2 text-xl font-semibold">Distinctive</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-black/40">
                  Chapters
                </p>
                <p className="mt-2 text-xl font-semibold">Local</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <HeroCarousel />

            <div className="mt-4">
              <Link
                href="/contact?type=general-contact"
                className="group block rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  General Inquiry
                </p>

                <h3 className="mt-4 text-2xl font-semibold">
                  Start a conversation
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-black/65">
                  Ask questions, explore ideas, or reach out about anything
                  related to Food Theatre.
                </p>

                <p className="mt-6 text-sm font-medium text-black/80 transition group-hover:text-black">
                  Go to Inquiry →
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Featured Experiences
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Curated formats with identity and atmosphere.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-black/65 md:justify-self-end">
            Discover dining formats that feel memorable before they are even
            booked — emotionally resonant, visually rich, and grounded in place.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {experiences.map((experience) => {
            const imageUrl = experience.coverImage
              ? urlFor(experience.coverImage).width(1200).height(900).url()
              : null;

            const href = experience.slug?.current
              ? `/experiences/${experience.slug.current}`
              : "/experiences";

            return (
              <Link
                key={experience._id}
                href={href}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={experience.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                    {[experience.city, experience.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    {experience.title}
                  </h3>
                  {experience.format ? (
                    <p className="mt-2 text-sm text-black/55">
                      {experience.format}
                    </p>
                  ) : null}
                  {experience.shortDescription ? (
                    <p className="mt-4 leading-7 text-black/65">
                      {experience.shortDescription}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/experiences"
            className="text-sm font-medium text-black/75 transition hover:text-black"
          >
            View More Experiences →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Food Characters
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              The people who bring the platform to life.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-black/65 md:justify-self-end">
            Meet the chefs, hosts, and creative personalities shaping each
            experience with their own craft, energy, and point of view.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {characters.map((character) => {
            const imageUrl = character.image
              ? urlFor(character.image).width(1200).height(1400).url()
              : null;

            const href = character.slug?.current
              ? `/characters/${character.slug.current}`
              : "/characters";

            return (
              <Link
                key={character._id}
                href={href}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-80 w-full overflow-hidden bg-neutral-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
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
                    <p className="mt-4 leading-7 text-black/65">
                      {character.bio}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/characters"
            className="text-sm font-medium text-black/75 transition hover:text-black"
          >
            View More Characters →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Chapters
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Cities become stages for Food Theatre.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-black/65 md:justify-self-end">
            Discover city-based chapters where local culture, hospitality, and
            creative communities shape the way Food Theatre comes to life.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {chapters.map((chapter) => {
            const imageUrl = chapter.coverImage
              ? urlFor(chapter.coverImage).width(1200).height(900).url()
              : null;

            const href = chapter.slug?.current
              ? `/chapters/${chapter.slug.current}`
              : "/chapters";

            return (
              <Link
                key={chapter._id}
                href={href}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-72 w-full overflow-hidden bg-neutral-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={chapter.city}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                    {chapter.country || "Chapter"}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    {chapter.city}
                  </h3>
                  {chapter.chapterStyle?.title ? (
                    <p className="mt-2 text-sm text-black/55">
                      {chapter.chapterStyle.title}
                    </p>
                  ) : null}
                  {chapter.shortDescription ? (
                    <p className="mt-4 leading-7 text-black/65">
                      {chapter.shortDescription}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/chapters"
            className="text-sm font-medium text-black/75 transition hover:text-black"
          >
            View More Chapters →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Journal
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Editorial perspectives around food, ritual, and hospitality.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-black/65 md:justify-self-end">
            Read reflections, ideas, and stories exploring the people, places,
            and cultural movements shaping a more meaningful food future.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journalPosts.map((post) => {
            const imageUrl = post.coverImage
              ? urlFor(post.coverImage).width(1200).height(900).url()
              : null;

            const href = post.slug?.current
              ? `/journal/${post.slug.current}`
              : "/journal";

            return (
              <Link
                key={post._id}
                href={href}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                    {post.category || "Journal"}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                  {post.excerpt ? (
                    <p className="mt-4 leading-7 text-black/65">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/journal"
            className="text-sm font-medium text-black/75 transition hover:text-black"
          >
            View More Journal Articles →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-black px-8 py-12 text-white md:px-14 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">
              Join the Movement
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Build, host, and experience the next stage of food culture.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/70">
              Whether you are a guest, a Food Character, a future Chapter, or a
              partner brand, Food Theatre is designed to connect people, places,
              and stories through food.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/become-a-character">
                <Button className="rounded-full bg-white px-6 py-3 text-black hover:bg-white/90">
                  Become a Food Character
                </Button>
              </Link>

              <Link href="/open-a-chapter">
                <Button
                  variant="outline"
                  className="rounded-full border-white bg-transparent px-6 py-3 text-white hover:bg-white/10"
                >
                  Open a Chapter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

