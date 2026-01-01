'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const messages = [
  "Initializing services…",
  "Loading policy modules…",
  "Connecting NGO partners…",
  "Preparing dashboards…",
];

export default function LoaderPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 600);

    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 2600);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center bg-white
      transition-opacity duration-700 ease-out
      ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />

      <h1 className="text-3xl font-bold text-indigo-600">
        NGO Insurance
      </h1>

      <p className="text-sm text-slate-500 mt-2 transition-all duration-300">
        {messages[messageIndex]}
      </p>

      <div className="absolute bottom-6 text-xs text-slate-400">
        Demo environment · Investor preview
      </div>
    </div>
  );
}
