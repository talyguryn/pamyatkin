import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Памяткин',
  description: 'Сервис для создания памяток',
};

export const viewport: Viewport = {
  initialScale: undefined,
  width: undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
