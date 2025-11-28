import type { PageProps } from "waku/router";
import { Link } from "waku/router/client";
import * as ejemplos from "../../components/ejemplos";

type EjemploKey = keyof typeof ejemplos;

// Función para convertir slug a nombre de componente
// Ejemplo: "componente-cliente" → "EjemploComponenteCliente"
function slugToComponentName(slug: string): string {
  const words = slug.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return `Ejemplo${capitalizedWords.join("")}`;
}

export default async function PostDetail({
  slug,
}: PageProps<"/ejemplos/[slug]">) {
  const componentName = slugToComponentName(slug);
  const Component = ejemplos[componentName as EjemploKey] as
    | React.ComponentType<any>
    | undefined;

  if (!Component) {
    return (
      <>
        <head>
          <title>Ejemplo no encontrado</title>
        </head>
        <div className="p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Ejemplo no encontrado</h1>
          <p className="mb-4">
            El ejemplo{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">{slug}</code> no
            existe.
          </p>

          <p className="mt-6">
            <Link
              to="/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center text-center text-balance mt-10">
      <Component />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
