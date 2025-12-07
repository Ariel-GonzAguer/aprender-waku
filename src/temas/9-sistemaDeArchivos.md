---
titulo: "9-sistemaDeArchivos"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "sistema de archivos"]
---

Waku tiene una carpeta llamada `private` en la raíz del proyecto.
Todos los archivos que se pongan ahí se puede leer directamente desde `Server Components` de manera segura. Esta carpeta está pensanda para archivos que deben existir solo en el build (no en el bundle final), y que nunca se expongan en la URL pública. Normalmente son archivos `.md`, `.json`, o cualquier otro archivo que contenga datos que no deben ser públicos.
No está pensanda para archivos estáticos como imágenes, fuentes, etc. Para esos casos, se debe usar la carpeta `./public`.

Por ejemplo, si tenemos un archivo `./private/texto-privado.md`, podemos leerlo desde un `Server Component` así:

```tsx
import fs from "fs";
import path from "path";

/**
 * Server component seguro para leer un archivo "privado".
 * - busca el archivo en <project-root>/private/texto-privado.md
 * - comprueba existencia y maneja errores en vez de lanzar ENOENT
 */
export default function ServerComponenteConPrivate() {
  // Ruta segura a la carpeta ./private
  const filePath = path.join(process.cwd(), "private", "texto-privado.md");

  let textoPrivado: string | null = null;
  try {
    if (fs.existsSync(filePath)) {
      textoPrivado = fs.readFileSync(filePath, "utf-8");
    } else {
      // archivo ausente: no romper la renderización
      textoPrivado = null;
    }
  } catch (err) {
    // log para debugging sin romper la página
    // (no exponer errores sensibles al cliente)
    console.error("Error leyendo archivo privado:", err);
    textoPrivado = null;
  }

  return (
    <section className="p-4 bg-slate-900 text-white rounded">
      {textoPrivado ? (
        <div>
          <h3 className="font-semibold mb-2">Contenido privado</h3>
          <pre className="whitespace-pre-wrap text-sm">{textoPrivado}</pre>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold mb-2">
            Contenido privado no disponible
          </h3>
          <p className="text-sm text-gray-300">
            El archivo privado no se encontró o no se pudo leer.
          </p>
        </div>
      )}
    </section>
  );
}

export const getConfig = async () => {
  return {
    // Es server component que accede al FS: preferimos render dinámico
    // para evitar problemas en builds si el archivo está fuera del árbol del repo.
    render: "dynamic",
  } as const;
};
```

Si intentamos leer el mismo archivo desde un `Client Component`, obtendremos un error en tiempo de ejecución, ya que los `Client Components` no tienen acceso al sistema de archivos del servidor. 
Puede ver un ejemplo en la siguiente página → [página con texto privado](/pizzas/paginaConTextoPrivado).
  
[Siguiente: 10-dataFetching →](/temas/10-dataFetching)

[← Volver](/temas/8-staticAsstets)
