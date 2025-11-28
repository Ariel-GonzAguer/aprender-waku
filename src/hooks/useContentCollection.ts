/// <reference types="vite/client" />
'use client';

// este archivo se usa como un hook para recuperar todos los archivos markdown de la carpeta `markdowns` y parsear su frontmatter y contenido.

import { useEffect, useState } from "react";
import fm from "front-matter";

export interface ContentItem {
  markdown: string;
  path: string;
  attributes: {
    titulo?: string;
    autor?: string;
    fecha?: string;
    [key: string]: unknown;
  };
  body: string;
}

// Importa todos los .md de la carpeta src/markdowns como texto crudo
const modules = import.meta.glob("../temas/*.md", {
  query: "?raw",
  import: "default",
});

/**
 * Recupera asincrónicamente todos los elementos de contenido markdown.
 *
 * Itera sobre todas las entradas en el objeto `modules`, carga cada archivo markdown,
 * analiza su frontmatter y cuerpo, y retorna un arreglo de elementos de contenido.
 *
 * @returns {Promise<ContentItem[]>} Una promesa que resuelve a un arreglo de elementos de contenido,
 * cada uno con la ruta del archivo, atributos parseados, contenido markdown crudo y cuerpo.
 */
export async function getAllMarkdown(): Promise<ContentItem[]> {
  const entries = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const content = await (loader as () => Promise<string>)();
      const { attributes, body } = fm(content);
      return {
        path, // ruta/nombre del archivo markdown
        attributes: attributes as ContentItem["attributes"], // atributos extraídos del frontmatter
        markdown: content, // contenido markdown crudo
        body: body as string, // cuerpo del markdown sin frontmatter
      };
    })
  );
  return entries;
}

export function useContentCollection() {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => {
    getAllMarkdown().then(setItems);
  }, []);
  return items;
}
