---
titulo: "10-dataFetching"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "data fetching"]
---

### Del lado del servidor (Server Side)

Todos los patrones de Data Fetching (Fetch directo, Componentes aislados con `Suspense`, islas, etc.) son soportados en Waku.

En este proyecto podemos ver un ejemplo de Data Fetching directo en un Server Component en el archivo `src/pages/temas/[slug].tsx`.

```tsx
import type { PageProps } from "waku/router";
import { getTemaBySlug } from "../../lib/utils";
import MarkdownRenderer from "../../components/MarkdownRenderer.server";
import { Suspense } from "react";

export default async function PostDetail({ slug }: PageProps<"/temas/[slug]">) {
  const tema = await getTemaBySlug(slug);

  if (!tema) {
    return (
      <>
        <head>
          <title>Tema no encontrado</title>
        </head>
        <div className="p-8">
          <h1>Tema no encontrado</h1>
          <p>
            El tema <code>{slug}</code> no existe.
          </p>
          <p>
            <a href="/" className="text-blue-600 underline">
              Volver al inicio
            </a>
          </p>
        </div>
      </>
    );
  }

  return (
    <Suspense
      fallback={
        <section
          aria-label="Cargando tema..."
          className="flex flex-col justify-center items-center mt-25"
        >
          <p aria-live="polite">Cargando contenido del tema...</p>
          <img
            aria-live="polite"
            src="/loaders/OrangeCat_SVG.svg"
            alt="Imagen de carga que muestra un gatito rojo girando."
          />
        </section>
      }
    >
      <div className="max-w-[85%] m-[0_auto] break-normal">
        <MarkdownRenderer markdown={tema.contenido} />
      </div>
    </Suspense>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

### Del lado del cliente (Client Side)

Para mejorar la UX se recomienda hacer Data Fetching en el servidor, pero aún así, cualquier librería de Data Fetching del lado del cliente (SWR, React Query, Apollo Client, etc.) puede ser utilizada en Waku sin problemas.

[Siguiente: 11-mutaciones →](/temas/11-mutaciones)

[← Volver](/temas/9-sistemaDeArchivos)
