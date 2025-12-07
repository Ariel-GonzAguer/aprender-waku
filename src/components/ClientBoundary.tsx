'use client';

import { ErrorBoundary } from 'react-error-boundary';

export default function ClientBoundary({ children, texto }: { children: React.ReactNode, texto?: string | null }) {
  return (
    <ErrorBoundary
      // fallbackRender recibe el error y proporciona un reset
      fallbackRender={({ error }) => (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 max-w-xl mx-auto">
          <p className="font-bold">{texto ?? 'Se produjo un error'}</p>
          {error?.message && (
            <p className="mt-2 text-sm">Mensaje: <span className="font-semibold">{error.message}</span></p>
          )}
          {error?.stack && (
            <pre className="mt-3 text-xs bg-white p-2 rounded border text-gray-700 overflow-auto max-h-48">{String(error.stack)}</pre>
          )}
          <div className="mt-3">
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
