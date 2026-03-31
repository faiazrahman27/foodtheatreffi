import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

type JournalPostDetail = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  category?: string;
  excerpt?: string;
  coverImage?: unknown;
  publishedAt?: string;
  content?: unknown[];
};

type RelatedPost = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  category?: string;
};

const postBySlugQuery = groq`
  *[_type == "journalPost" && slug.current == $slug][0]{
    _id,
    title,
    slug {
      current
    },
    category,
    excerpt,
    coverImage,
    publishedAt,
    content
  }
`;

const postSlugsQuery = groq`
  *[_type == "journalPost" && defined(slug.current)]{
    "slug": slug.current
  }
`;

const relatedPostsQuery = groq`
  *[_type == "journalPost" && category == $category && slug.current != $slug] | order(publishedAt desc)[0...3]{
    _id,
    title,
    slug {
      current
    },
    category
  }
`;

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(postSlugsQuery);
  return slugs.map((item) => ({ slug: item.slug }));
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post: JournalPostDetail | null = await sanityClient.fetch(
    postBySlugQuery,
    { slug }
  );

  if (!post) {
    notFound();
  }

  const relatedPosts: RelatedPost[] = post.category
    ? await sanityClient.fetch(relatedPostsQuery, {
        category: post.category,
        slug,
      })
    : [];

  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1600).height(1000).url()
    : null;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-8 pt-10 md:pb-12 md:pt-16">
        <Link
          href="/journal"
          className="text-sm text-black/60 transition hover:text-black"
        >
          ← Back to Journal
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/45">
            {post.category ? <span>{post.category}</span> : null}
            {formattedDate ? (
              <>
                <span>•</span>
                <span>{formattedDate}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-6 text-xl leading-9 text-black/68">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </section>

      {imageUrl ? (
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <div className="relative h-[320px] w-full md:h-[620px]">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-6 pb-16 md:pb-24">
        <div className="rounded-[2rem] bg-white px-8 py-10 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:px-12 md:py-14">
          <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-p:text-black/75 prose-p:leading-8">
            {post.content && post.content.length > 0 ? (
              <PortableText value={post.content as any} />
            ) : (
              <p>No article content added yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <div className="rounded-[2rem] bg-black px-8 py-10 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">
            Continue Reading
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            Explore more ideas from the journal.
          </h2>

          {relatedPosts.length === 0 ? (
            <p className="mt-4 leading-8 text-white/70">
              No related articles yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => {
                const href = relatedPost.slug?.current
                  ? `/journal/${relatedPost.slug.current}`
                  : "/journal";

                return (
                  <Link
                    key={relatedPost._id}
                    href={href}
                    className="rounded-[1.5rem] border border-white/10 p-5 transition hover:bg-white/5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                      {relatedPost.category || "Journal"}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold">
                      {relatedPost.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}