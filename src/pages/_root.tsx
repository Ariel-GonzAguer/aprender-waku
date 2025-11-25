import type { ReactNode } from 'react';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body data-version="1.0">{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};