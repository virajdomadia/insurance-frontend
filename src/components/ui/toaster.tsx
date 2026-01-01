"use client";

import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={cn(
            "w-80 rounded-md border p-4 shadow-lg bg-white",
            variant === "destructive" && "border-red-500"
          )}
        >
          {title && <p className="font-medium">{title}</p>}
          {description && (
            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
