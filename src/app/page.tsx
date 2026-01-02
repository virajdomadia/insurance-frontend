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
      className={`h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700
      transition-opacity duration-700 ease-out
      ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <Loader2 className="h-8 w-8 md:h-10 md:w-10 text-white animate-spin mb-4" />

      <h1 className="text-2xl md:text-3xl font-bold text-white px-4 text-center">
        NGO Insurance
      </h1>

      <p className="text-xs md:text-sm text-blue-100 mt-2 transition-all duration-300 px-4 text-center">
        {messages[messageIndex]}
      </p>

      <div className="absolute bottom-4 md:bottom-6 text-xs text-blue-200 px-4 text-center">
        Demo environment · Investor preview
      </div>
    </div>
  );
}
