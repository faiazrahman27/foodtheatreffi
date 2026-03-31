import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type FoodCharacter = {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
  bio?: string;
  location?: string;
  country?: string;
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
};

const charactersQuery = groq`
  *[
    _type == "foodCharacter"
    && (
      !defined($location)
      || $location == ""
      || cityRef->name match $locationPattern
      || location match $locationPattern
    )
    && (
      !defined($category)
      || $category == ""
      || $category in categories[]->title
    )
  ] | order(name asc) {
    _id,
    name,
    slug {
      current
    },
    bio,
    location,
    country,
    image,
    cityRef->{
      name,
      country
    },
    categories[]->{
      _id,
      title
    }
  }
`;

const locationsQuery = groq`
  array::unique([
    ...*[_type == "foodCharacter" && defined(cityRef->name)].cityRef->name,
    ...*[_type == "foodCharacter" && defined(location)].location
  ]) | order(@ asc)
`;

const categoriesQuery = groq`
  *[_type == "characterCategory"] | order(title asc){
    _id,
    title
  }
`;

export default async function CharactersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    location?: string;
    category?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedLocation = resolvedSearchParams?.location || "";
  const selectedCategory = resolvedSearchParams?.category || "";

  const [characters, locations, categories]: [
    FoodCharacter[],
    string[],
    { _id: string; title: string }[],
  ] = await Promise.all([
    sanityClient.fetch(charactersQuery, {
      location: selectedLocation || null,
      locationPattern: selectedLocation ? `*${selectedLocation}*` : null,
      category: selectedCategory || null,
    }),
    sanityClient.fetch(locationsQuery),
    sanityClient.fetch(categoriesQuery),
  ]);

  const hasActiveFilters = Boolean(selectedLocation || selectedCategory);

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Food Characters
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Explore the people who shape the tone of the platform.
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Browse chefs, hosts, and creative food personalities by location and
            category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-black/45">
                Filter Characters
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Narrow the people behind the platform
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-black/65">
                Explore by location and category to discover the people most
                relevant to the atmosphere or city you’re interested in.
              </p>
            </div>

            {hasActiveFilters ? (
              <Link
                href="/characters"
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
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                Location
              </label>
              <select
                id="location"
                name="location"
                defaultValue={selectedLocation}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-black/75"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={selectedCategory}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.title}>
                    {category.title}
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
              {hasActiveFilters ? "Filtered Characters" : "All Characters"}
            </h2>
          </div>

          <p className="text-sm text-black/55">
            {characters.length} {characters.length === 1 ? "result" : "results"}
          </p>
        </div>

        {characters.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-semibold">No characters found</h3>
            <p className="mt-4 max-w-2xl leading-7 text-black/65">
              There are no Food Characters matching the current filters. Try
              clearing the filters or selecting a different location or category.
            </p>
            <Link
              href="/characters"
              className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
            >
              View All Characters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {characters.map((character) => {
              const imageUrl = character.image
                ? urlFor(character.image).width(1200).height(1400).url()
                : null;

              const href = character.slug?.current
                ? `/characters/${character.slug.current}`
                : "/characters";

              const displayCity = character.cityRef?.name || character.location;
              const displayCountry =
                character.cityRef?.country || character.country;

              return (
                <Link
                  key={character._id}
                  href={href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
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

                    {displayCity ? (
                      <p className="mt-2 text-sm text-black/55">
                        {[displayCity, displayCountry].filter(Boolean).join(", ")}
                      </p>
                    ) : null}

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
