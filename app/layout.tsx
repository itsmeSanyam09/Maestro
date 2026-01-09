import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignUp } from "@clerk/nextjs";
import Header from "./components/Navbar";
import Footer from "./components/Footer";
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and create a budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={roboto.className} suppressHydrationWarning>
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
