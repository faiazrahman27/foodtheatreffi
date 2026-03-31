import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

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
  };
  coverImage?: unknown;
  cityRef?: {
    name?: string;
    country?: string;
  };
};

const experiencesQuery = groq`
  *[
    _type == "experience"
    && (
      !defined($city)
      || $city == ""
      || cityRef->name == $city
      || city == $city
    )
    && (
      !defined($format)
      || $format == ""
      || format->title == $format
    )
  ] | order(title asc) {
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
    coverImage,
    cityRef->{
      name,
      country
    }
  }
`;

const citiesQuery = groq`
  array::unique([
    ...*[_type == "experience" && defined(cityRef->name)].cityRef->name,
    ...*[_type == "experience" && defined(city)].city
  ]) | order(@ asc)
`;

const formatsQuery = groq`
  *[_type == "experienceFormat"] | order(title asc){
    title
  }
`;

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    city?: string;
    format?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCity = resolvedSearchParams?.city || "";
  const selectedFormat = resolvedSearchParams?.format || "";

  const [experiences, cities, formats]: [
    Experience[],
    string[],
    { title: string }[],
  ] = await Promise.all([
    sanityClient.fetch(experiencesQuery, {
      city: selectedCity || null,
      format: selectedFormat || null,
    }),
    sanityClient.fetch(citiesQuery),
    sanityClient.fetch(formatsQuery),
  ]);

  const hasActiveFilters = Boolean(selectedCity || selectedFormat);

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Experiences
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Explore immersive dining formats with identity and atmosphere.
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Browse curated experiences across cities, formats, and distinctive
            hospitality styles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-black/45">
                Filter Experiences
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Narrow the experience landscape
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-black/65">
                Use filters to explore by city and format. This keeps browsing
                intentional and helps the platform feel more discoverable.
              </p>
            </div>

            {hasActiveFilters ? (
              <Link
                href="/experiences"
                className="text-sm font-medium text-black/75 transition hover:text-black"
              >
                Clear Filters →
              </Link>
            ) : null}
          </div>

          <form method="GET" className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                City
              </label>
              <select
                id="city"
                name="city"
                defaultValue={selectedCity}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="format"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                Format
              </label>
              <select
                id="format"
                name="format"
                defaultValue={selectedFormat}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All formats</option>
                {formats.map((format) => (
                  <option key={format.title} value={format.title}>
                    {format.title}
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
              {hasActiveFilters ? "Filtered Experiences" : "All Experiences"}
            </h2>
          </div>

          <p className="text-sm text-black/55">
            {experiences.length} {experiences.length === 1 ? "result" : "results"}
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-semibold">No experiences found</h3>
            <p className="mt-4 max-w-2xl leading-7 text-black/65">
              There are no experiences matching the current filters. Try clearing
              the filters or selecting a different city or format.
            </p>
            <Link
              href="/experiences"
              className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
            >
              View All Experiences
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {experiences.map((experience) => {
              const imageUrl = experience.coverImage
                ? urlFor(experience.coverImage).width(1200).height(900).url()
                : null;

              const href = experience.slug?.current
                ? `/experiences/${experience.slug.current}`
                : "/experiences";

              const displayCity = experience.cityRef?.name || experience.city;
              const displayCountry =
                experience.cityRef?.country || experience.country;

              return (
                <Link
                  key={experience._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
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
                      {[displayCity, displayCountry].filter(Boolean).join(" · ")}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
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

      <Footer />
    </main>
  );
}
