import fs from 'fs'
import path from 'path'

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
}

/**
 * Recupera todas las publicaciones del blog desde el directorio de publicaciones.
 * 
 * Lee todos los archivos markdown del directorio `src/posts` y los analiza en objetos Post.
 * Cada publicación incluye metadatos extraídos del contenido markdown:
 * - El título se extrae del primer encabezado H1 (`# Título`)
 * - El extracto se genera a partir de los primeros 100 caracteres de texto plano
 * - El contenido incluye el markdown completo
 * 
 * @returns {Promise<Post[]>} Una promesa que se resuelve en un arreglo de objetos Post que contienen
 * las propiedades slug, title, excerpt, content y date.
 * 
 * @example
 * ```typescript
 * const posts = await getPosts();
 * console.log(posts[0].title); // "Mi Primera Publicación"
 * ```
 */
export async function getPosts(): Promise<Post[]> {
  // Directorio donde se almacenan las publicaciones
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  // Obtener todos los archivos .md en el directorio
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

  return files.map((file) => {
    // El slug es el nombre del archivo sin la extensión
    const slug = file.replace('.md', '')
    // Ruta completa al archivo
    const fullPath = path.join(postsDir, file)
    // Obtener el contenido del archivo
    const content = fs.readFileSync(fullPath, 'utf-8')

    // Extraer título del primer encabezado #
    const titleMatch = content.match(/^# (.+)$/m)
    // Si no hay título, usar el slug como título
    const title = titleMatch?.[1] ?? slug

    // Extraer extracto (primeros 100 caracteres sin markdown)
    const textOnly = content.replace(/[#*`\[\]]/g, '').trim()
    const excerpt = textOnly.substring(0, 100) + '...'

    return { slug, title, excerpt, content, date: new Date().toISOString() }
  })
}

/**
 * Recupera una publicación por su slug desde el sistema de archivos.
 * 
 * Esta función busca un archivo Markdown en el directorio `src/posts` que coincida con el slug proporcionado.
 * Si el archivo existe, analiza el título del primer encabezado (por ejemplo, `# Título`) y devuelve un objeto Post
 * con el slug, el título extraído, un extracto vacío, el contenido completo y la fecha actual como cadena ISO.
 * Si el archivo no existe, devuelve null.
 * 
 * @param slug - El identificador único de la publicación, utilizado como nombre de archivo sin extensión.
 * @returns Una promesa que se resuelve en un objeto Post si se encuentra, o null si no se encuentra.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const filePath = path.join(postsDir, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const titleMatch = content.match(/^# (.+)$/m)
  const title = titleMatch?.[1] ?? slug

  return { slug, title, excerpt: '', content, date: new Date().toISOString() }
}
