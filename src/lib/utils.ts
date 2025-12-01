import fs from "fs";
import path from "path";

export interface Tema {
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
}

export async function getTemaBySlug(slug: string): Promise<Tema | null> {
  // Use import.meta.url to get the current file's directory, then navigate to temas
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const postsDir = path.resolve(currentDir, "..", "temas");
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
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
