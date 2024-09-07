import { Inter } from "next/font/google";
import "./globals.css"; // Import global styles for the entire app
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevHub",
  description: "A hub of tools for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
