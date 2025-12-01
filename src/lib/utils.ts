import fs from "fs";
import path from "path";

export interface Tema {
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
}

// Import all markdown files directly to ensure they are bundled
import intro from "../temas/0-intro.md?raw";
import primerosPasos from "../temas/1-primerosPasos.md?raw";
import renderizado from "../temas/2-renderizado.md?raw";
import enrutamiento from "../temas/3-enrutamiento.md?raw";
import navegacion from "../temas/4-navegacion.md?raw";
import manejoDeErrores from "../temas/5-manejoDeErrores.md?raw";
import metada from "../temas/6-metada.md?raw";
import estilos from "../temas/7-estilos.md?raw";
import staticAssets from "../temas/8-staticAsstets.md?raw";
import sistemaDeArchivos from "../temas/9-sistemaDeArchivos.md?raw";
import dataFetching from "../temas/10-dataFetching.md?raw";
import mutaciones from "../temas/11-mutaciones.md?raw";
import manejoDeEstado from "../temas/12-manejoDeEstado.md?raw";
import variablesDeEntorno from "../temas/13-variablesDeEntorno.md?raw";
import despliegue from "../temas/14-despliegue.md?raw";

// Static mapping of all tema content
const temasContent: Record<string, string> = {
  "0-intro": intro,
  "1-primerosPasos": primerosPasos,
  "2-renderizado": renderizado,
  "3-enrutamiento": enrutamiento,
  "4-navegacion": navegacion,
  "5-manejoDeErrores": manejoDeErrores,
  "6-metada": metada,
  "7-estilos": estilos,
  "8-staticAsstets": staticAssets,
  "9-sistemaDeArchivos": sistemaDeArchivos,
  "10-dataFetching": dataFetching,
  "11-mutaciones": mutaciones,
  "12-manejoDeEstado": manejoDeEstado,
  "13-variablesDeEntorno": variablesDeEntorno,
  "14-despliegue": despliegue,
};

export async function getTemaBySlug(slug: string): Promise<Tema | null> {
  const content = temasContent[slug];

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
