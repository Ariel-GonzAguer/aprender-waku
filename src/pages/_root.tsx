import type { ReactNode } from 'react';
import '../styles.css';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className='min-h-screen'>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imagenes/waku.webp" />

      </head>
      <body data-version="1.0" className='min-h-screen'>{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};