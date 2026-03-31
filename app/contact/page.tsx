import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen text-black">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Contact
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Start a conversation
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Use this page for connections, collaborations, and general inquiries
            related to the platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <ContactForm />
      </section>

      <Footer />
    </main>
  );
}
