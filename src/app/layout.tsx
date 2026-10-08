import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/AppShell";
export const metadata: Metadata = {
  title: "Fishwife × ScaleSight — Supply Commitment Planning",
  description:
    "A prepared Fishwife supply planning room. Illustrative operating inputs; analysis maintained by ScaleSight. Decisions made with Fishwife.",
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
