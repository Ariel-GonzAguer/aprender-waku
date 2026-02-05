  // Extraer número inicial del título o path para ordenar correctamente
  export function getInitialNumber(titleOrPath: string): number {
    // Extraer el nombre del archivo si es un path
    const filename = titleOrPath.includes("/")
      ? titleOrPath.split("/").pop() || ""
      : titleOrPath;

    // Buscar número al inicio del nombre o título
    const match = filename.match(/^(\d+)/);
    return match?.[1] ? parseInt(match[1], 10) : Infinity;
  };