import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Памяткин',
  description: 'Сервис для создания памяток',
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

        {/* Temporary disable viewport for mobiles */}
        <meta name="viewport" content="viewport-fit=cover" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
