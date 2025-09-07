
import type {Metadata} from 'next';
import { cn } from "@/lib/utils";
import './globals.css';

export const metadata: Metadata = {
  title: 'Prarambh BCA 2025: Echoes of Tomorrow',
  description: "Join us for an evening of dreams, music, and memories at the Prarambh BCA 2025 fresher's party.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        {children}
      </body>
    </html>
  );
}
