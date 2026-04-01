import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type ExperienceResult = {
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
  tags?: string[];
  coverImage?: unknown;
  cityRef?: {
    name?: string;
    country?: string;
  };
};

type CharacterResult = {
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
  categories?: {
    _id: string;
    title: string;
  }[];
};

type ChapterResult = {
  _id: string;
  city: string;
  slug?: {
    current: string;
  };
  country?: string;
  shortDescription?: string;
  chapterStyle?: {
    title: string;
  };
  coverImage?: unknown;
  cityRef?: {
    name?: string;
    country?: string;
  };
};

type JournalResult = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  category?: string;
  excerpt?: string;
  coverImage?: unknown;
};

const experiencesSearchQuery = groq`
  *[
    _type == "experience" &&
    (
      !defined($searchQuery) || $searchQuery == "" ||
      title match $match ||
      shortDescription match $match ||
      cityRef->name match $match ||
      city match $match ||
      cityRef->country match $match ||
      country match $match ||
      format->title match $match
    ) &&
    (
      !defined($city) || $city == "" || cityRef->name == $city || city == $city
    ) &&
    (
      !defined($category) || $category == "" || $category in tags
    ) &&
    (
      !defined($format) || $format == "" || format->title == $format
    )
  ] | order(title asc)[0...12] {
    _id,
    title,
    slug { current },
    shortDescription,
    city,
    country,
    format->{
      title
    },
    tags,
    coverImage,
    cityRef->{
      name,
      country
    }
  }
`;

