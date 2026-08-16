import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}