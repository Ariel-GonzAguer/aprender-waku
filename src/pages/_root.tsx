import type { ReactNode } from 'react';
import '../styles.css';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className='h-full'>
      <head></head>
      <body data-version="1.0"  className='h-full'>{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};