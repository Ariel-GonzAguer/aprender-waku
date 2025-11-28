import fs from 'fs'
import path from 'path'

export interface Tema {
  slug: string
  titulo: string
  resumen: string
  contenido: string
  fecha: string
}

export async function getTemaBySlug(slug: string): Promise<Tema | null> {
  const postsDir = path.join(process.cwd(), 'src', 'temas')
  const filePath = path.join(postsDir, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const tituloMatch = content.match(/^# (.+)$/m)
  const titulo = tituloMatch?.[1] ?? slug

  return { slug, titulo, resumen: '', contenido: content, fecha: new Date().toISOString() }
}
