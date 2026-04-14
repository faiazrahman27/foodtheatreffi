"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

const COOKIE_EVENT = "food-theatre-cookie-consent";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(COOKIE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(COOKIE_EVENT, handleChange);
  };
}

function getConsentSnapshot() {
  if (typeof window === "undefined") {
    return "accepted";
  }

  return window.sessionStorage.getItem("cookie-consent");
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getConsentSnapshot, () => "accepted");
  const visible = consent === null;

  function persistConsent(value: "accepted" | "rejected") {
    window.sessionStorage.setItem("cookie-consent", value);
    window.dispatchEvent(new Event(COOKIE_EVENT));
  }

  function handleAccept() {
    persistConsent("accepted");
  }

  function handleReject() {
    persistConsent("rejected");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 animate-[slideUp_0.4s_ease]">
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Image
            src="/logoft.png"
            alt="Food Theatre"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />

          <div className="h-6 w-px bg-black/10" />

          <Image
            src="/images/ffilogo.png"
            alt="Future Food Institute"
            width={40}
            height={40}
            className="h-8 w-auto object-contain opacity-80"
          />
        </div>

        <div className="mt-5">
          <p className="text-sm uppercase tracking-[0.28em] text-black/45">
            Experimental Product
          </p>

          <p className="mt-3 text-sm leading-6 text-black/70">
            This is an experimental product of Future Food Institute. By
            continuing, you accept the use of cookies and acknowledge that all
            rights are reserved.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleAccept}
            className="rounded-full bg-black px-5 py-2.5 text-sm text-white transition hover:bg-black/85"
          >
            Accept
          </button>

          <button
            onClick={handleReject}
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm text-black transition hover:bg-black/5"
          >
            Reject
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 40px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
