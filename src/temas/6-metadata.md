---
titulo: "6-metadata"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "metadata"]
---

Waku eleva (hace _hoisting_) cualquier metadata (title, meta tags, etc.) al head del documento HTML generado, por lo que agregar meta tags es tan sencillo como incluirlos en cualquier layout o página.

En este proyecto, definimos metadata en dos lugares:

- -> Elemento Root `src/pages/_root.tsx`: Aquí definimos la mayoría de las meta tags, por ejemplo:

```tsx
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imagenes/waku.webp" />
        <meta name="description" content="Aprende Waku en en español" />
        <meta name="robots" content="index, follow" />
```

- -> MarkdownRenderer `src/components/MarkdownRenderer.server.tsx`: Aquí definimos el título dinámicamente basado en el frontmatter de cada página Markdown. Por ejemplo:

```tsx
// ...hay más código arriba
<>
  <title>{data.titulo}</title>
  <meta name="author" content={data.autor} />
  <meta
    name="keywords"
    content={Array.isArray(data.tags) ? data.tags.join(", ") : ""}
  />

  <article className="prose lg:prose-xl mx-auto p-4 leading-loose text-center text-balance">
    <header className="mb-6 text-center text-red-600 text-4xl">
      {data.titulo && <h2 id={safeId}>{data.titulo}</h2>}
      {(data.autor || data.fecha) && (
        <p className="text-sm text-gray-500 italic">
          {data.autor && <>Por {data.autor}</>}
          {data.autor && data.fecha && " — "}
          {data.fecha && <>{data.fecha}</>}
        </p>
      )}
    </header>

    <MarkdownContent markdown={processedContent} />
  </article>
</>
//... hay un poco más código abajo
```

La metadata también puede ser definida de manera programática. Acá el ejemplo de la guía oficial:

```tsx
// ./src/pages/index.tsx
export default async function HomePage() {
  return (
    <>
      <Head />
      <div>{/* ...*/}</div>
    </>
  );
}

const Head = async () => {
  const metadata = await getMetadata();

  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
    </>
  );
};

const getMetadata = async () => {
  /* ... */
};

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
```

[Siguiente: 7-estilos →](/temas/7-estilos)

[← Volver](/temas/5-manejoDeErrores)
