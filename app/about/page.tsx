import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <PageHero
        eyebrow="About"
        title="Food Theatre is a curated stage for food, culture, and human connection."
        description="It is built on a simple belief: food is not just something we consume. It is a language, a ritual, a stage, and a system for creating connection."
      />

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <div className="space-y-8 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-12">
          <div>
            <h2 className="text-2xl font-semibold">What Food Theatre is</h2>
            <p className="mt-4 leading-8 text-black/65">
              Food Theatre is a platform built around experiences, Food
              Characters, and chapters. It combines hospitality, storytelling,
              and culture into a curated ecosystem rather than a simple
              transactional marketplace.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">What makes it different</h2>
            <p className="mt-4 leading-8 text-black/65">
              Unlike open marketplaces, Food Theatre is based on curation,
              atmosphere, identity, and meaningful formats. It is designed to
              make food feel memorable, local, and emotionally resonant.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Why it matters</h2>
            <p className="mt-4 leading-8 text-black/65">
              The food world has restaurants, operators, and content — but what
              is missing is a system that meaningfully connects them into a
              larger cultural and experiential platform. Food Theatre aims to
              become that system.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}