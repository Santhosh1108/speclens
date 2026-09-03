"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return;

    posthog.init(key, {
      api_host: apiHost,
      capture_pageview: true,
      capture_pageleave: true,
    });

    return () => {
      posthog.reset();
    };
  }, []);

  return null;
}
