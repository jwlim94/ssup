import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 메타데이터 설정
 * - SEO 및 소셜 미디어 공유용
 */
export const metadata: Metadata = {
  title: "SSUP - Location-based Anonymous Posts",
  description:
    "Share and discover anonymous posts within 5km of your location. Posts expire after 24 hours.",
  keywords: ["anonymous", "location-based", "social", "posts", "nearby"],
  authors: [{ name: "SSUP" }],
  openGraph: {
    title: "SSUP - Location-based Anonymous Posts",
    description:
      "Share and discover anonymous posts within 5km of your location.",
    type: "website",
  },
};

/**
 * 뷰포트 설정
 * - 모바일 최적화
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // 모바일에서 확대 방지
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
