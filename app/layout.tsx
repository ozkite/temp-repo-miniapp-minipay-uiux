import type { Metadata } from "next";
import { Inter, Pixelify_Sans } from "next/font/google"; // Or use the one from ref but Inter is safe
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: '--font-pixelify' });

export const metadata: Metadata = {
  title: "MiniPay SwipePad",
  description: "Swipe to support projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
