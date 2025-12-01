import fs from "fs";
import path from "path";

export interface Tema {
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
}

// Import markdown files statically so they're bundled
const temaModules = import.meta.glob("../temas/*.md", { 
  query: "?raw", 
  import: "default",
  eager: true 
}) as Record<string, string>;

export async function getTemaBySlug(slug: string): Promise<Tema | null> {
  // Look for the file in the bundled modules
  const key = `../temas/${slug}.md`;
  const content = temaModules[key];

  if (!content) {
    return null;
  }

  const tituloMatch = content.match(/^# (.+)$/m);
  const titulo = tituloMatch?.[1] ?? slug;

  return {
    slug,
    titulo,
    resumen: "",
    contenido: content,
    fecha: new Date().toISOString(),
  };
}

export async function getEjemploBySlug(
  slug: string
): Promise<{ filePath: string } | null> {
  const ejemplosDir = path.join(process.cwd(), "src", "components", "ejemplos");
  const filePath = path.join(ejemplosDir, `${slug}.tsx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return {
    filePath,
  };
}
