"use client";
import React, { useEffect, useState } from "react";

export default function InitialLoader({ onFinish }: { onFinish?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 5000);
    return () => clearTimeout(t);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-6 px-6">
        <div className="relative flex items-center justify-center">
          <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg">
            <svg
              className="w-24 h-24 text-white drop-shadow-md animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2L3 6v5c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V6l-9-4z"
                fill="currentColor"
              />
              <path
                d="M9.5 11.5c.7-1 2-1.8 3.5-1.5 1.4.3 2.5 1.6 2.5 3.2 0 2-2.5 4.1-5 4.1S7.5 15.2 7.5 13.3c0-1.2.7-2.3 2-2.8z"
                fill="rgba(255,255,255,0.85)"
              />
            </svg>
          </div>
          <div className="absolute -bottom-6 w-28 h-2 rounded-full bg-blue-200/70 animate-pulse" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-blue-700">Insurance Co.</h1>
          <p className="text-sm text-blue-500">Protecting what matters most</p>
        </div>

        <div className="w-48 h-2 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 animate-[marquee_2.2s_linear_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(-100%);} to { transform: translateX(100%);} }
      `}</style>
    </div>
  );
}