const charactersSearchQuery = groq`
  *[
    _type == "foodCharacter" &&
    (
      !defined($searchQuery) || $searchQuery == "" ||
      name match $match ||
      bio match $match ||
      cityRef->name match $match ||
      location match $match ||
      cityRef->country match $match ||
      country match $match ||
      $searchQuery in categories[]->title
    ) &&
    (
      !defined($city)
      || $city == ""
      || cityRef->name match $cityPattern
      || location match $cityPattern
    ) &&
    (
      !defined($category)
      || $category == ""
      || $category in categories[]->title
    )
  ] | order(name asc)[0...12] {
    _id,
    name,
    slug { current },
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

const chaptersSearchQuery = groq`
  *[
    _type == "chapter" &&
    (
      !defined($searchQuery) || $searchQuery == "" ||
      cityRef->name match $match ||
      city match $match ||
      cityRef->country match $match ||
      country match $match ||
      shortDescription match $match ||
      chapterStyle->title match $match
    ) &&
    (
      !defined($city) || $city == "" || cityRef->name == $city || city == $city
    ) &&
    (
      !defined($category)
      || $category == ""
      || chapterStyle->title == $category
    )
  ] | order(city asc)[0...12] {
    _id,
    city,
    slug { current },
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

const journalSearchQuery = groq`
  *[
    _type == "journalPost" &&
    (
      !defined($searchQuery) || $searchQuery == "" ||
      title match $match ||
      category match $match ||
      excerpt match $match
    ) &&
    (
      !defined($category) || $category == "" || category == $category
    )
  ] | order(publishedAt desc)[0...12] {
    _id,
    title,
    slug { current },
    category,
    excerpt,
    coverImage
  }
`;

const searchCitiesQuery = groq`
  array::unique([
    ...*[_type == "experience" && defined(cityRef->name)].cityRef->name,
    ...*[_type == "experience" && defined(city)].city,
    ...*[_type == "chapter" && defined(cityRef->name)].cityRef->name,
    ...*[_type == "chapter" && defined(city)].city,
    ...*[_type == "foodCharacter" && defined(cityRef->name)].cityRef->name,
    ...*[_type == "foodCharacter" && defined(location)].location
  ]) | order(@ asc)
`;

const searchCategoriesQuery = groq`
  array::unique([
    ...*[_type == "characterCategory"].title,
    ...*[_type == "chapterStyle"].title,
    ...*[_type == "experience" && defined(tags[])].tags[],
    ...*[_type == "journalPost" && defined(category)].category
  ]) | order(@ asc)
`;

const searchFormatsQuery = groq`
  array::unique(*[_type == "experience" && defined(format->title)].format->title) | order(@ asc)
`;

const characterCategoryOptionsQuery = groq`
  array::unique(*[_type == "characterCategory"].title) | order(@ asc)
`;

const chapterStyleOptionsQuery = groq`
  array::unique(*[_type == "chapterStyle"].title) | order(@ asc)
`;

const journalCategoryOptionsQuery = groq`
  array::unique(*[_type == "journalPost" && defined(category)].category) | order(@ asc)
`;

const experienceTagOptionsQuery = groq`
  array::unique(*[_type == "experience" && defined(tags[])].tags[]) | order(@ asc)
`;

const quickSuggestions = [
  "Napoli",
  "Firenze",
  "Bologna",
  "Seasonal",
  "Fine Dining",
  "Fire Cooking",
  "Ritual",
  "Tasting",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;

  const escaped = escapeRegExp(query.trim());
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-black/10 px-1 text-black">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

function SearchForm({
  defaultQuery,
  defaultType,
  defaultCity,
  defaultCategory,
  defaultFormat,
  cities,
  categories,
  formats,
}: {
  defaultQuery: string;
  defaultType: string;
  defaultCity: string;
  defaultCategory: string;
  defaultFormat: string;
  cities: string[];
  categories: string[];
  formats: string[];
}) {
  return (
    <form
      method="GET"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_0.9fr_auto]">
        <div>
          <label
            htmlFor="q"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            Keyword
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={defaultQuery}
            placeholder="Search experiences, characters, chapters, journal..."
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={defaultType}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
          >
            <option value="all">All</option>
            <option value="experiences">Experiences</option>
            <option value="characters">Characters</option>
            <option value="chapters">Chapters</option>
            <option value="journal">Journal</option>
          </select>
        </div>

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
            defaultValue={defaultCity}
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
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaultCategory}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="format"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            Experience Format
          </label>
          <select
            id="format"
            name="format"
            defaultValue={defaultFormat}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/20"
          >
            <option value="">All formats</option>
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-5 py-3 text-white transition hover:bg-black/85"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count: number;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-black/45">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h3>
      </div>

      <p className="text-sm text-black/55">
        {count} {count === 1 ? "result" : "results"}
      </p>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    city?: string;
    category?: string;
    format?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const query = (resolvedSearchParams?.q || "").trim();
  const selectedType = (resolvedSearchParams?.type || "all").trim();
  const selectedCity = (resolvedSearchParams?.city || "").trim();
  const selectedCategory = (resolvedSearchParams?.category || "").trim();
  const selectedFormat = (resolvedSearchParams?.format || "").trim();

  const searchQuery = query;
  const match = query ? `*${query}*` : null;
  const cityPattern = selectedCity ? `*${selectedCity}*` : null;

  const [
    cities,
    categories,
    formats,
    characterCategoryOptions,
    chapterStyleOptions,
    journalCategoryOptions,
    experienceTagOptions,
  ]: [
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
  ] = await Promise.all([
    sanityClient.fetch(searchCitiesQuery),
    sanityClient.fetch(searchCategoriesQuery),
    sanityClient.fetch(searchFormatsQuery),
    sanityClient.fetch(characterCategoryOptionsQuery),
    sanityClient.fetch(chapterStyleOptionsQuery),
    sanityClient.fetch(journalCategoryOptionsQuery),
    sanityClient.fetch(experienceTagOptionsQuery),
  ]);

  const categoryMatchesCharacters = selectedCategory
    ? characterCategoryOptions.includes(selectedCategory)
    : false;

  const categoryMatchesChapters = selectedCategory
    ? chapterStyleOptions.includes(selectedCategory)
    : false;

  const categoryMatchesJournal = selectedCategory
    ? journalCategoryOptions.includes(selectedCategory)
    : false;

  const categoryMatchesExperiences = selectedCategory
    ? experienceTagOptions.includes(selectedCategory)
    : false;

  const hasCategoryTarget =
    categoryMatchesCharacters ||
    categoryMatchesChapters ||
    categoryMatchesJournal ||
    categoryMatchesExperiences;

  const shouldShowExperiences =
    selectedType === "experiences" ||
    (selectedType === "all" &&
      (!!selectedFormat ||
        (!selectedCategory && !selectedFormat) ||
        categoryMatchesExperiences));

  const shouldShowCharacters =
    selectedType === "characters" ||
    (selectedType === "all" &&
      !selectedFormat &&
      (!selectedCategory || categoryMatchesCharacters) &&
      (!hasCategoryTarget || categoryMatchesCharacters));

  const shouldShowChapters =
    selectedType === "chapters" ||
    (selectedType === "all" &&
      !selectedFormat &&
      (!selectedCategory || categoryMatchesChapters) &&
      (!hasCategoryTarget || categoryMatchesChapters));

  const shouldShowJournal =
    selectedType === "journal" ||
    (selectedType === "all" &&
      !selectedFormat &&
      (!selectedCategory || categoryMatchesJournal) &&
      (!hasCategoryTarget || categoryMatchesJournal));

  const [experiences, characters, chapters, journalPosts]: [
    ExperienceResult[],
    CharacterResult[],
    ChapterResult[],
    JournalResult[],
  ] = await Promise.all([
    shouldShowExperiences
      ? sanityClient.fetch(experiencesSearchQuery, {
          searchQuery,
          match,
          city: selectedCity || null,
          category: selectedCategory || null,
          format: selectedFormat || null,
        })
      : Promise.resolve([]),
    shouldShowCharacters
      ? sanityClient.fetch(charactersSearchQuery, {
          searchQuery,
          match,
          city: selectedCity || null,
          cityPattern,
          category: selectedCategory || null,
        })
      : Promise.resolve([]),
    shouldShowChapters
      ? sanityClient.fetch(chaptersSearchQuery, {
          searchQuery,
          match,
          city: selectedCity || null,
          category: selectedCategory || null,
        })
      : Promise.resolve([]),
    shouldShowJournal
      ? sanityClient.fetch(journalSearchQuery, {
          searchQuery,
          match,
          category: selectedCategory || null,
        })
      : Promise.resolve([]),
  ]);

  const totalResults =
    experiences.length +
    characters.length +
    chapters.length +
    journalPosts.length;

  const hasSearch = Boolean(
    query ||
      selectedCity ||
      selectedCategory ||
      selectedFormat ||
      selectedType !== "all"
  );

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Search
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Search across the whole platform.
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Explore experiences, Food Characters, chapters, and journal entries
            from one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <SearchForm
          defaultQuery={query}
          defaultType={selectedType}
          defaultCity={selectedCity}
          defaultCategory={selectedCategory}
          defaultFormat={selectedFormat}
          cities={cities}
          categories={categories}
          formats={formats}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        {!hasSearch ? (
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-semibold">Start exploring</h2>
            <p className="mt-4 max-w-2xl leading-7 text-black/65">
              Try a city, format, category, person, or chapter. Search works
              across the full platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {quickSuggestions.map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item)}`}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/75 transition hover:bg-black/5 hover:text-black"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="mt-4 max-w-2xl leading-7 text-black/65">
              Nothing matched your current search. Try a broader keyword,
              another city, another category, another experience format, or
              switch the content type.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-full bg-black px-5 py-3 text-white transition hover:bg-black/85"
              >
                Clear Search
              </Link>
              <Link
                href="/experiences"
                className="rounded-full border border-black/10 px-5 py-3 text-black transition hover:bg-black/5"
              >
                Browse Experiences
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                  Results
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Search results
                </h2>
                <p className="mt-3 text-black/60">
                  {query ? <>Keyword: “{query}”</> : <>Browsing by filters</>}
                  {selectedCity ? <> · City: {selectedCity}</> : null}
                  {selectedCategory ? <> · Category: {selectedCategory}</> : null}
                  {selectedFormat ? (
                    <> · Experience Format: {selectedFormat}</>
                  ) : null}
                  {selectedType !== "all" ? <> · Type: {selectedType}</> : null}
                </p>
              </div>

              <p className="text-sm text-black/55">
                {totalResults} {totalResults === 1 ? "result" : "results"}
              </p>
            </div>

            {experiences.length > 0 ? (
              <section>
                <SectionHeader
                  eyebrow="Experiences"
                  title="Matching experiences"
                  count={experiences.length}
                />

                <div className="grid gap-6 md:grid-cols-3">
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

                          <h4 className="mt-3 text-2xl font-semibold">
                            {highlightText(experience.title, query)}
                          </h4>

                          {experience.format?.title ? (
                            <p className="mt-2 text-sm text-black/55">
                              {highlightText(experience.format.title, query)}
                            </p>
                          ) : null}

                          {experience.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
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
                            <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                              {highlightText(experience.shortDescription, query)}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {characters.length > 0 ? (
              <section>
                <SectionHeader
                  eyebrow="Food Characters"
                  title="Matching people"
                  count={characters.length}
                />

                <div className="grid gap-6 md:grid-cols-3">
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

                          <h4 className="mt-3 text-2xl font-semibold">
                            {highlightText(character.name, query)}
                          </h4>

                          <p className="mt-2 text-sm text-black/55">
                            {highlightText(
                              [displayCity, displayCountry].filter(Boolean).join(", "),
                              query
                            )}
                          </p>

                          {character.categories?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {character.categories.map((tag) => (
                                <span
                                  key={tag._id}
                                  className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65"
                                >
                                  {highlightText(tag.title, query)}
                                </span>
                              ))}
                            </div>
                          ) : null}

                          {character.bio ? (
                            <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                              {highlightText(character.bio, query)}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {chapters.length > 0 ? (
              <section>
                <SectionHeader
                  eyebrow="Chapters"
                  title="Matching cities"
                  count={chapters.length}
                />

                <div className="grid gap-6 md:grid-cols-3">
                  {chapters.map((chapter) => {
                    const imageUrl = chapter.coverImage
                      ? urlFor(chapter.coverImage).width(1200).height(900).url()
                      : null;

                    const href = chapter.slug?.current
                      ? `/chapters/${chapter.slug.current}`
                      : "/chapters";

                    const displayCity = chapter.cityRef?.name || chapter.city;
                    const displayCountry =
                      chapter.cityRef?.country || chapter.country;

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
                            {highlightText(displayCountry || "Chapter", query)}
                          </p>

                          <h4 className="mt-3 text-2xl font-semibold">
                            {highlightText(displayCity, query)}
                          </h4>

                          {chapter.chapterStyle?.title ? (
                            <p className="mt-2 text-sm text-black/55">
                              {highlightText(chapter.chapterStyle.title, query)}
                            </p>
                          ) : null}

                          {chapter.shortDescription ? (
                            <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                              {highlightText(chapter.shortDescription, query)}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {journalPosts.length > 0 ? (
              <section>
                <SectionHeader
                  eyebrow="Journal"
                  title="Matching writing"
                  count={journalPosts.length}
                />

                <div className="grid gap-6 md:grid-cols-3">
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
                        className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
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
                            {highlightText(post.category || "Journal", query)}
                          </p>

                          <h4 className="mt-3 text-2xl font-semibold">
                            {highlightText(post.title, query)}
                          </h4>

                          {post.excerpt ? (
                            <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                              {highlightText(post.excerpt, query)}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}