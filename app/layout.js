// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevHub",
  description: "A hub of tools for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#181c1c] text-white`}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <main className="p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
