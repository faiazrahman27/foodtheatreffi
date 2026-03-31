import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

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
  cityRef?: {
    name?: string;
    country?: string;
  };
};

const chaptersQuery = groq`
  *[
    _type == "chapter"
    && (
      !defined($country)
      || $country == ""
      || cityRef->country == $country
      || country == $country
    )
    && (
      !defined($chapterStyle)
      || $chapterStyle == ""
      || chapterStyle->title == $chapterStyle
    )
  ] | order(city asc) {
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
    coverImage,
    cityRef->{
      name,
      country
    }
  }
`;

const countriesQuery = groq`
  array::unique([
    ...*[_type == "chapter" && defined(cityRef->country)].cityRef->country,
    ...*[_type == "chapter" && defined(country)].country
  ]) | order(@ asc)
`;

const chapterStylesQuery = groq`
  *[_type == "chapterStyle"] | order(title asc){
    title
  }
`;

export default async function ChaptersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    country?: string;
    chapterStyle?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCountry = resolvedSearchParams?.country || "";
  const selectedChapterStyle = resolvedSearchParams?.chapterStyle || "";

  const [chapters, countries, chapterStyles]: [
    Chapter[],
    string[],
    { title: string }[],
  ] = await Promise.all([
    sanityClient.fetch(chaptersQuery, {
      country: selectedCountry || null,
      chapterStyle: selectedChapterStyle || null,
    }),
    sanityClient.fetch(countriesQuery),
    sanityClient.fetch(chapterStylesQuery),
  ]);

  const hasActiveFilters = Boolean(
    selectedCountry || selectedChapterStyle
  );

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Chapters
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Explore the cities where Food Theatre takes on local form.
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Browse chapters by country and chapter style to understand how the
            platform expresses itself across different places.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-black/45">
                Filter Chapters
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Narrow the chapter landscape
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-black/65">
                Explore chapters by country and style to discover how local
                identity shapes the platform in each city.
              </p>
            </div>

            {hasActiveFilters ? (
              <Link
                href="/chapters"
                className="text-sm font-medium text-black/75 transition hover:text-black"
              >
                Clear Filters →
              </Link>
            ) : null}
          </div>

          <form
            method="GET"
            className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue={selectedCountry}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="chapterStyle"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                Chapter Style
              </label>
              <select
                id="chapterStyle"
                name="chapterStyle"
                defaultValue={selectedChapterStyle}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All chapter styles</option>
                {chapterStyles.map((style) => (
                  <option key={style.title} value={style.title}>
                    {style.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-full bg-black px-6 py-3 text-white transition hover:bg-black/85 md:w-auto"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">
              Results
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              {hasActiveFilters ? "Filtered Chapters" : "All Chapters"}
            </h2>
          </div>

          <p className="text-sm text-black/55">
            {chapters.length} {chapters.length === 1 ? "result" : "results"}
          </p>
        </div>

        {chapters.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-semibold">No chapters found</h3>
            <p className="mt-4 max-w-2xl leading-7 text-black/65">
              There are no chapters matching the current filters. Try clearing
              the filters or selecting a different country or chapter style.
            </p>
            <Link
              href="/chapters"
              className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
            >
              View All Chapters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {chapters.map((chapter) => {
              const imageUrl = chapter.coverImage
                ? urlFor(chapter.coverImage).width(1200).height(900).url()
                : null;

              const href = chapter.slug?.current
                ? `/chapters/${chapter.slug.current}`
                : "/chapters";

              const displayCity = chapter.cityRef?.name || chapter.city;
              const displayCountry = chapter.cityRef?.country || chapter.country;

              return (
                <Link
                  key={chapter._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={displayCity}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                      {displayCountry || "Chapter"}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {displayCity}
                    </h3>

                    {chapter.chapterStyle?.title ? (
                      <p className="mt-2 text-sm text-black/55">
                        {chapter.chapterStyle.title}
                      </p>
                    ) : null}

                    {chapter.shortDescription ? (
                      <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                        {chapter.shortDescription}
                      </p>
                    ) : null}

                    <p className="mt-6 text-sm font-medium text-black/80 transition group-hover:text-black">
                      View Chapter →
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
