const temaModules = import.meta.glob("../temas/*.tsx");

/**
 * Extrae los slugs de todos los temas disponibles.
 *
 * @returns {Promise<string[]>} Array de slugs sin path ni extensión
 *                              (ej: ['0-intro', '1-primeros-pasos', ...])
 */
export async function getStaticPaths(): Promise<string[]> {
  const temas = Object.keys(temaModules);

  // Extraer solo el nombre del archivo sin path ni extensión
  const slugs = temas.map((path) => {
    const fileName = path.split("/").pop() || ""; // Obtener nombre del archivo
    return fileName.replace(".tsx", ""); // Remover extensión
  });

  return slugs;
}
