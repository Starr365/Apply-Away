"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as unknown as { workbox?: unknown }).workbox === undefined
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          logger.info("Service Worker registered successfully with scope:", reg.scope);
        })
        .catch((err) => {
          logger.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
