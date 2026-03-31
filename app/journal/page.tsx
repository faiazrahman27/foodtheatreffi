import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type JournalPost = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  category?: string;
  excerpt?: string;
  coverImage?: unknown;
  publishedAt?: string;
};

const journalQuery = groq`
  *[_type == "journalPost"] | order(publishedAt desc) {
    _id,
    title,
    slug {
      current
    },
    category,
    excerpt,
    coverImage,
    publishedAt
  }
`;

export default async function JournalPage() {
  const posts: JournalPost[] = await sanityClient.fetch(journalQuery);

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <PageHero
        eyebrow="Journal"
        title="Editorial perspectives on food, ritual, and hospitality."
        description="The journal gives Food Theatre a voice beyond listings — a space for ideas, stories, places, and people."
      />

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        {posts.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-semibold">No journal posts yet</h2>
            <p className="mt-4 text-black/65">
              Add and publish journal posts in Sanity Studio, then refresh this
              page.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? urlFor(post.coverImage).width(1200).height(900).url()
                : null;

              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              const hasSlug = Boolean(post.slug?.current);
              const href = hasSlug ? `/journal/${post.slug!.current}` : "/journal";

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
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/45">
                      {post.category ? <span>{post.category}</span> : null}
                      {formattedDate ? (
                        <>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </>
                      ) : null}
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold">
                      {post.title}
                    </h2>

                    {post.excerpt ? (
                      <p className="mt-4 line-clamp-4 leading-7 text-black/65">
                        {post.excerpt}
                      </p>
                    ) : null}

                    <p className="mt-6 text-sm font-medium text-black/80 transition group-hover:text-black">
                      {hasSlug ? "Read Article →" : "Slug missing"}
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