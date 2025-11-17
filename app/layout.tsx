import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mocker - AI-Powered Mock Technical Interviews",
  description: "Practice technical interviews with an AI interviewer that behaves like a human",
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
