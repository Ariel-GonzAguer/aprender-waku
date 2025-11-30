import type { ReactNode } from 'react';
import '../styles.css';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className='min-h-screen'>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imagenes/waku.webp" />
        <meta name="description" content="Aprende Waku en en español" />
        <meta name="keywords" content="Waku, aprendizaje, tutorial" />
        <meta name="author" content="Ariel GonzAgüero" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Waku - en español" />
        <meta property="og:description" content="Aprende Waku en en español" />
        <meta property="og:image" content="/imagenes/waku.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Waku - en español" />
        <meta name="twitter:description" content="Aprende Waku en en español" />
        <meta name="twitter:image" content="/imagenes/waku.webp" />
        <meta name="publisher" content="Gato Rojo Lab" />

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
