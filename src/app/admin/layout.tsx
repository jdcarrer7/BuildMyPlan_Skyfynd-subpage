import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skyfynd OMD",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
