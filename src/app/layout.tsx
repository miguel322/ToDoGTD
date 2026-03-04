import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/providers/ClientLayoutWrapper";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "ToDoGTD | Visual Task Management",
  description: "Next-gen GTD app inspired by Things 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex" suppressHydrationWarning>
        <AuthProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
