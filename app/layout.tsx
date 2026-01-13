import type { Metadata, Viewport } from "next";
import { Poppins, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Messenger",
    default: "Messenger",
  },
  description:
    "Real-time messaging application. Stay connected with friends and colleagues.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  keywords: ["messenger", "chat", "real-time", "messaging", "communication"],
  openGraph: {
    title: "Messenger",
    description: "Real-time messaging application",
    type: "website",
    locale: "en_US",
    siteName: "Messenger",
  },
  twitter: {
    card: "summary",
    title: "Messenger",
    description: "Real-time messaging application",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable} h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div
            className="pointer-events-none fixed inset-0 -z-30 opacity-5"
            style={{ backgroundImage: "url(/grain.jpg)" }}
          />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
