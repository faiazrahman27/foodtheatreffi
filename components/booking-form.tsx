"use client";

import { useState } from "react";

type BookingFormProps = {
  experienceTitle: string;
};

export function BookingForm({ experienceTitle }: BookingFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceTitle,
          fullName,
          email,
          preferredDate,
          guestCount,
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
      setPreferredDate("");
      setGuestCount("");
      setMessage("");
    } catch (err) {
      console.error("Booking form fetch error:", err);
      setError("Could not send the booking request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <h3 className="text-2xl font-semibold">Request sent</h3>
        <p className="mt-4 text-black/65">
          Your booking request has been sent successfully.
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
          Booking Request
        </p>
        <h3 className="mt-3 text-2xl font-semibold">
          Request booking for {experienceTitle}
        </h3>
        <p className="mt-3 leading-7 text-black/65">
          Fill in your details and send your request.
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

      <div>
        <label className="mb-2 block text-sm font-medium">Preferred Date</label>
        <input
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Number of Guests
        </label>
        <input
          type="number"
          min="1"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Message</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-black/20"
          placeholder="Tell us what kind of experience you are looking for."
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-black py-3 text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
