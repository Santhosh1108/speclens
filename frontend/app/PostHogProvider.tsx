"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider() {
  useEffect(() => {
    posthog.init("phc_ys7fsXsuaPVUCnZsW9gXhrUF4W9LKC2cLvYDDS3uace7", {
      api_host: "https://us.i.posthog.com",
      capture_pageview: true,
    });

    posthog.capture("speclens_test_event", {
      source: "manual_test",
    });
  }, []);

  return null;
}