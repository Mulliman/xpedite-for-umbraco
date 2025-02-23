import type { Metadata } from "next";
import React from 'react';
import "./globals.css";

export default function RootLayout({
  children
}:
  Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

export const metadata: Metadata =  {
  title: {
    template: '%s | XPEDITE',
    default: ''
  },
  description: 'A demo website created with NextJS and Umbraco',
}