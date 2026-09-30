import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/AppShell";
export const metadata: Metadata = {
  title: "ScaleSight × NATURANA — Size-to-Buy Planning",
  description:
    "An illustrative NATURANA × Understatement planning concept. Public catalog information and synthetic operating assumptions; analysis maintained by ScaleSight.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
