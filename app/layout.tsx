
import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  "https://prabaselvam-invitation-oct-25.vercel.app";

const title = "Raja Praba weds Selvam";

const description =
  "A little Cupid invites you to celebrate Raja Praba and Selvam on 25 October 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title,
  description,

  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
    images: [
      {
        url: "/images/wedding-share-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Cupid carrying the wedding invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/wedding-share-preview.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
