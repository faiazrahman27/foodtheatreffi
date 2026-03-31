"use client";

import { useState } from "react";

export function CharacterApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cuisineStyle, setCuisineStyle] = useState("");
  const [publicBio, setPublicBio] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [story, setStory] = useState("");
  const [characterPhoto, setCharacterPhoto] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!characterPhoto) {
      setError("Please upload a character photo.");
      return;
    }

    if (!cvFile) {
      setError("Please upload a CV file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("cuisineStyle", cuisineStyle);
      formData.append("publicBio", publicBio);
      formData.append("portfolioLink", portfolioLink);
      formData.append("story", story);
      formData.append("characterPhoto", characterPhoto);
      formData.append("cvFile", cvFile);

      const response = await fetch("/api/character-application", {
        method: "POST",
        body: formData,
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
      setCity("");
      setCountry("");
      setCuisineStyle("");
      setPublicBio("");
      setPortfolioLink("");
      setStory("");
      setCharacterPhoto(null);
      setCvFile(null);
    } catch (err) {
      console.error("Character application fetch error:", err);
      setError("Could not send the application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-semibold">Application sent</h2>
        <p className="mt-4 text-black/65">
          Thank you for applying to Food Theatre. We will review your submission
          and get back to you.
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
          Food Character Application
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Tell us who you are and what you bring.
        </h2>
        <p className="mt-3 leading-7 text-black/65">
          Apply with a strong public-facing bio, a deeper internal story, a
          photo, and a CV so your profile can be reviewed properly.
        </p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">City</label>
          <input
            required
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
            placeholder="Bologna"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Country</label>
          <input
            required
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
            placeholder="Italy"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Cuisine / Style / Format
        </label>
        <input
          required
          type="text"
          value={cuisineStyle}
          onChange={(e) => setCuisineStyle(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Mediterranean, open-fire, tasting menus, ritual dining..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Public Bio</label>
        <textarea
          required
          rows={5}
          value={publicBio}
          onChange={(e) => setPublicBio(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Write a short profile-style bio that could later appear on your public Food Character page."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Instagram / Website / Portfolio
        </label>
        <input
          type="url"
          value={portfolioLink}
          onChange={(e) => setPortfolioLink(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Story / Why You Fit Food Theatre
        </label>
        <textarea
          required
          rows={6}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Tell us more deeply about your identity, hospitality style, background, and why you belong in Food Theatre."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Character Photo</label>
        <input
          required
          type="file"
          accept="image/*"
          onChange={(e) => setCharacterPhoto(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">CV File</label>
        <input
          required
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-black py-3 text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Application"}
      </button>
    </form>
  );
}
