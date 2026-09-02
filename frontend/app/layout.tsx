import type { Metadata } from "next";
import "./globals.css";
import PostHogProvider from "./PostHogProvider";

export const metadata: Metadata = {
  title: "SpecLens",
  description: "Turn product ideas into PRDs and MVP prototypes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <PostHogProvider />
        {children}
      </body>
    </html>
  );
}
