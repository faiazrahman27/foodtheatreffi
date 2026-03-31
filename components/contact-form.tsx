"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function getDefaultTitle(type: string, context: string) {
  if (type === "character-connection") {
    return context
      ? `Connect about ${context}`
      : "Connect about a Food Character";
  }

  if (type === "chapter-collaboration") {
    return context
      ? `Propose collaboration for ${context}`
      : "Propose a chapter collaboration";
  }

  return "General Inquiry";
}

function getDefaultDescription(type: string, context: string) {
  if (type === "character-connection") {
    return context
      ? `Send a message about ${context}. This can be used for collaboration, hosting interest, curatorial ideas, or future experience formats.`
      : "Send a message about a Food Character.";
  }

  if (type === "chapter-collaboration") {
    return context
      ? `Send a collaboration idea related to ${context}. This can be used for local partnerships, venue ideas, cultural collaborations, or future chapter concepts.`
      : "Send a collaboration message about a chapter.";
  }

  return "Send a message and we’ll review it from the admin side.";
}

export function ContactForm() {
  const searchParams = useSearchParams();

  const inquiryType = searchParams.get("type") || "general-contact";
  const subject = searchParams.get("subject") || "";
  const context = searchParams.get("context") || "";
  const characterSlug = searchParams.get("characterSlug") || "";

  const pageTitle = useMemo(
    () => getDefaultTitle(inquiryType, context),
    [inquiryType, context]
  );

  const pageDescription = useMemo(
    () => getDefaultDescription(inquiryType, context),
    [inquiryType, context]
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/general-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inquiryType,
          subject: subject || pageTitle,
          contextLabel: context,
          characterSlug,
          fullName,
          email,
          message,
        }),
      });

      const text = await response.text();
      let data: { error?: string; success?: boolean } = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(data.error || `Request failed with status ${response.status}.`);
        return;
      }

      setSubmitted(true);
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("General inquiry fetch error:", err);
      setError("Could not send your message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-semibold">Message sent</h2>
        <p className="mt-4 text-black/65">
          Thanks for reaching out. Your inquiry has been sent successfully.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-black/45">
          Contact
        </p>
        <h2 className="mt-3 text-2xl font-semibold">{pageTitle}</h2>
        <p className="mt-3 leading-7 text-black/65">{pageDescription}</p>
      </div>

      {context ? (
        <div className="rounded-xl bg-black/5 px-4 py-3 text-sm text-black/70">
          Context: <span className="font-medium text-black">{context}</span>
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium">Full Name</label>
        <input
          required
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Message</label>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Write your message here."
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-black py-3 text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
