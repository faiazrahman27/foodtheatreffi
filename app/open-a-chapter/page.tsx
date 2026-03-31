import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ChapterApplicationForm } from "@/components/chapter-application-form";

export default function OpenAChapterPage() {
  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Chapter Applications
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Open a Chapter
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Food Theatre grows through strong local chapters. If you want to
            bring the platform to your city, tell us about your place, your
            network, and your vision.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <ChapterApplicationForm />
      </section>

      <Footer />
    </main>
  );
}