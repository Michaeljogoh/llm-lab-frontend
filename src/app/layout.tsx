import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import { ThemeProvider } from "@/provider/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Lab",
  description: "Parameter sweep and response analysis for Gemini experiments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReactQueryProvider>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
