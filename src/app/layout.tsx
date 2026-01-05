import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildMyPlan | SkyFynd - Build Your Custom Service Package",
  description: "Create your perfect digital marketing and creative services package. Browse our services, select your tier, and get an instant quote.",
  keywords: "digital marketing, web design, branding, content strategy, SkyFynd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
