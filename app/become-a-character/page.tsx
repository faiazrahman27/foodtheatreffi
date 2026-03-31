import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CharacterApplicationForm } from "@/components/character-application-form";

export default function BecomeACharacterPage() {
  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Applications
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Become a Food Character
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Food Theatre is built around distinctive people with craft, story,
            hospitality, and presence. If you want to become part of the
            platform, send your application below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <CharacterApplicationForm />
      </section>

      <Footer />
    </main>
  );
}