🟧 GUÍA COMPLETA PARA APRENDER WAKU

Guía paso a paso para dominar **Waku**: el framework minimalista basado en React Server Components (RSC) pensado para aplicaciones JAMStack ultrarápidas. A través del proyecto **DevBlog**, aprenderás a construir un blog moderno con renderizado estático, rutas dinámicas y componentes interactivos.

---

## 0. Cómo usar este manual

1. **Lee cada sección antes de iniciar.** Cada bloque incluye tiempo estimado, pasos con comandos y explicaciones de diseño.
2. **Sigue los pasos en orden** y marca los checklists. Son tu Definition of Done.
3. **Anota hallazgos en `notes/waku.md`** (crea la carpeta si no existe). Registrarás decisiones y problemas.
4. **Entiende los términos RSC:** Server Components vs Client Components. Consulta tablas cuando sea necesario.
5. **Completa los retos opcionales** si tienes tiempo; consolidan el aprendizaje.

---

## 1. Introducción: ¿Qué es Waku y por qué te conviene?

| Aspecto | Descripción |
| --- | --- |
| **Filosofía** | RSC minimalista: explícito sobre qué renderiza donde |
| **Infra necesaria** | CDN estático puro (Vercel, Netlify, Cloudflare) |
| **Tamaño inicial** | ~40 kB bundle |
| **Data fetching** | Server Components async, cero waterfalls |
| **Rutas dinámicas** | File-based routing desde `src/pages/` con `PageProps` y `render: 'dynamic'` |
| **APIs** | Edge handlers simples en `src/pages/api/` |

**Mentalidad Waku:**
- Componentes `.server.tsx` → renderiza en servidor, envía HTML puro.
- Componentes `.client.tsx` → se hidratan en cliente, permite interactividad.
- Props entre ellos **deben ser JSON-serializables**.

---

## 2. Getting Started: Proyecto DevBlog — Blog estático interactivo

DevBlog es un blog de artículos técnicos con:
- **Artículos en Markdown** (prerendeados en build time).
- **Listado principal** con búsqueda client-side.
- **Rutas dinámicas** para cada post (`/posts/[slug]`).
- **Comentarios simulados** (JSONPlaceholder como BBDD de comentarios).
- **Tabla de contenidos** generada desde headings.
- **Dark mode** persistido en localStorage.

**¿Por qué DevBlog es perfecto para Waku?**
1. Demuestra **prerendering estático** (Server Components async).
2. Muestra **comunicación server→client** (props).
3. Practica **rutas dinámicas** con `PageProps` y `render: 'dynamic'`.
4. Implementa **APIs handlers** para acciones (likes, comentarios).
5. Resulta en **build 100% estático** deployable en cualquier CDN.

### 2.1. Prerrequisitos

1. **Node 18.18+ / pnpm 8+**
   ```bash
   node -v  # ≥ 18.18
   pnpm -v  # ≥ 8
   ```

2. **Crear proyecto Waku**
   ```bash
   pnpm create waku@latest
   cd devblog
   pnpm install
   ```

3. **Estructura base para DevBlog**
   ```
   src/
     pages/
       _root.tsx                  # Customizar <html>, <head>, <body>
       _layout.tsx                # Root layout (Header, Footer, Providers)
       index.tsx                  # Página home
       about.tsx                  # Página about
       posts/
         [slug].tsx               # Ruta dinámica para posts individuales
         [...notFound].tsx        # Catch-all 404
       _slices/                   # Componentes reutilizables composables
         author-bio.tsx
         related-posts.tsx
         newsletter-signup.tsx
       api/
         likes.ts                 # Endpoint para guardar likes
         comments.ts              # Endpoint para comentarios
     components/
       Header.server.tsx          # Navegación renderizada servidor
       Navigation.client.tsx      # Menú interactivo (Weaving Pattern)
       PostCard.client.tsx        # Card interactiva con like button
       SearchBar.client.tsx       # Búsqueda client-side
       ThemeProvider.client.tsx   # Context provider (Weaving Pattern)
       ThemeToggle.client.tsx     # Botón de tema
       Modal.client.tsx           # Modal reutilizable
       Providers.client.tsx       # Aggregador de providers globales
     lib/
       posts.ts                   # Carga y parseo de posts en Markdown
       actions.ts                 # Server Actions
       utils.ts                   # Helpers (slug, formatDate, etc.)
     posts/                       # Archivos .md con artículos
       hello-world.md
       waku-rsc-guide.md
       state-management.md
   ```

4. **Verificar instalación**
   ```bash
   pnpm dev
   # Abre http://localhost:4173
   ```

---

## 3. Rendering: Conceptos Fundamentales de RSC

### 3.1. Server Components vs Client Components

**¿Qué son React Server Components (RSC)?**

Un **Server Component** es un componente que se ejecuta **SOLO en el servidor** (build time o request time) y su resultado se envía como HTML al navegador. NO puede usar hooks de React, NO tiene acceso a `window` o APIs browser, pero SÍ puede hacer `await`, acceder a `process.env`, y leer archivos del sistema.

Un **Client Component** es un componente marcado con `'use client'` que se ejecuta en el navegador y puede usar hooks (`useState`, `useEffect`), acceder a `window`, escuchar eventos.

**Tabla comparativa:**

| Capacidad | Server Component | Client Component |
| --- | --- | --- |
| `await` fetch/lectura archivo | ✅ | ❌ (solo fetch hacia URLs públicas o APIs accesibles desde el navegador) |
| `useState`, `useEffect` | ❌ | ✅ |
| Acceso a `window`, `localStorage` | ❌ | ✅ |
| Acceso a `process.env` secrets | ✅ | ❌ |
| Tamaño en bundle final | 0 kB | Sí (enviado al cliente) |
| Renderizado | Build/request time | Runtime navegador |

**Arquitectura de Waku:**
- `_root.tsx` en `src/pages/` personaliza `<html>`, `<head>`, `<body>` (opcional).
- `_layout.tsx` en `src/pages/` es el layout raíz que envuelve todas las páginas.
- Componentes `*.server.tsx` se renderizan solo en servidor.
- Componentes `*.client.tsx` se hidratan en cliente (pueden usar hooks).
- Props entre server→client **deben ser JSON-serializables** (sin funciones, clases, etc.).

### 3.2. Setup y primer layout

1. **Crear componente Header** (`src/components/Header.server.tsx`)
   ```tsx
   export default function Header() {
     return (
       <header className="p-4 bg-gray-100 border-b border-gray-300">
         <nav className="flex gap-8 items-center">
           <h1 className="m-0">
             <a href="/" className="no-underline text-black">
               📝 DevBlog
             </a>
           </h1>
           <a href="/">Posts</a>
           <a href="/about">About</a>
         </nav>
       </header>
     )
   }
   ```

2. **Crear layout raíz** (`src/pages/_layout.tsx`)
   ```tsx
   import Header from '../components/Header.server'

   export default async function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <div>
         <Header />
         <main className="p-8 max-w-7xl mx-auto">
           {children}
         </main>
         <footer className="bg-gray-100 p-4 mt-8 text-center">
           <p>© 2025 DevBlog. Hecho con Waku.</p>
         </footer>
       </div>
     )
   }

   export const getConfig = async () => {
     return {
       render: 'static',
     } as const
   }
   ```

3. **Crear página home** (`src/pages/index.tsx`)
   ```tsx
   export default async function HomePage() {
     return (
       <section>
         <h2>Bienvenido a DevBlog</h2>
         <p>Un blog estático renderizado con Waku y React Server Components.</p>
       </section>
     )
   }

   export const getConfig = async () => {
     return {
       render: 'static',
     } as const
   }
   ```

4. **Correr dev**
   ```bash
   pnpm dev
   ```
   - Abre http://localhost:4173
   - Verifica que se ve el layout sin errores.
   - **Prueba crítica:** Desactiva JavaScript en DevTools y recarga → la página debe verse igual (es HTML puro).

#### Checklist: Setup básico

- [x] Layout renderiza sin JS (Server Component puro).
- [x] Navegación funciona.
- [x] Estructura de carpetas creada correctamente.
- [x] `pnpm dev` corre sin warnings.

#### Errores frecuentes

- ❌ "ReferenceError: window is not defined" → Usaste API browser en `.server.tsx`. Muévelo a `.client.tsx`.
- ❌ "Cannot find module" → Ruta de import incorrecta. Verifica `src/components/`.
- ❌ Componente no renderiza → ¿Olvidaste exportar `default`?

### 3.3. Server Components Async: Sistema de posts con Markdown

**Meta:** Cargar artículos desde Markdown, renderizarlos en servidor y mostrar lista prerendereada.

1. **Crear posts de ejemplo** (`src/posts/hello-world.md`)
   ```markdown
   # Hola Mundo con Waku

   Este es mi primer post en DevBlog.

   ## ¿Qué es Waku?

   Waku es un framework minimalista basado en React Server Components.

   - Muy ligero
   - Deploy estático
   - Perfecto para blogs

   **Publicado:** 2025-11-24
   ```

2. **Crear helper de posts** (`src/lib/posts.ts`)
   ```ts
   import fs from 'fs'
   import path from 'path'

   export interface Post {
     slug: string
     title: string
     excerpt: string
     content: string
     date: string
   }

   export async function getPosts(): Promise<Post[]> {
     const postsDir = path.join(process.cwd(), 'src', 'posts')
     const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

     return files.map((file) => {
       const slug = file.replace('.md', '')
       const fullPath = path.join(postsDir, file)
       const content = fs.readFileSync(fullPath, 'utf-8')

       // Extraer title del primer # heading
       const titleMatch = content.match(/^# (.+)$/m)
       const title = titleMatch ? titleMatch[1] : slug

       // Extraer excerpt (primeras 100 chars sin markdown)
       const textOnly = content.replace(/[#*`\[\]]/g, '').trim()
       const excerpt = textOnly.substring(0, 100) + '...'

       return { slug, title, excerpt, content, date: new Date().toISOString() }
     })
   }

   export async function getPostBySlug(slug: string): Promise<Post | null> {
     const postsDir = path.join(process.cwd(), 'src', 'posts')
     const filePath = path.join(postsDir, `${slug}.md`)

     if (!fs.existsSync(filePath)) {
       return null
     }

     const content = fs.readFileSync(filePath, 'utf-8')
     const titleMatch = content.match(/^# (.+)$/m)
     const title = titleMatch ? titleMatch[1] : slug

     return { slug, title, excerpt: '', content, date: new Date().toISOString() }
   }
   ```

3. **Crear página de posts** (`src/components/PostList.server.tsx`)
   ```tsx
   import { getPosts } from '../lib/posts'

   export default async function PostList() {
     const posts = await getPosts()

     return (
       <section>
         <h2>Últimos artículos</h2>
         <ul className="list-none grid gap-4">
           {posts.map((post) => (
             <li
               key={post.slug}
               className="p-4 border border-gray-300 rounded-lg"
             >
               <h3>
                 <a href={`/posts/${post.slug}`}>{post.title}</a>
               </h3>
               <p>{post.excerpt}</p>
               <small className="text-gray-600">📅 {post.date}</small>
             </li>
           ))}
         </ul>
       </section>
     )
   }
   ```

4. **Crear página para mostrar lista** (`src/pages/index.tsx`)
   ```tsx
   import PostList from '../components/PostList.server'

   export default async function HomePage() {
     return (
       <PostList />
     )
   }

   export const getConfig = async () => {
     return {
       render: 'static',
     } as const
   }
   ```

### 3.4. Suspense y streaming

**¿Por qué Suspense?** Si `getPosts()` tarda (ej. 500ms), sin Suspense todo se congela. Con Suspense, muestras un fallback inmediatamente.

```tsx
import { Suspense } from 'react'
import PostList from './components/PostList.server'

export default async function HomePage() {
  return (
    <Suspense fallback={<p>⏳ Cargando posts...</p>}>
      {/* @ts-expect-error Async Server Component */}
      <PostList />
    </Suspense>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
```

**Cómo funciona el streaming:**
1. HTML se envía al navegador inmediatamente con el fallback.
2. Waku ejecuta `getPosts()` en paralelo.
3. Reemplaza el fallback con la lista real (streaming HTML).
4. **Resultado:** Percepción de velocidad mejorada.

#### Checklist: Server Components y Suspense

- [ ] Posts se cargan desde archivos Markdown.
- [ ] Lista renderiza sin errors.
- [ ] Suspense muestra fallback mientras carga.
- [ ] Desactiva JS → lista sigue visible (es HTML estático).

#### Errores frecuentes

- ❌ "ENOENT: no such file or directory" → Ruta `src/posts` no existe. Créala.
- ❌ Markdown no parsea correctamente → Regex incorrecto. Añade console.log para debuggear.
- ❌ Suspense no funciona → ¿Olvidaste `@ts-expect-error`? Waku espera ese comment.

---

## 4. Routing: Sistema de Rutas en Waku

### 4.1. Fundamentos del File-Based Routing

1. **Crear barra de búsqueda** (`src/components/SearchBar.client.tsx`)
   ```tsx
   'use client'

   import { useState } from 'react'

   interface Post {
     slug: string
     title: string
     excerpt: string
   }

   export default function SearchBar({ posts }: { posts: Post[] }) {
     const [query, setQuery] = useState('')

     const filtered = posts.filter((p) =>
       p.title.toLowerCase().includes(query.toLowerCase()) ||
       p.excerpt.toLowerCase().includes(query.toLowerCase())
     )

     return (
       <div className="mb-8">
         <input
           type="text"
           placeholder="Buscar posts..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           className="w-full p-2 text-base rounded border border-gray-300"
         />
         <p className="mt-2 text-gray-600">
           {filtered.length} de {posts.length} posts encontrados
         </p>
         <ul className="list-none grid gap-4 mt-4">
           {filtered.map((post) => (
             <li
               key={post.slug}
               className="p-4 border border-gray-300 rounded-lg"
             >
               <h3>
                 <a href={`/posts/${post.slug}`}>{post.title}</a>
               </h3>
               <p>{post.excerpt}</p>
             </li>
           ))}
         </ul>
       </div>
     )
   }
   ```

2. **Actualizar PostList para usar búsqueda** (`src/components/PostList.server.tsx`)
   ```tsx
   import { getPosts } from '../lib/posts'
   import SearchBar from './SearchBar.client'

   export default async function PostList() {
     const posts = await getPosts()

     return (
       <section>
         <h2>Artículos</h2>
         <SearchBar posts={posts.map(p => ({ slug: p.slug, title: p.title, excerpt: p.excerpt }))} />
       </section>
     )
   }
   ```

### 4.2. Rutas Dinámicas con PageProps

1. **Crear hook de dark mode** (`src/lib/useDarkMode.ts`)
   ```ts
   // Este archivo es reutilizable en Client Components
   'use client'

   import { useState, useEffect } from 'react'

   export function useDarkMode() {
     const [isDark, setIsDark] = useState(false)
     const [mounted, setMounted] = useState(false)

     useEffect(() => {
       // Evitar SSR mismatch
       setMounted(true)
       const saved = localStorage.getItem('darkMode')
       if (saved) {
         setIsDark(JSON.parse(saved))
       }
     }, [])

     useEffect(() => {
       if (mounted) {
         localStorage.setItem('darkMode', JSON.stringify(isDark))
         document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
       }
     }, [isDark, mounted])

     return { isDark, setIsDark, mounted }
   }
   ```

2. **Crear botón de dark mode** (`src/components/ThemeToggle.client.tsx`)
   ```tsx
   'use client'

   import { useDarkMode } from '../lib/useDarkMode'

   export default function ThemeToggle() {
     const { isDark, setIsDark, mounted } = useDarkMode()

     if (!mounted) return null

     return (
       <button
         onClick={() => setIsDark(!isDark)}
         className="bg-transparent border-none text-2xl cursor-pointer"
       >
         {isDark ? '☀️' : '🌙'}
       </button>
     )
   }
   ```

3. **Agregar a Header** (`src/components/Header.server.tsx`)
   ```tsx
   import ThemeToggle from './ThemeToggle.client'

   export default function Header() {
     return (
       <header className="p-4 bg-gray-100 border-b border-gray-300">
         <nav className="flex gap-8 items-center justify-between">
           <div className="flex gap-8 items-center">
             <h1 className="m-0">
               <a href="/" className="no-underline text-black">
                 📝 DevBlog
               </a>
             </h1>
             <a href="/">Posts</a>
             <a href="/about">About</a>
           </div>
           <ThemeToggle />
         </nav>
       </header>
     )
   }
   ```

#### 🟡 Subsección: Comentarios Reales con JSONPlaceholder

**¿Por qué JSONPlaceholder?**

JSONPlaceholder es una API pública gratuita que simula comentarios y posts reales. Perfecto para:
- ✅ Aprender a fetchear datos en Client Components
- ✅ Practicar manejo de loading states y errores
- ✅ No requiere autenticación
- ✅ Refleja patrones que usarías con Supabase/Firebase en producción

**Endpoint que usaremos:**
```
https://jsonplaceholder.typicode.com/posts/:postId/comments
```

Devuelve una lista de comentarios reales para un post (1-100). Ejemplo:
```json
[
  {
    "postId": 1,
    "id": 1,
    "name": "id labore ex et quam laborum",
    "email": "Eliseo@gardner.biz",
    "body": "laudantium enim quasi est..."
  },
  {...}
]
```

---

**1. Crear componente de comentarios** (`src/components/CommentsList.client.tsx`)

```tsx
'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export default function CommentsList({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        setError(null)

        // Llamar a JSONPlaceholder (API pública, sin auth)
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
        )

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No pudimos cargar comentarios`)
        }

        const data: Comment[] = await res.json()
        setComments(data)
      } catch (err: any) {
        setError(err.message || 'Error inesperado al cargar comentarios')
        console.error('[CommentsList Error]', err)
      } finally {
        setLoading(false)
      }
    }

    // Solo fetchear si postId es válido (1-100)
    if (postId >= 1 && postId <= 100) {
      fetchComments()
    } else {
      setLoading(false)
      setError('Post inválido')
    }
  }, [postId])

  // Estado de carga
  if (loading) {
    return (
      <section className="mt-8 p-4 bg-gray-100">
        <h3>💬 Comentarios</h3>
        <p className="text-gray-600">⏳ Cargando comentarios desde JSONPlaceholder...</p>
      </section>
    )
  }

  // Estado de error
  if (error) {
    return (
      <section className="mt-8 p-4 bg-red-100">
        <h3>💬 Comentarios</h3>
        <p className="text-red-700">❌ {error}</p>
        <small className="text-gray-500">
          💡 Tip: JSONPlaceholder proporciona comentarios para posts 1-100. 
          Si el slug no mapea a un ID válido, prueba con otro post.
        </small>
      </section>
    )
  }

  // Sin comentarios (raro en JSONPlaceholder, pero posible)
  if (comments.length === 0) {
    return (
      <section className="mt-8 p-4 bg-gray-100">
        <h3>💬 Comentarios</h3>
        <p>Sin comentarios para este post aún.</p>
      </section>
    )
  }

  // Renderizar comentarios
  return (
    <section className="mt-8 pt-8 border-t border-gray-300">
      <h3>💬 Comentarios ({comments.length})</h3>
      <ul className="list-none p-0">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="mb-6 p-4 bg-gray-50 rounded border-l-4 border-blue-600"
          >
            <div className="mb-2">
              <strong className="text-base">{comment.name}</strong>
              <p className="text-sm text-gray-600 my-1">
                ✉️ {comment.email}
              </p>
            </div>
            <p className="my-2 leading-relaxed">{comment.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

---

**2. Integrar comentarios en la página de post** (`src/pages/posts/[slug].tsx`)

```tsx
import type { PageProps } from 'waku/router'
import { getPostBySlug } from '../../lib/posts'
import Layout from '../../components/Layout.server'
import CommentsList from '../../components/CommentsList.client'

export default async function PostDetail({ slug }: PageProps<'/posts/[slug]'>) {
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <Layout>
        <h1>Post no encontrado</h1>
        <p>
          <a href="/">Volver al inicio</a>
        </p>
      </Layout>
    )
  }

  // 🔑 Mapear slug a postId de JSONPlaceholder (1-100)
  // Estrategia: usar índice + 1, o hash del slug
  // Para esta guía, usaremos: Math.abs(sum de charCodes) % 100 + 1
  const postId = Math.abs(
    post.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % 100 + 1

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        <p className="text-gray-600 text-sm">
          📅 {new Date(post.date).toLocaleDateString('es-ES')}
        </p>

        <div
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/^# .+$/gm, ''), // Remove title
          }}
        />

        {/* 🟡 Componente de comentarios reales */}
        <CommentsList postId={postId} />

        <nav className="mt-8 pt-8 border-t border-gray-300">
          <a href="/">← Volver a posts</a>
        </nav>
      </article>
    </Layout>
  )
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const
}
```

---

**3. Cómo funciona el flujo JSONPlaceholder:**

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario abre /posts/hello-world                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ PostDetail.tsx renderiza (Server Component)                 │
│ - Calcula postId = 25 (basado en slug)                      │
│ - Pasa postId como prop a CommentsList                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ CommentsList.client.tsx renderiza (Client Component)        │
│ - useEffect se dispara                                      │
│ - fetch(`...posts/25/comments`) → JSONPlaceholder           │
│ - Mostrar: "⏳ Cargando comentarios..."                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ JSONPlaceholder responde con array de comentarios           │
│ - setComments(data)                                         │
│ - Re-render con comentarios reales                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Usuario ve comentarios renderizados + búsqueda funciona     │
│ ¡Sin base de datos, solo API pública!                       │
└─────────────────────────────────────────────────────────────┘
```

---

**4. Ventajas de este patrón (sin romper RSC):**

| Aspecto | Ventaja |
| --- | --- |
| **Server Component** | `PostDetail.tsx` renderiza rápido (no espera comentarios) |
| **Client Component** | `CommentsList` carga comentarios async sin bloquear HTML |
| **Streaming** | Usuario ve post inmediatamente, comentarios llegan después |
| **API real** | No estamos simulando datos, aprendemos HTTP real |
| **Sin servidor** | JSONPlaceholder es pública, no necesitamos backend propio |
| **Error handling** | Mostramos fallback amigable si falla (red, API down) |

---

**5. Testear en dev**

```bash
pnpm dev
# Abre http://localhost:4173/posts/hello-world
# En Network tab, deberías ver:
#   1. XHR → https://jsonplaceholder.typicode.com/posts/:id/comments
#   2. Response: array de comentarios reales
#   3. CommentsList renderiza comentarios
```

---

#### Checklist: Routing Completo

- [ ] Búsqueda filtra posts en real time (sin reload).
- [ ] Dark mode persiste en localStorage.
- [ ] Botón tema funciona sin flickering.
- [ ] State local (query, isDark) vive solo en Client Components.
- [ ] ✅ **JSONPlaceholder:** `CommentsList.client.tsx` fetchea comentarios reales
- [ ] ✅ **Loading state:** Muestra "⏳ Cargando comentarios..." mientras fetcha
- [ ] ✅ **Error handling:** Si falla la API, muestra mensaje amigable
- [ ] ✅ **Mapeo de slug a postId:** Verifica que cada post mapea a un ID válido (1-100)
- [ ] ✅ **Network tab:** Revisa que JSONPlaceholder es llamado (sin errors CORS)

#### Errores frecuentes

- ❌ "window is not defined" → Importaste `useDarkMode` en Server Component. Solo úsalo en Client Components.
- ❌ Flickering en dark mode → Falta `mounted` check o el script de theme no corre antes del render.
- ❌ localStorage indefinido → Asegúrate que useDarkMode tiene `useEffect` para hidratación correcta.
- ❌ Comentarios no cargan → Revisa Network tab, ¿CORS error? JSONPlaceholder debería permitir
- ❌ "postId no es válido" → El slug mapea fuera de 1-100. Ajusta la lógica de hash en PostDetail

### 4.3. Sistemas de Rutas en Detalle (Concepto + Práctica)

**¿Cómo Waku maneja las rutas?**

Waku usa **file-based routing**: los archivos en `src/pages/` determinan automáticamente las rutas. No necesitas un `react-router` ni configuración manual.

**Convención de archivos:**

| Archivo | Ruta generada | Tipo | Prerendering |
| --- | --- | --- | --- |
| `src/pages/index.tsx` | `/` (home) | Estática | Build time |
| `src/pages/about.tsx` | `/about` | Estática | Build time |
| `src/pages/blog/index.tsx` | `/blog` | Estática | Build time |
| `src/pages/posts/[slug].tsx` | `/posts/hello-world`, `/posts/faq` | Dinámica | Con `render: 'dynamic'` |
| `src/pages/posts/[slug]/comments.tsx` | `/posts/hello-world/comments` | Dinámica anidada | Con `render: 'dynamic'` |
| `src/pages/[...notFound].tsx` | Cualquier ruta no encontrada | Catch-all 404 | Build time |

---

##### 1️⃣ Rutas estáticas simples

**Caso:** Crear páginas fijas (home, about, contacto).

```tsx
// src/pages/about.tsx
export default function About() {
  return (
    <html>
      <head><title>Sobre mí</title></head>
      <body>
        <h1>Sobre DevBlog</h1>
        <p>Un blog técnico hecho con Waku.</p>
      </body>
    </html>
  )
}
```

Resultado: `http://localhost:4173/about` disponible automáticamente.

```tsx
// src/pages/contact.tsx
export default function Contact() {
  return (
    <html>
      <head><title>Contacto</title></head>
      <body>
        <h1>Contactame</h1>
        <form>
          <input type="email" placeholder="Tu email" />
          <button type="submit">Enviar</button>
        </form>
      </body>
    </html>
  )
}
```

Resultado: `http://localhost:4173/contact`

**⚠️ Diferencia clave:**
- `pages/about.tsx` → `/about`
- `pages/blog/index.tsx` → `/blog` (nota: `index` siempre es la carpeta padre)

---

##### 2️⃣ Rutas anidadas

**Caso:** Estructura jerárquica `/blog/posts`, `/blog/category/[category]`.

```
src/pages/
├── blog/
│   ├── index.tsx              → /blog
│   ├── featured.tsx           → /blog/featured
│   ├── category/
│   │   ├── index.tsx          → /blog/category
│   │   └── [category].tsx     → /blog/category/javascript, /blog/category/react
│   └── [slug].tsx             → /blog/slug-aqui
└── index.tsx                  → /
```

**Ejemplo práctico: Categorías de blog**

```tsx
// src/pages/blog/category/[category].tsx
import type { PageProps } from 'waku/router'
import Layout from '../../components/Layout.server'

export default function CategoryPage({ category }: PageProps<'/blog/category/[category]'>) {

  // Simular data (en prod: fetch DB o archivo)
  const postsInCategory = {
    javascript: [
      { title: 'Async/await vs Promises', slug: 'async-await' },
      { title: 'Event Loop explicado', slug: 'event-loop' },
    ],
    react: [
      { title: 'RSC vs Client Components', slug: 'rsc-vs-client' },
      { title: 'Hooks profundidad', slug: 'hooks-deep-dive' },
    ],
    deployment: [
      { title: 'Deploy a Vercel', slug: 'deploy-vercel' },
      { title: 'Cloudflare Pages', slug: 'cloudflare-pages' },
    ],
  }

  const posts = postsInCategory[category as keyof typeof postsInCategory] || []

  return (
    <Layout>
      <h1>Posts en "{category}"</h1>
      {posts.length === 0 ? (
        <p>No hay posts en esta categoría.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const
}
```

Rutas dinámicas disponibles:
- `http://localhost:4173/blog/category/javascript`
- `http://localhost:4173/blog/category/react`
- `http://localhost:4173/blog/category/deployment`

**Nota:** Con `render: 'dynamic'`, las rutas se generan bajo demanda.

---

##### 3️⃣ Rutas dinámicas con múltiples segmentos

**Caso:** Subrutas dinámicas como `/posts/[slug]/comments` (comentarios de un post específico).

```tsx
// src/pages/posts/[slug]/comments.tsx
import type { PageProps } from 'waku/router'

export default function CommentsPage({ slug }: PageProps<'/posts/[slug]/comments'>) {

  return (
    <html>
      <head><title>Comentarios - {slug}</title></head>
      <body>
        <h1>Comentarios para: {slug}</h1>
        <p>Estructura: /posts/{slug}/comments</p>
        {/* Renderizar comentarios */}
      </body>
    </html>
  )
}
```

Rutas generadas:
- `/posts/hello-world/comments`
- `/posts/waku-rsc-guide/comments`
- `/posts/state-management/comments`

---

##### 4️⃣ Rutas dinámicas catch-all ([...notFound])

**Caso:** Capturar rutas no encontradas y mostrar página 404 personalizada.

```tsx
// src/pages/[...notFound].tsx
export default function NotFound({ params }: { params: { notFound: string[] } }) {
  const path = params.notFound.join('/')

  return (
    <html>
      <head><title>404 - Página no encontrada</title></head>
      <body className="text-center p-16">
        <h1>🔍 404 - Página no encontrada</h1>
        <p className="text-xl text-gray-600">
          No pudimos encontrar: <code>/{path}</code>
        </p>
        <p>Tal vez quisiste:</p>
        <ul className="text-left inline-block">
          <li><a href="/">Ir a home</a></li>
          <li><a href="/posts">Ver todos los posts</a></li>
          <li><a href="/about">Sobre mí</a></li>
        </ul>
        <pre className="mt-8 p-4 bg-gray-100 rounded">
          Ruta solicitada: /{path}
          Parámetro: {JSON.stringify(params)}
        </pre>
      </body>
    </html>
  )
}
```

**Cómo funciona:**
- `http://localhost:4173/xyz/abc/def` → `params.notFound = ['xyz', 'abc', 'def']`
- Captura TODAS las rutas no definidas
- **Nota:** Debe colocarse en la raíz de `pages/`, no en subcarpetas

**Regla en Waku:** Las rutas se definen explícitamente en archivos. Si no existe una ruta, devuelve 404. Por eso el catch-all debe nombrarse claramente.

---

##### 5️⃣ Comparativa: Rutas estáticas vs dinámicas en Waku

| Escenario | Archivo | Cómo funciona | Usado en DevBlog |
| --- | --- | --- | --- |
| **Estática** | `pages/about.tsx` | 1 archivo = 1 ruta fija | `/about` |
| **Dinámica simple** | `pages/posts/[slug].tsx` | 1 archivo con `render: 'dynamic'` = rutas bajo demanda | `/posts/hello-world`, `/posts/faq` |
| **Dinámica anidada** | `pages/blog/[category]/[post].tsx` | 1 archivo con 2 parámetros dinámicos = rutas bajo demanda | `/blog/react/hooks-guide` |
| **Catch-all** | `pages/[...notFound].tsx` | 1 archivo para rutas inválidas | Cualquier ruta no definida |

---

##### 6️⃣ Árbol de rutas completo: DevBlog

```
Rutas estáticas:
✓ / (home, index)
✓ /about
✓ /blog
✓ /blog/featured

Rutas dinámicas:
✓ /posts/hello-world (ruta dinámica, generada bajo demanda)
✓ /posts/waku-rsc-guide
✓ /posts/state-management
✓ /blog/category/javascript (ruta dinámica, generada bajo demanda)
✓ /blog/category/react
✓ /blog/category/deployment

Catch-all (404):
✓ /invalid-path → Capturada por [...notFound].tsx
✓ /posts/invalid-slug → También capturada
```

---

##### 7️⃣ Implementación real en DevBlog: Rutas estáticas

```tsx
// src/pages/index.tsx (Home)
import Layout from '../components/Layout.server'
import { getPosts } from '../lib/posts'

export default async function Home() {
  const posts = await getPosts()

  return (
    <Layout>
      <h1>📝 Últimos artículos</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/posts/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
```

```tsx
// src/pages/about.tsx
import Layout from '../components/Layout.server'

export default function About() {
  return (
    <Layout>
      <h1>Sobre DevBlog</h1>
      <p>DevBlog es un proyecto educativo para aprender Waku, RSC y rutas dinámicas.</p>
      <h2>Tecnologías</h2>
      <ul>
        <li>Waku (React Server Components)</li>
        <li>Markdown (para posts)</li>
        <li>TypeScript</li>
      </ul>
    </Layout>
  )
}
```

---

##### 8️⃣ Implementación real en DevBlog: Rutas dinámicas con PageProps

```tsx
// src/pages/posts/[slug].tsx
import type { PageProps } from 'waku/router'
import Layout from '../../components/Layout.server'
import { getPostBySlug } from '../../lib/posts'

export default async function PostDetail({ slug }: PageProps<'/posts/[slug]'>) {
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <Layout>
        <h1>Post no encontrado: {slug}</h1>
        <a href="/posts">Volver a posts</a>
      </Layout>
    )
  }

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        <p className="text-gray-600 text-sm">
          Publicado: {new Date(post.date).toLocaleDateString('es-ES')}
        </p>
        <div>{post.content}</div>
      </article>
    </Layout>
  )
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const
}
```

---

##### 9️⃣ Errores frecuentes con rutas en Waku

- ❌ **Olvidar `getConfig` con `render: 'dynamic'` en rutas dinámicas**
  ```tsx
  // ❌ MALO: Sin getConfig, obtendrás error de configuración inválida
  export default function Post({ slug }: PageProps<'/posts/[slug]'>) {
    return <h1>{slug}</h1>
  }

  // ✅ BUENO
  export default function Post({ slug }: PageProps<'/posts/[slug]'>) {
    return <h1>{slug}</h1>
  }
  
  export const getConfig = async () => {
    return {
      render: 'dynamic',
    } as const
  }
  ```

- ❌ **Usar `[...catch]` en subcarpetas**
  ```tsx
  // ❌ MALO: pages/posts/[...catch].tsx no captura rutas globales
  // Solo capturará /posts/xyz/abc, no /invalid

  // ✅ BUENO: pages/[...notFound].tsx en raíz
  ```

- ❌ **Mixturar rutas estáticas y dinámicas con mismo nombre**
  ```tsx
  // ❌ MALO: Ambos archivos generan conflicto
  // pages/posts/about.tsx → /posts/about
  // pages/posts/[slug].tsx → /posts/:slug
  // ¿Cuál tiene prioridad?

  // ✅ BUENO: Usa nombres distintos o carpetas anidadas
  // pages/posts/index.tsx → /posts
  // pages/posts/about.tsx → /posts/about
  // pages/posts/[slug].tsx → /posts/:slug (excluye about automáticamente)
  ```

---

##### 🔟 Checklist: Rutas en DevBlog

- [ ] Rutas estáticas funcionan: `/`, `/about`, `/blog`
- [ ] Rutas dinámicas: `/posts/[slug]` con `render: 'dynamic'`
- [ ] Rutas anidadas: `/blog/category/[category]`
- [ ] Página 404 personalizada: `/[...notFound].tsx` captura rutas inválidas
- [ ] Test: `http://localhost:4173/invalid-route` → Muestra 404 personalizado
- [ ] Test: `http://localhost:4173/posts/hello-world` → Funciona
- [ ] Test: `http://localhost:4173/posts/invalid-slug` → ¿Fallback o 404?

### 4.4. Práctica: Crear página de post individual con rutas dinámicas

1. **Crear página de post individual** (`src/pages/posts/[slug].tsx`)
   ```tsx
   import type { PageProps } from 'waku/router'
   import { getPostBySlug } from '../../lib/posts'
   import Layout from '../../components/Layout.server'

   export default async function PostDetail({ slug }: PageProps<'/posts/[slug]'>) {
     const post = await getPostBySlug(slug)

     if (!post) {
       return (
         <Layout>
           <h1>Post no encontrado</h1>
           <p>
             <a href="/">Volver al inicio</a>
           </p>
         </Layout>
       )
     }

     return (
       <Layout>
         <article>
           <h1>{post.title}</h1>
           <p className="text-gray-600 text-sm">
             📅 {new Date(post.date).toLocaleDateString()}
           </p>

           <div
             className="mt-8 leading-relaxed"
             dangerouslySetInnerHTML={{
               __html: post.content.replace(
                 /^# .+$/gm,
                 ''
               ), // Remove title heading
             }}
           />

           <nav className="mt-8 pt-8 border-t border-gray-300">
             <a href="/">← Volver a posts</a>
           </nav>
         </article>
       </Layout>
     )
   }
   ```

2. **Verificar prerendering en build**
   ```bash
   pnpm build
   ```
   - Revisa la carpeta `dist/posts/`
   - Deberías ver `hello-world/index.html`, etc.

---

## 5. Navegación en Waku

### 5.1. Componente Link y Navegación Básica

1. **Crear API para likes** (`api/likes.ts`)
   ```ts
   // En Waku, los handlers de api/ son funciones que reciben Request
   // Se despliegan como Edge Functions (Vercel) o Workers (Cloudflare)

   interface LikeRequest {
     postSlug: string
     action: 'like' | 'unlike'
   }

   export default async function handler(request: Request) {
     if (request.method !== 'POST') {
       return new Response('Method not allowed', { status: 405 })
     }

     try {
       const { postSlug, action }: LikeRequest = await request.json()

       // En una app real, guardarías en DB o Cache
       // Para esta guía, solo respondemos OK
       const response = {
         ok: true,
         message: action === 'like' ? 'Post liked!' : 'Like removed',
         slug: postSlug,
       }

       return new Response(JSON.stringify(response), {
         headers: { 'Content-Type': 'application/json' },
       })
     } catch (error) {
       return new Response(JSON.stringify({ error: 'Invalid request' }), {
         status: 400,
         headers: { 'Content-Type': 'application/json' },
       })
     }
   }
   ```

2. **Crear componente de like button** (`src/components/LikeButton.client.tsx`)
   ```tsx
   'use client'

   import { useState } from 'react'

   export default function LikeButton({ postSlug }: { postSlug: string }) {
     const [liked, setLiked] = useState(false)
     const [count, setCount] = useState(0)

     const handleLike = async () => {
       const newLiked = !liked
       setLiked(newLiked)
       setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)))

       // Enviar al API
       await fetch('/api/likes', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           postSlug,
           action: newLiked ? 'like' : 'unlike',
         }),
       })
     }

     return (
       <button
         onClick={handleLike}
         className={`px-4 py-2 border-none rounded cursor-pointer ${
           liked ? 'bg-red-400 text-white' : 'bg-gray-300 text-black'
         }`}
       >
         {liked ? '❤️' : '🤍'} {count} likes
       </button>
     )
   }
   ```

3. **Agregar a PostDetail**
   ```tsx
   import LikeButton from '../../components/LikeButton.client'

   export default async function PostDetail({ params }: { params: Params }) {
     const post = await getPostBySlug(params.slug)

     // ...

     return (
       <Layout>
         <article>
           {/* ... */}
           <LikeButton postSlug={post.slug} />
         </article>
       </Layout>
     )
   }
   ```

### 5.2. Hook useRouter para Navegación Programática

**¿Qué son Server Actions?**

Un **Server Action** es una función async que se ejecuta en el servidor, invocada directamente desde un Client Component. Es la forma moderna de manejar mutaciones en arquitectura RSC.

**Comparativa: API handlers vs Server Actions**

| Aspecto | API handlers (`api/*`) | Server Actions (`'use server'`) |
| --- | --- | --- |
| **Ubicación** | `api/` folder | En cualquier archivo (típicamente en `lib/` o `actions/`) |
| **Cómo se llama** | `fetch('/api/endpoint', { method: 'POST', body: ... })` | Invocación directa como función |
| **Validación** | Manual (validar body) | Automática (tipos TypeScript) |
| **Serialización** | JSON (manual) | Automática (React internals) |
| **Error handling** | Respuesta HTTP | Try/catch directo |
| **Mejor para** | APIs públicas, webhooks, casos complejos | Mutaciones, acciones del usuario |
| **Bundle size** | Pequeño (no se envía al cliente) | Ínfimo (cero bytes en cliente) |

**¿Cuándo usar cada uno?**
- **API handlers:** Cuando necesitas un endpoint reutilizable, webhooks de terceros, o lógica que también consumen APIs externas.
- **Server Actions:** Cuando solo necesitas mutaciones internas (crear, actualizar, eliminar) invocadas desde componentes.

---

#### Server Actions paso a paso

1. **Crear archivo de acciones** (`src/lib/actions.ts`)
   ```ts
   'use server'  // ← Directiva crítica: marca TODA la función como server-side

   import { revalidatePath } from 'waku/server'  // Waku puede revalidar rutas

   // Tipos para mayor seguridad
   interface LikeActionPayload {
     postSlug: string
     action: 'like' | 'unlike'
   }

   interface ActionResult {
     ok: boolean
     message: string
     count?: number
     error?: string
   }

   // Server Action: invocable desde Client Components
   export async function toggleLike(payload: LikeActionPayload): Promise<ActionResult> {
     try {
       const { postSlug, action } = payload

       // Aquí puedes:
       // - Validar datos
       // - Acceder a DB (sin exponer credenciales)
       // - Leer env vars secretas
       // - Hacer logs privados

       console.log(`[Server Action] ${action} on post ${postSlug}`)

       // Simular guardado (en prod, guardarías en DB)
       const success = true

       if (!success) {
         return {
           ok: false,
           error: 'Failed to toggle like',
         }
       }

       // Revalidar la ruta (regenerar HTML si fuera necesario)
       // revalidatePath(`/posts/${postSlug}`)

       return {
         ok: true,
         message: action === 'like' ? 'Post liked!' : 'Like removed',
         count: action === 'like' ? 1 : 0,
       }
     } catch (error: any) {
       console.error('[Server Action Error]', error)
       return {
         ok: false,
         error: error.message || 'Unknown error',
       }
     }
   }

   // Otro Server Action: ejemplo de creación de comentario
   export async function addComment(postSlug: string, text: string): Promise<ActionResult> {
     'use server'  // ← También puedes usar 'use server' aquí (redundante si está en el archivo)

     if (!text || text.length < 3) {
       return {
         ok: false,
         error: 'Comment must be at least 3 characters',
       }
     }

     if (text.length > 500) {
       return {
         ok: false,
         error: 'Comment is too long (max 500 chars)',
       }
     }

     console.log(`[Server Action] New comment on ${postSlug}: "${text}"`)

     // En prod: guardar en DB
     // await db.comments.create({ postSlug, text, createdAt: new Date() })

     return {
       ok: true,
       message: 'Comment added successfully',
     }
   }
   ```

2. **Usar Server Action en Client Component** (`src/components/LikeButtonWithServerAction.client.tsx`)
   ```tsx
   'use client'

   import { useState } from 'react'
   import { toggleLike } from '../lib/actions'

   export default function LikeButtonWithServerAction({ postSlug }: { postSlug: string }) {
     const [liked, setLiked] = useState(false)
     const [count, setCount] = useState(0)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)

     const handleLike = async () => {
       setLoading(true)
       setError(null)

       try {
         const newLiked = !liked
         // Llamada directa al Server Action (¡sin fetch!)
         const result = await toggleLike({
           postSlug,
           action: newLiked ? 'like' : 'unlike',
         })

         if (result.ok) {
           setLiked(newLiked)
           setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)))
         } else {
           setError(result.error || 'Failed to toggle like')
           // Revertir estado si falla
           setLiked(!newLiked)
         }
       } catch (err: any) {
         setError(err.message || 'Unknown error')
       } finally {
         setLoading(false)
       }
     }

     return (
       <div>
         <button
           onClick={handleLike}
           disabled={loading}
           className={`px-4 py-2 border-none rounded ${
             liked ? 'bg-red-400 text-white' : 'bg-gray-300 text-black'
           } ${
             loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
           }`}
         >
           {loading ? '⏳' : liked ? '❤️' : '🤍'} {count} likes
         </button>
         {error && <p className="text-red-600 mt-2">{error}</p>}
       </div>
     )
   }
   ```

3. **Comparación lado a lado: API handler vs Server Action**

   **Opción A: Con API handler (Bloque B)**
   ```tsx
   // Client Component
   const handleLike = async () => {
     const res = await fetch('/api/likes', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ postSlug, action: 'like' }),
     })
     const data = await res.json()
     // Manejo manual de errores HTTP
     if (!res.ok) throw new Error(data.error)
     return data
   }
   ```

   **Opción B: Con Server Action (Bloque C)**
   ```tsx
   // Client Component
   const handleLike = async () => {
     const result = await toggleLike({ postSlug, action: 'like' })
     // Error handling natural (result.ok / result.error)
     if (!result.ok) throw new Error(result.error)
     return result
   }
   ```

   **Diferencias clave:**
   - ✅ **Server Action:** Una línea de código, tipos TypeScript automáticos, sin serialización manual
   - ✅ **API handler:** Más control, reutilizable desde externos, webhooks posibles
   - ❌ **Server Action:** Solo para componentes React internos
   - ❌ **API handler:** Requiere fetch + JSON manual

---

#### Cuándo Server Actions brilla más

**Caso 1: Agregar comentario (validación compleja)**
```tsx
// Server Action es perfecto aquí
export async function addComment(postSlug: string, text: string) {
  'use server'
  
  // Validación robusta
  if (!text.trim()) return { ok: false, error: 'Empty comment' }
  if (text.length > 500) return { ok: false, error: 'Too long' }
  
  // Lógica privada
  const spam = await detectSpam(text)  // Función privada
  if (spam) return { ok: false, error: 'Comment flagged as spam' }
  
  // Guardar en DB con credenciales secretas
  await db.comments.insert({ postSlug, text })
  
  return { ok: true, message: 'Comment added' }
}

// Client Component
<form onSubmit={async (e) => {
  e.preventDefault()
  const result = await addComment(postSlug, formData.text)
  if (result.ok) resetForm()
}}>
```

**Caso 2: Actualizar perfil de usuario**
```tsx
export async function updateProfile(userId: string, data: UserProfileData) {
  'use server'
  
  // Verificar autenticación (acceso a session seguro)
  const session = await getSession()
  if (session.userId !== userId) {
    return { ok: false, error: 'Unauthorized' }
  }
  
  // Actualizar DB
  await db.users.update(userId, data)
  
  return { ok: true, message: 'Profile updated' }
}
```

---

#### Errores frecuentes con Server Actions

- ❌ **Olvidar `'use server'` directive** → La función se ejecuta en cliente, expone secretos
  ```tsx
  // ❌ MALO
  export async function myAction() {  // No tiene 'use server'!
    const secret = process.env.API_KEY  // ❌ Se envía al cliente
  }

  // ✅ BUENO
  'use server'
  export async function myAction() {
    const secret = process.env.API_KEY  // ✅ Seguro en servidor
  }
  ```

- ❌ **Pasar funciones como props desde Server Action** → Las funciones no son serializables
  ```tsx
  // ❌ MALO
  const result = await myAction({ onSuccess: () => console.log('done') })

  // ✅ BUENO: Manejar en Client Component
  const result = await myAction()
  if (result.ok) console.log('done')
  ```

- ❌ **Usar Server Actions para cosas que necesitan API pública** → Úsalo con API handlers
  ```tsx
  // ❌ MALO: Necesito que un bot externo llame esto
  // No puedo exponer un Server Action a internet

  // ✅ BUENO: Mantener API handler para webhooks
  // api/webhook-github.ts → recibe POSTs de GitHub
  ```

---

## 6. Client Components: Interactividad y Estado

### 6.1. Búsqueda client-side y comentarios con JSONPlaceholder

**Meta:** Agregar interactividad client-side, fetchear comentarios reales desde JSONPlaceholder (API pública), sin romper la arquitectura RSC.

**Nota:** En lugar de simular datos, usaremos **JSONPlaceholder** (`jsonplaceholder.typicode.com`), una API pública gratuita que proporciona posts y comentarios reales para desarrollo y testing.

### 6.2. Dark mode con localStorage

**Meta:** Dominar los patrones de integración entre Server Components y Client Components, la base de una arquitectura RSC moderna.

### ¿Qué son Weaving Patterns?

**Weaving Patterns** (patrones de tejido) describe cómo Server Components y Client Components se entrelazan en una aplicación Waku. Es el concepto fundamental para entender:
- ✅ Dónde y cuándo usar cada tipo de componente
- ✅ Cómo fluye la información entre capas
- ✅ Qué límites existen en la composición

**La regla de oro:**
```
┌──────────────────────────────────────┐
│ Server Component (tú aquí)           │
├──────────────────────────────────────┤
│ ✅ Puede importar Client Components  │
│ ❌ No puede recibir Client Components│
│    como imports directos             │
└──────────────────────────────────────┘
                   ↓
        (CREA UN LÍMITE SERVIDOR)
                   ↓
┌──────────────────────────────────────┐
│ Client Component (aquí abajo)        │
├──────────────────────────────────────┤
│ ❌ No puede importar Server Components│
│    directamente como imports          │
│ ✅ PERO puede recibir Server Components│
│    como props (children, etc.)       │
└──────────────────────────────────────┘
```

**En palabras simples:**
- Server Component importa Client Component → ✅ Crea un límite (`use client`)
- Client Component importa Server Component → ❌ NO PERMITIDO
- Client Component recibe Server Component como prop (children) → ✅ PERMITIDO (server islands)

### Bloque D.1 (15 min) – Patrón básico: Server → Client

**Caso 1: Server importa Client directamente**

```tsx
// src/components/Header.server.tsx
import Navigation from './Navigation.client'  // ← Import directo

export default function Header() {
  return (
    <header>
      <h1>DevBlog</h1>
      <Navigation />  {/* ← Se renderiza como Client Component */}
    </header>
  )
}
```

```tsx
// src/components/Navigation.client.tsx
'use client'  // ← Marca el límite servidor-cliente

import { useState } from 'react'

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Cerrar' : 'Menú'}
      </button>
      {open && (
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      )}
    </nav>
  )
}
```

**¿Qué sucede en Waku?**

1. Waku renderiza `Header.server.tsx` en el servidor
2. Encuentra que importa `Navigation.client.tsx`
3. Incluye `'use client'` en el bundle del cliente
4. Al renderizar, reemplaza `Navigation` con un componente hidratado en el navegador
5. Usuario puede usar `setState`, `onClick`, etc. en `Navigation`

---

### Bloque D.2 (15 min) – El patrón clave: Providers + Children

**El problema:** ¿Cómo agregar un Context provider (Client Component) a toda tu app sin "contaminar" todo con `'use client'`?

**La solución: Composición con children**

Server Component puede recibir Client Components como props (especialmente `children`):

```tsx
// src/components/Providers.client.tsx
'use client'

import { createContext, ReactNode } from 'react'
import { Provider } from 'jotai'

export const ThemeContext = createContext({})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <div>{children}</div>
    </Provider>
  )
}
```

```tsx
// src/pages/_layout.tsx (Server Component)
import { Providers } from '../components/Providers.client'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <title>DevBlog</title>
      </head>
      <body>
        {/* Providers es Client Component, pero se pasa como composición */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
```

**Ventaja:**
- ✅ Layout está en servidor (lógica de datos rápida)
- ✅ Providers (context, hooks) están en cliente
- ✅ `children` fluyen desde servidor → cliente sin problemas
- ✅ NO necesitas `'use client'` en el layout

**Flujo:**
```
RootLayout (Server)
  ↓
  Providers (Client, recibe children como prop)
    ↓
    {children} (puede ser Server o Client)
      ↓
      Pages + Components
```

---

### Bloque D.3 (15 min) – Patrón avanzado: Server Components como children

**El caso de uso:** Necesitas un Client Component "wrapper" (botón, modal, etc.) pero querés que el contenido sea Server Component (para data fetching).

```tsx
// src/components/Modal.client.tsx
'use client'

import { useState, ReactNode } from 'react'

export function Modal({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>Abrir: {title}</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg min-w-[300px]">
            <h2>{title}</h2>
            {children}  {/* ← Children pueden ser Server Component */}
            <button onClick={() => setOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  )
}
```

```tsx
// src/components/RelatedPostsList.server.tsx (Server Component)
import { getPosts } from '../lib/posts'

export async function RelatedPostsList() {
  const posts = await getPosts()  // ← Server-side data fetching

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/posts/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// src/pages/posts/[slug].tsx (Server Component)
import { Modal } from '../../components/Modal.client'
import { RelatedPostsList } from '../../components/RelatedPostsList.server'

export default async function PostDetail() {
  return (
    <article>
      <h1>Mi Post</h1>
      <p>Contenido...</p>

      {/* Modal es Client (interactividad), 
          pero children es Server Component (data fetching) */}
      <Modal title="Posts Relacionados">
        <RelatedPostsList />
      </Modal>
    </article>
  )
}
```

**Ventaja clave:**
- ✅ Modal maneja estado de UI (open/closed)
- ✅ RelatedPostsList fetcha posts en servidor sin exponer datos
- ✅ No necesitas API call desde cliente
- ✅ Máxima seguridad y eficiencia

---

### Bloque D.4 (Práctica DevBlog - 10 min) – Implementar Weaving en DevBlog

**Escenario:** Mejorar el componente `ThemeToggle` usando un Provider con Weaving Pattern.

**Paso 1: Crear Provider personalizado** (`src/components/ThemeProvider.client.tsx`)

```tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', JSON.stringify(isDark))
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    }
  }, [isDark, mounted])

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}
```

**Paso 2: Actualizar layout** (`src/pages/_layout.tsx`)

```tsx
import { ThemeProvider } from '../components/ThemeProvider.client'
import Header from '../components/Header.server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>  {/* ← Client Component, maneja contexto */}
      <Header />     {/* ← Server Component, lógica rápida */}
      <main>{children}</main>
    </ThemeProvider>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
```

**Paso 3: Usar contexto en componentes cliente** (`src/components/ThemeToggle.client.tsx` actualizado)

```tsx
'use client'

import { useTheme } from './ThemeProvider.client'

export default function ThemeToggle() {
  const { isDark, setIsDark } = useTheme()

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="bg-transparent border-none text-2xl cursor-pointer"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

**Beneficio Weaving Pattern:**
- ✅ `RootLayout` permanece como Server Component (puedes usar `await`, data fetching, etc.)
- ✅ `ThemeProvider` inyecta context sin contaminar layout
- ✅ `Header` sigue siendo Server Component puro
- ✅ Máxima composabilidad

---

### Bloque D.5 – Visualización del flujo Weaving en DevBlog

```
_layout.tsx (SERVER)
  ├─ ThemeProvider (CLIENT - crea límite)
  │   ├─ Header.server.tsx (SERVER - vía children)
  │   │   └─ Navigation.client.tsx (CLIENT)
  │   ├─ main (SERVER - vía children)
  │   │   ├─ Pages (SERVER)
  │   │   └─ Modal.client.tsx (CLIENT - vía composition)
  │   │       └─ RelatedPostsList.server.tsx (SERVER - vía children!)
  │   └─ Footer.server.tsx (SERVER)
  └─ (Todos los children fluyen a través de ThemeProvider)
```

**Puntos clave:**
- `_layout.tsx` es Server, pero usa Client Component (`ThemeProvider`) para inyectar contexto
- Server Components pueden fluir como `children` a través de Client Components
- No hay límite de "profundidad" — puedes anidar Server-Client-Server-Client
- El flujo es siempre: Server renderiza → encuentra Client import → hidrata cliente

---

### Bloque D.6 – Errores frecuentes con Weaving Patterns

- ❌ **Intentar importar Server Component en Client Component**
  ```tsx
  // ❌ MALO
  'use client'
  import { ServerComponent } from './ServerComponent.server'  // ❌ Error!

  // ✅ BUENO: Pasar como prop
  export function ClientWrapper({ children }) {
    return <div>{children}</div>
  }
  // Luego: <ClientWrapper><ServerComponent /></ClientWrapper>
  ```

- ❌ **Olvidar `'use client'` en componentes que usan hooks**
  ```tsx
  // ❌ MALO
  import { useState } from 'react'

  export function Counter() {  // ← ¿Dónde está 'use client'?
    const [count, setState] = useState(0)
    return <button>{count}</button>
  }

  // ✅ BUENO
  'use client'
  import { useState } from 'react'

  export function Counter() {
    const [count, setState] = useState(0)
    return <button>{count}</button>
  }
  ```

- ❌ **Pasar funciones como props desde Server a Client**
  ```tsx
  // ❌ MALO
  export default async function Page() {
    const handleClick = () => console.log('clicked')
    return <ClientComponent onClick={handleClick} />  // ❌ No serializable
  }

  // ✅ BUENO
  'use client'
  export function ClientComponent() {
    const handleClick = () => console.log('clicked')
    return <button onClick={handleClick}>Click me</button>
  }
  ```

---

### Checklist Día 4 Bloque D

- [ ] Entiendes la diferencia: Server puede importar Client, pero no al revés
- [ ] Has creado un `Providers` Client Component que envuelve Server layout
- [ ] Has usado `useContext` en un Client Component para acceder a datos
- [ ] Modal.client.tsx contiene Server Component como children (sin errores)
- [ ] `ThemeProvider` se aplica a todo DevBlog y funciona correctamente
- [ ] Build (`pnpm build`) sin warnings sobre `'use client'`

#### Checklist: Client Components y Interactividad

- [ ] Búsqueda filtra posts en real time (sin reload).
- [ ] Dark mode persiste en localStorage.
- [ ] Botón tema funciona sin flickering.
- [ ] State local (query, isDark) vive solo en Client Components.
- [ ] ✅ **JSONPlaceholder:** `CommentsList.client.tsx` fetchea comentarios reales
- [ ] ✅ **Loading state:** Muestra "⏳ Cargando comentarios..." mientras fetcha
- [ ] ✅ **Error handling:** Si falla la API, muestra mensaje amigable
- [ ] ✅ **Mapeo de slug a postId:** Verifica que cada post mapea a un ID válido (1-100)
- [ ] ✅ **Network tab:** Revisa que JSONPlaceholder es llamado (sin errors CORS)

---

## 7. Weaving Patterns: Integrando Server y Client Components

**Meta:** Entender Slices como unidad fundamental de composición en Waku, diferente de páginas y layouts.

### ¿Qué son Slices?

En Waku, un **Slice** es un componente reutilizable que vive en `src/pages/_slices/` y puede ser **compuesto dentro de páginas y otros slices**. A diferencia de:
- **Páginas:** Representan rutas (generan URLs)
- **Layouts:** Envuelven otras páginas (estructuras globales)
- **Slices:** Unidades de renderizado independientes que se reutilizan en múltiples contextos

**Ventaja clave:** Slices permiten tener **componentes estáticos dentro de una página dinámica** — un patrón llamado "server islands" o "partial prerendering".

**Ejemplo arquitectónico:**
```
/posts/hello-world (Página - DINÁMICA)
├── Layout (ESTÁTICO)
├── Post content (ESTÁTICO)
├── AuthorBio Slice (ESTÁTICO)
├── RelatedPosts Slice (ESTÁTICO)
└── NewsletterSignup Slice (DINÁMICO - carga independientemente)
```

El resultado: **Página mayormente estática, partes selectas dinámicas, máxima eficiencia.**

---

### 8.1. Crear tu primer Slice

1. **Crear slice simple** (`src/pages/_slices/author-bio.tsx`)
   ```tsx
   export default function AuthorBio() {
     return (
       <aside className="p-6 bg-gray-100 rounded-lg mt-8 border-l-4 border-blue-600">
         <h3>✍️ Sobre el autor</h3>
         <p>
           <strong>Ariel</strong> es un desarrollador Full Stack especializado en React Server Components 
           y arquitecturas modernas. Apasionado por enseñar conceptos complejos de forma simple.
         </p>
         <p className="mt-2 text-gray-600 text-sm">
           📧 <a href="mailto:ariel@example.com">Contactame</a>
         </p>
       </aside>
     )
   }

   // ⚠️ CRÍTICO: Slices necesitan getConfig
   export const getConfig = async () => {
     return {
       render: 'static', // Por defecto, renderizar estáticamente
     } as const
   }
   ```

2. **Crear slice con props** (`src/pages/_slices/related-posts.tsx`)
   ```tsx
   interface RelatedPost {
     slug: string
     title: string
   }

   export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
     return (
       <aside className="p-6 bg-gray-50 rounded-lg mt-8">
         <h3>📚 Posts relacionados</h3>
         {posts.length === 0 ? (
           <p className="text-gray-600">No hay posts relacionados.</p>
         ) : (
           <ul className="list-none p-0">
             {posts.map((post) => (
               <li key={post.slug} className="mb-3">
                 <a href={`/posts/${post.slug}`} className="text-blue-600 underline">
                   {post.title}
                 </a>
               </li>
             ))}
           </ul>
         )}
       </aside>
     )
   }

   export const getConfig = async () => {
     return {
       render: 'static',
     } as const
   }
   ```

3. **Integrar slices en página de post** (`src/pages/posts/[slug].tsx`)
   ```tsx
   import type { PageProps } from 'waku/router'
   import { Slice } from 'waku'  // ← Importar componente Slice
   import { getPostBySlug, getPosts } from '../../lib/posts'
   import Layout from '../../components/Layout.server'
   import CommentsList from '../../components/CommentsList.client'

   export default async function PostDetail({ slug }: PageProps<'/posts/[slug]'>) {
     const post = await getPostBySlug(slug)

     if (!post) {
       return (
         <Layout>
           <h1>Post no encontrado</h1>
           <p><a href="/">Volver al inicio</a></p>
         </Layout>
       )
     }

     // Ejemplo: posts relacionados (en prod, buscar por tags/categoría)
     const allPosts = await getPosts()
     const relatedPosts = allPosts
       .filter((p) => p.slug !== post.slug)
       .slice(0, 3)
       .map((p) => ({ slug: p.slug, title: p.title }))

     const postId = Math.abs(
       post.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
     ) % 100 + 1

     return (
       <Layout>
         <article>
           <h1>{post.title}</h1>
           <p className="text-gray-600 text-sm">
             📅 {new Date(post.date).toLocaleDateString('es-ES')}
           </p>

           <div
             className="mt-8 leading-relaxed"
             dangerouslySetInnerHTML={{
               __html: post.content.replace(/^# .+$/gm, ''),
             }}
           />

           {/* 🟢 USAR SLICES */}
           <Slice id="author-bio" />
           <Slice id="related-posts" posts={relatedPosts} />

           <CommentsList postId={postId} />

           <nav className="mt-8 pt-8 border-t border-gray-300">
             <a href="/">← Volver a posts</a>
           </nav>
         </article>
       </Layout>
     )
   }

   // ⚠️ CRÍTICO: Declarar qué slices se usan en esta página
   export const getConfig = async () => {
     return {
       render: 'static',
       slices: ['author-bio', 'related-posts'],  // ← LISTA TODOS LOS SLICES
     } as const
   }
   ```

### 8.2. Slices Lazy (Server Islands)

**¿Qué son Lazy Slices?**

Un **lazy slice** es un slice que se renderiza **independientemente** del rest de la página. Mientras la página estática se sirve inmediatamente, el slice lazy se carga en un request separado. Perfecto para:
- Componentes que son lentos (consultas DB pesadas)
- Contenido dinámico (contador actualizado cada 5 min)
- Interactividad pesada (formularios con validación compleja)

**Ejemplo:**
```
/posts/hello-world carga 50ms ← HTML estático
  Pero NewsletterSignup (lazy) carga 300ms ← Request separado

Resultado: Usuario ve post inmediatamente, signup aparece después (con fallback)
```

1. **Crear slice lazy dinámico** (`src/pages/_slices/newsletter-signup.tsx`)
   ```tsx
   'use client'  // ← Este slice es interactivo, necesita hidratación

   import { useState } from 'react'

   export default function NewsletterSignup() {
     const [email, setEmail] = useState('')
     const [submitted, setSubmitted] = useState(false)
     const [loading, setLoading] = useState(false)

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
       setLoading(true)

       try {
         // Simular envío (en prod: guardar en BD)
         await new Promise((resolve) => setTimeout(resolve, 500))
         setSubmitted(true)
         setEmail('')
       } finally {
         setLoading(false)
       }
     }

     if (submitted) {
       return (
         <div className="p-4 bg-green-100 rounded text-green-800 text-center">
           ✅ ¡Gracias por suscribirte!
         </div>
       )
     }

     return (
       <form onSubmit={handleSubmit} className="p-6 bg-blue-50 rounded-lg mt-8">
         <h3>📬 Suscríbete a las novedades</h3>
         <p className="text-gray-600 mb-4">
           Recibe notificaciones cuando publique nuevos posts.
         </p>
         <div className="flex gap-2">
           <input
             type="email"
             placeholder="tu@email.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="flex-1 p-2 rounded border border-gray-300"
           />
           <button
             type="submit"
             disabled={loading}
             className={`px-4 py-2 bg-blue-600 text-white border-none rounded ${
               loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
             }`}
           >
             {loading ? '⏳' : '✉️ Suscribir'}
           </button>
         </div>
       </form>
     )
   }

   export const getConfig = async () => {
     return {
       render: 'dynamic',  // ← DINÁMICO: Renderizar on-demand
     } as const
   }
   ```

2. **Usar lazy slice en página** (`src/pages/posts/[slug].tsx` actualizado)
   ```tsx
   export default async function PostDetail({ params }: { params: Params }) {
     // ... código anterior ...

     return (
       <Layout>
         <article>
           {/* Slices estáticos */}
           <Slice id="author-bio" />
           <Slice id="related-posts" posts={relatedPosts} />

           {/* Slice dinámico: carga con fallback */}
           <Slice 
             id="newsletter-signup" 
             lazy 
             fallback={<p className="p-4 text-center">⏳ Cargando formulario de suscripción...</p>} 
           />

           <CommentsList postId={postId} />
         </article>
       </Layout>
     )
   }

   export const getConfig = async () => {
     return {
       render: 'static',
       slices: ['author-bio', 'related-posts'],  // ⚠️ Nota: newsletter-signup NO va aquí
       // porque es lazy, se carga independientemente
     } as const
   }
   ```

3. **Flujo de renderizado con lazy slices**
   ```
   1. Usuario abre /posts/hello-world
                          ↓
   2. Waku sirve HTML estático (header, post, author-bio, related-posts)
      con fallback para newsletter-signup: "⏳ Cargando..."
                          ↓
   3. Browser recibe HTML, renderiza inmediatamente
      Usuario ve post, author-bio, related-posts al instante
                          ↓
   4. En paralelo: Browser hace request al servidor por newsletter-signup
                          ↓
   5. Servidor renderiza NewsletterSignup.tsx (Cliente Component hidratado)
                          ↓
   6. HTML de newsletter-signup se reemplaza en la página
      Usuario ve formulario interactivo
   ```

   **Ventaja visual:** Percepción de velocidad mejorada. La página es usable inmediatamente.

### 8.3. Slices anidados

**¿Slices dentro de slices?**

Sí, puedes anidar slices en carpetas:
```
src/pages/_slices/
├── author-bio.tsx              → ID: "author-bio"
├── related-posts.tsx           → ID: "related-posts"
├── newsletter-signup.tsx       → ID: "newsletter-signup"
└── sidebar/
    ├── ad-slot.tsx             → ID: "sidebar/ad-slot"
    └── social-links.tsx        → ID: "sidebar/social-links"
```

Uso:
```tsx
<Slice id="sidebar/ad-slot" />
<Slice id="sidebar/social-links" />
```

**Patrón común:** Organizar por feature o sección.

### 8.4. Estructura del proyecto actualizada

Actualiza el diagrama de carpetas en tu mente:

```
src/
  pages/
    _root.tsx                  # Customizar <html>, <head>, <body>
    _layout.tsx                # Root layout (Header, Footer)
    index.tsx                  # Página home
    about.tsx                  # Página about
    posts/
      [slug].tsx               # Ruta dinámica para posts individuales
      [...notFound].tsx        # Catch-all 404
    _slices/                   # 🟢 NUEVA SECCIÓN: Slices reutilizables
      author-bio.tsx
      related-posts.tsx
      newsletter-signup.tsx
      sidebar/
        ad-slot.tsx
        social-links.tsx
    api/
      likes.ts                 # Endpoint para likes
      comments.ts              # Endpoint para comentarios
  components/
    Header.server.tsx
    SearchBar.client.tsx
    CommentsList.client.tsx
    LikeButton.client.tsx
  lib/
    posts.ts                   # Carga y parseo de posts Markdown
    actions.ts                 # Server Actions (opcional)
  posts/                       # Archivos .md
    hello-world.md
    waku-rsc-guide.md
```

#### Checklist: Slices

- [ ] Folder `src/pages/_slices/` existe
- [ ] Slice `author-bio.tsx` renderiza en página de post
- [ ] Props se pasan correctamente a `related-posts`
- [ ] `getConfig` declara `slices: ['author-bio', 'related-posts']`
- [ ] ✅ Lazy slice: `newsletter-signup` tiene `render: 'dynamic'`
- [ ] ✅ Lazy slice: Usa `fallback` en `<Slice lazy fallback={...} />`
- [ ] Build: `pnpm build` genera slices correctamente
- [ ] Test: Abre `/posts/hello-world`, todos los slices se renderizan

---

### Ventajas pedagógicas de Slices en DevBlog

1. **Reutilización:** `author-bio` se usa en TODOS los posts sin duplicar código
2. **Composición:** Página se arma combinando componentes independientes
3. **Performance:** Slices estáticos no regeneran si post no cambia
4. **Server Islands:** Lazy slices demuestran renderizado parcial (concepto moderno)
5. **Escalabilidad:** Puedes agregar `sidebar/trending-tags.tsx` sin tocar páginas existentes

---

### Errores frecuentes con Slices

- ❌ **Olvidar `getConfig` en slice** → Waku no sabe si es estático o dinámico
- ❌ **No declarar slices en `getConfig.slices`** → Página se prerenderea sin esperar slice estático
- ❌ **Usar lazy slice con props** → Props no se serializan en lazy slices (solo valores simples)
  ```tsx
  // ❌ MALO
  <Slice id="my-slice" lazy complex={{ nested: { obj: true } }} />
  
  // ✅ BUENO: Solo props simples
  <Slice id="my-slice" lazy postId={123} />
  ```
- ❌ **Circular slices** → Un slice A no puede usar Slice B si B usa Slice A

---

### Patrón real en DevBlog (Post detail completo)

```tsx
// src/pages/posts/[slug].tsx
import { Slice } from 'waku'
import { getPostBySlug, getPosts } from '../../lib/posts'
import Layout from '../../components/Layout.server'
import CommentsList from '../../components/CommentsList.client'

export default async function PostDetail({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug)
  const relatedPosts = await getPosts().then((posts) =>
    posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  )

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        {/* Post content */}
        <div>{post.content}</div>

        {/* Slices estáticos */}
        <Slice id="author-bio" />
        <Slice id="related-posts" posts={relatedPosts} />
        <Slice id="sidebar/ad-slot" />

        {/* Slice dinámico */}
        <Slice
          id="newsletter-signup"
          lazy
          fallback={<p>⏳ Newsletter cargando...</p>}
        />

        {/* Cliente component */}
        <CommentsList postId={postId} />
      </article>
    </Layout>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
    slices: [
      'author-bio',
      'related-posts',
      'sidebar/ad-slot',
      // newsletter-signup NO va aquí porque es lazy
    ],
  } as const
}
```

**Resultado:**
- 📄 HTML estático (header + post + author + related + ad)
- ⏳ Newsletter se carga lazy (formulario interactivo)
- 💬 Comentarios se cargan lazy (Client Component)
- ⚡ Página usable en <100ms
- 🎯 SEO friendly (contenido en HTML inicial)

---

## 9. Mutations: API Endpoints y Server Actions

### 9.1. API Handlers

**Meta:** Implementar APIs de mutaciones para likes, comentarios y otras acciones del usuario.

1. **Testing manual**
   ```
   - Página inicio carga rápido
   - Búsqueda filtra sin delays
   - Dark mode persiste (recarga = sigue oscuro)
   - Click en post → abre `/posts/[slug]`
   - Like button funciona
   - Desactiva JS → contenido visible (posts, títulos)
   ```

2. **Ejecutar Lighthouse**
   ```bash
   pnpm dev
   # Abre Chrome DevTools → Lighthouse
   # Click "Generate report"
   # Objetivo: ≥90 en Performance, Accessibility, Best Practices
   ```

3. **Optimizaciones comunes**
   - **CSS critical:** Inline estilos en `<style>` dentro de `<head>`.
   - **Imágenes:** Usa rutas estáticas en `public/`, lazy load con `loading="lazy"`.
   - **Fuentes:** System fonts son más rápidas que Google Fonts (para esta guía).

### 9.2. Server Actions: Alternativa moderna a API handlers

**¿Qué son Server Actions?**

Un **Server Action** es una función async que se ejecuta en el servidor, invocada directamente desde un Client Component. Es la forma moderna de manejar mutaciones en arquitectura RSC.

**Comparativa: API handlers vs Server Actions**

| Aspecto | API handlers (`api/*`) | Server Actions (`'use server'`) |
| --- | --- | --- |
| **Ubicación** | `api/` folder | En cualquier archivo (típicamente en `lib/` o `actions/`) |
| **Cómo se llama** | `fetch('/api/endpoint', { method: 'POST', body: ... })` | Invocación directa como función |
| **Validación** | Manual (validar body) | Automática (tipos TypeScript) |
| **Serialización** | JSON (manual) | Automática (React internals) |
| **Error handling** | Respuesta HTTP | Try/catch directo |
| **Mejor para** | APIs públicas, webhooks, casos complejos | Mutaciones, acciones del usuario |
| **Bundle size** | Pequeño (no se envía al cliente) | Ínfimo (cero bytes en cliente) |

**¿Cuándo usar cada uno?**
- **API handlers:** Cuando necesitas un endpoint reutilizable, webhooks de terceros, o lógica que también consumen APIs externas.
- **Server Actions:** Cuando solo necesitas mutaciones internas (crear, actualizar, eliminar) invocadas desde componentes.

#### Checklist: Mutations

- [ ] `pnpm build` genera archivos HTML para cada post en `dist/posts/[slug]/`.
- [ ] `/posts/hello-world` se renderiza correctamente.
- [ ] **API handler:** Like button funciona con fetch POST.
- [ ] **Server Action:** Like button alternativo funciona sin fetch.
- [ ] Comparación: Ambas opciones funcionan, entiendes cuándo usar cada una.
- [ ] Rutas 404 se manejan gracefully.

---

## 10. Data Fetching: Cargar Datos en Server y Client

### 10.1. Server-Side Data Fetching (Recomendado)

### 10.2. Client-Side Data Fetching

### 10.3. Configuración de Data Fetching en getConfig

---

## 11. Environment Variables

### 11.1. Variables Privadas vs Públicas

### 11.2. Configurar .env.local

### 11.3. Acceder a Variables en DevBlog

#### Checklist: Environment Variables

- [ ] `.env.local` creado en raíz del proyecto
- [ ] Variables privadas NO tienen prefijo `WAKU_PUBLIC_`
- [ ] Variables públicas tienen prefijo `WAKU_PUBLIC_`
- [ ] Server Components usan `getEnv()` o `process.env`
- [ ] Client Components usan `import.meta.env`
- [ ] `.env.local` está en `.gitignore`
- [ ] `.env.example` documentado para otros devs

---

## 12. Optimización y Deployment

### 12.1. QA y Lighthouse

1. **Build estático**
   ```bash
   pnpm build
   # Revisa dist/:
   # - dist/index.html (homepage)
   # - dist/posts/*/index.html (rutas dinámicas)
   # - dist/api/ (handlers Edge)
   # - dist/_assets/ (JS, CSS bundleado)
   ```

2. **Verificar localmente**
   ```bash
   pnpm preview
   # Abre http://localhost:4173
   # Navega por posts, prueba búsqueda
   ```

3. **Deploy a Vercel (opción 1 - recomendada para Waku)**
   ```bash
   pnpm install -g vercel
   vercel
   # Follow prompts
   # - Framework: Other
   # - Build: pnpm build
   # - Output: dist
   ```

   Vercel automáticamente:
   - Detecta archivos en `api/` como Edge Functions
   - Sirve `dist/` como estático
   - CDN global incluido

4. **Deploy a Cloudflare Pages (opción 2)**
   ```bash
   pnpm install -g wrangler
   wrangler pages deploy dist/
   ```

5. **Smoke test en prod**
   ```
   - Abre URL deployada
   - Verifica que posts cargan
   - Prueba búsqueda
   - Like button funciona (revisa Network)
   ```

### 12.2. Build y Deploy

### 12.3. Deployment en Netlify (Paso a Paso)

#### Checklist: Optimización y Deploy

- [ ] Build ejecuta sin errores.
- [ ] `dist/` existe con HTML estáticos.
- [ ] Lighthouse score ≥ 90.
- [ ] App deployada y funcionando.
- [ ] URLs compartibles funcionan (posts, etc.).

#### Errores frecuentes

- ❌ Build fallido → Revisa errores con `pnpm build` localmente.
- ❌ 404 en rutas → ¿Generaste correctamente con `defineEntries`?
- ❌ API no responde en prod → Verifica env vars en Vercel/Cloudflare.

---

## 13. Recursos y referencia

- **Docs Waku:** https://waku.gg/docs — Documentación oficial
- **Repo ejemplos:** https://github.com/dai-shi/waku-examples
- **React RFC RSC:** https://github.com/facebook/react/discussions/tag/rsc — Entender qué son RSC
- **Playground:** https://waku.gg/playground — Prueba online sin instalar
- **Comunidad:** Discord Waku para preguntas

---

## 14. Referencia Completa: API Endpoints

### ¿Qué son API Endpoints?

En Waku, los endpoints de API son funciones que viven en `src/pages/api/` y manejan requests HTTP directamente. Son útiles para:
- ✅ Mutaciones que necesitan ser llamadas desde múltiples clientes externos
- ✅ Webhooks de terceros (GitHub, Stripe, etc.)
- ✅ Datos que requieren validación antes de procesarse
- ✅ Recursos estáticos generados (RSS, sitemap XML)

### Crear un API Endpoint para DevBlog

**Ejemplo: Guardar likes en un archivo JSON** (`src/pages/api/likes.ts`)

```tsx
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Tipo para likes
interface LikesData {
  [slug: string]: number
}

// Archivo donde guardamos likes
const likesFile = join(process.cwd(), '.data', 'likes.json')

// Función auxiliar para leer likes
function getLikes(): LikesData {
  try {
    const data = readFileSync(likesFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Función auxiliar para guardar likes
function saveLikes(data: LikesData) {
  writeFileSync(likesFile, JSON.stringify(data, null, 2))
}

// GET /api/likes?slug=hello-world → Obtener likes de un post
export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      return new Response(JSON.stringify({ error: 'slug es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const likes = getLikes()
    const postLikes = likes[slug] || 0

    return new Response(JSON.stringify({ slug, likes: postLikes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST /api/likes → Incrementar likes
export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return new Response(JSON.stringify({ error: 'slug es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const likes = getLikes()
    likes[slug] = (likes[slug] || 0) + 1

    saveLikes(likes)

    return new Response(JSON.stringify({ slug, likes: likes[slug] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

### Llamar API Endpoint desde Cliente (DevBlog)

```tsx
// src/components/LikeButton.client.tsx
'use client'

import { useState } from 'react'

export function LikeButton({ postSlug }: { postSlug: string }) {
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: postSlug }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLike} disabled={loading}>
      ❤️ {likes} Likes {loading && '...'}
    </button>
  )
}
```

### Diferencia: API Endpoint vs Server Action

| Aspecto | API Endpoint | Server Action |
|---------|--------------|----------------|
| **Ubicación** | `api/*.ts` | Cualquier archivo con `'use server'` |
| **HTTP Methods** | GET, POST, PUT, DELETE, etc. | Solo POST (internamente) |
| **Reutilizable** | Desde cualquier cliente (fetch, curl, etc.) | Solo desde componentes React |
| **Ideal para** | Webhooks, APIs públicas, RSS | Mutaciones internas de la app |

---

## 15. Referencia Completa: Data Fetching

### Server-Side Data Fetching (Recomendado)

**Ventaja:** Los datos se cargan en build time (SSG) o request time (SSR), sin exponer lógica al cliente.

**Ejemplo: Fetchar comentarios en Server Component**

```tsx
// src/components/PostComments.server.tsx
interface Comment {
  id: number
  postId: number
  name: string
  body: string
}

export async function PostComments({ postId }: { postId: number }) {
  // Fetch ocurre en servidor (NO llega al cliente)
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  )
  const comments: Comment[] = await response.json()

  return (
    <section>
      <h2>Comentarios ({comments.length})</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

**Uso en página de post (DevBlog)**

```tsx
// src/pages/posts/[slug].tsx
import PostComments from '../../components/PostComments.server'

export default async function PostDetail({ params }: { params: { slug: string } }) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>
      
      {/* Componente servidor que fetcha comentarios */}
      <PostComments postId={1} />
    </article>
  )
}
```

### Client-Side Data Fetching

**Uso:** Cuando necesitas datos dinámicos en Client Components (búsqueda, filtrado en tiempo real).

```tsx
// src/components/DynamicPostSearch.client.tsx
'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

export function DynamicPostSearch() {
  const [posts, setPosts] = useState<Post[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) return

    setLoading(true)
    fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar por título (JSONPlaceholder no soporta búsqueda real)
        const filtered = data.filter((post: Post) =>
          post.title.toLowerCase().includes(query.toLowerCase())
        )
        setPosts(filtered)
      })
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Cargando...</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Configuración de Data Fetching en getConfig

```tsx
// Datos que cambian con cada request → render: 'dynamic'
export const getConfig = async () => {
  return {
    render: 'dynamic', // Request time rendering
  } as const
}

// Datos que no cambian → render: 'static'
export const getConfig = async () => {
  return {
    render: 'static',  // Build time rendering
    staticPaths: ['post-1', 'post-2'], // Si es ruta dinámica
  } as const
}
```

---

## 16. Referencia Completa: Environment Variables

### Variables Privadas vs Públicas

**Variables Privadas (secretos):**
- ✅ Accesibles solo en Server Components
- ✅ Nunca se exponen al cliente
- ✅ Ejemplos: API keys, database URLs

**Variables Públicas:**
- ✅ Accesibles en Client y Server
- ✅ Se envían al navegador en el bundle JS
- ✅ Requieren prefijo `WAKU_PUBLIC_`

### Configurar .env.local

```bash
# .env.local
# Privadas (no en el bundle)
DATABASE_URL=postgres://user:pass@localhost/db
API_SECRET=sk_live_abc123xyz789

# Públicas (SÍ en el bundle - úsalo solo para configuración no sensible)
WAKU_PUBLIC_SITE_NAME=DevBlog
WAKU_PUBLIC_API_URL=https://api.example.com
```

### Acceder a Variables en DevBlog

**Server Component (acceso a privadas):**

```tsx
// src/pages/index.tsx
import { getEnv } from 'waku'

export default async function HomePage() {
  // Acceso a variable privada (SOLO en servidor)
  const databaseUrl = getEnv('DATABASE_URL')

  // Acceso a variable pública
  const siteName = getEnv('WAKU_PUBLIC_SITE_NAME')

  // Usar databaseUrl para conectar DB, etc.

  return (
    <h1>{siteName}</h1>
  )
}
```

**Client Component (solo públicas):**

```tsx
// src/components/ApiUrl.client.tsx
'use client'

export function ApiUrl() {
  // ✅ Funciona (pública)
  const apiUrl = import.meta.env.WAKU_PUBLIC_API_URL

  // ❌ NO funciona (privada, sería undefined)
  // const secret = import.meta.env.API_SECRET  // undefined

  return <p>API: {apiUrl}</p>
}
```

### Acceso Compatible (Node.js)

```tsx
// También soportado en Server Components
const secret = process.env.API_SECRET
const publicSite = process.env.WAKU_PUBLIC_SITE_NAME
```

### Checklist Environment Variables

- [ ] `.env.local` creado en raíz del proyecto
- [ ] Variables privadas NO tienen prefijo `WAKU_PUBLIC_`
- [ ] Variables públicas tienen prefijo `WAKU_PUBLIC_`
- [ ] Server Components usan `getEnv()` o `process.env`
- [ ] Client Components usan `import.meta.env`
- [ ] `.env.local` está en `.gitignore`
- [ ] `.env.example` documentado para otros devs

---

## 17. Referencia Completa: Navegación

**Meta:** Dominar la navegación entre páginas usando el componente `Link` y el hook `useRouter`.

---

### ¿Qué es la navegación en Waku?

La navegación en Waku permite moverse entre páginas de forma eficiente mediante:
- **`<Link />`**: Componente para enlaces internos con prefetch automático.
- **`useRouter()`**: Hook para navegación programática e información de ruta actual.

Ambos están optimizados para el modelo de Server Components, permitiendo transiciones rápidas sin recargas completas de página.

---

### Componente `Link`

El componente `<Link />` se usa para enlaces internos dentro de tu aplicación Waku. Reemplaza los elementos `<a>` tradicionales para obtener:
- ✅ **Prefetch automático**: Las rutas destino se precargan antes de hacer clic.
- ✅ **Navegación sin recarga**: Transiciones instantáneas entre páginas.
- ✅ **Optimización RSC**: Compatible con Server y Client Components.

#### Sintaxis básica

```tsx
import { Link } from 'waku';

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/about">Sobre Nosotros</Link>
      <Link to="/posts/hello-world">Leer Primer Post</Link>
    </>
  );
}
```

#### Props de `Link`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `to` | `string` | Ruta destino (requerido). Debe comenzar con `/` para rutas absolutas. |
| `children` | `ReactNode` | Contenido del enlace (texto, iconos, etc.). |
| Otros props HTML | - | Acepta props estándar de `<a>` como `className`, `style`, etc. |

#### Ejemplo en DevBlog: Header con navegación

```tsx
// src/components/Header.server.tsx
import { Link } from 'waku';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <nav className="flex gap-6">
        <Link to="/" className="hover:text-blue-400">
          🏠 Home
        </Link>
        <Link to="/about" className="hover:text-blue-400">
          ℹ️ About
        </Link>
        <Link to="/posts/hello-world" className="hover:text-blue-400">
          📝 Blog
        </Link>
      </nav>
    </header>
  );
}
```

#### ¿Cuándo usar `Link`?

- ✅ **Navegación dentro de tu app**: Siempre usa `<Link>` para rutas internas (`/about`, `/posts/[slug]`).
- ❌ **Enlaces externos**: Para sitios externos (https://example.com), usa `<a href="..." target="_blank">`.
- ❌ **Descargas o anchors**: Para `#section` o archivos PDF, usa `<a>`.

---

### Hook `useRouter`

El hook `useRouter()` permite:
1. **Leer información de la ruta actual** (path, query params).
2. **Navegar programáticamente** (sin hacer clic en un link).

**Importante**: `useRouter()` solo funciona en **Client Components** (archivos con `'use client'`).

#### Importar y usar

```tsx
'use client';

import { useRouter } from 'waku';

export function MyComponent() {
  const router = useRouter();
  
  // Usar propiedades y métodos del router...
}
```

---

### Propiedades del router

El objeto `router` tiene dos propiedades principales:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `path` | `string` | Ruta actual sin query params. Ej: `/posts/hello-world` |
| `query` | `string` | Query string actual (sin el `?`). Ej: `search=waku&sort=date` |

#### Ejemplo: Mostrar ruta actual

```tsx
'use client';

import { useRouter } from 'waku';

export function RouteInfo() {
  const { path, query } = useRouter();

  return (
    <div className="p-4 bg-gray-100">
      <p><strong>Ruta actual:</strong> {path}</p>
      <p><strong>Query params:</strong> {query || 'ninguno'}</p>
    </div>
  );
}
```

**Resultado en `/posts/hello-world?ref=twitter`:**
```
Ruta actual: /posts/hello-world
Query params: ref=twitter
```

---

### Métodos del router

El router proporciona varios métodos para navegación programática:

| Método | Descripción | Caso de uso |
|--------|-------------|-------------|
| `router.push(to)` | Navega a la ruta especificada | Redirigir después de submit, cambiar página por lógica |
| `router.replace(to)` | Reemplaza la entrada actual del historial | Evitar que el usuario vuelva atrás (post-login) |
| `router.prefetch(to)` | Precarga una ruta sin navegar | Optimizar rutas que el usuario probablemente visitará |
| `router.reload()` | Recarga la ruta actual | Actualizar datos después de mutación |
| `router.back()` | Navega a la entrada anterior del historial | Botón "Atrás" personalizado |
| `router.forward()` | Navega a la siguiente entrada del historial | Botón "Adelante" |

#### Ejemplo 1: Navegación después de submit (DevBlog)

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'waku';

export function CreatePostForm() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular creación de post
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, slug }),
    });

    // Redirigir al nuevo post
    router.push(`/posts/${slug}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del post"
      />
      <button type="submit">Crear Post</button>
    </form>
  );
}
```

#### Ejemplo 2: Botones de navegación personalizados

```tsx
'use client';

import { useRouter } from 'waku';

export function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <button onClick={() => router.back()}>
        ← Atrás
      </button>
      <button onClick={() => router.forward()}>
        Adelante →
      </button>
      <button onClick={() => router.push('/')}>
        🏠 Home
      </button>
      <button onClick={() => router.reload()}>
        🔄 Recargar
      </button>
    </div>
  );
}
```

#### Ejemplo 3: Prefetch inteligente (DevBlog)

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'waku';

export function SmartPostCard({ slug }: { slug: string }) {
  const router = useRouter();

  // Prefetch cuando el usuario hace hover sobre la card
  const handleMouseEnter = () => {
    router.prefetch(`/posts/${slug}`);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onClick={() => router.push(`/posts/${slug}`)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <h3>Post: {slug}</h3>
      <p>Haz clic para leer más...</p>
    </div>
  );
}
```

**Ventaja**: La ruta se precarga al hacer hover, haciendo que el clic sea instantáneo.

---

### Diferencias clave: `Link` vs `router.push()`

| Aspecto | `<Link to="...">` | `router.push('...')` |
|---------|-------------------|----------------------|
| **Uso** | Enlaces visuales (botones, menú) | Navegación por lógica (post-submit) |
| **Prefetch** | Automático | Manual con `router.prefetch()` |
| **Accesibilidad** | Mejor (es un `<a>` real) | Requiere manejar teclado |
| **SEO** | Crawler puede seguir el link | No rastreable por bots |
| **Cuándo usar** | Navegación estándar | Redirecciones condicionales |

**Regla general**: Usa `<Link>` por defecto; `router.push()` solo cuando necesites lógica condicional.

---

### Ejemplo completo: Navegación en DevBlog

#### 1. Header con `Link` (Server Component)

```tsx
// src/components/Header.server.tsx
import { Link } from 'waku';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          DevBlog
        </Link>
        
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-400">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

#### 2. SearchBar con navegación programática (Client Component)

```tsx
// src/components/SearchBar.client.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'waku';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      // Navegar a página de resultados con query param
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar posts..."
        className="px-4 py-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Buscar
      </button>
    </form>
  );
}
```

#### 3. Página de resultados que lee query params

```tsx
// src/pages/search.tsx
'use client';

import { useRouter } from 'waku';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const { query } = useRouter();
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    // Extraer parámetro 'q' de la query string
    const searchQuery = new URLSearchParams(query).get('q');
    
    if (searchQuery) {
      // Simular búsqueda (en prod, llamar API)
      setResults([
        `Resultado 1 para "${searchQuery}"`,
        `Resultado 2 para "${searchQuery}"`,
      ]);
    }
  }, [query]);

  return (
    <div>
      <h1>Resultados de búsqueda</h1>
      <ul>
        {results.map((result, i) => (
          <li key={i}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Casos de uso avanzados en DevBlog

#### Caso 1: Breadcrumbs dinámicos

```tsx
'use client';

import { Link } from 'waku';
import { useRouter } from 'waku';

export function Breadcrumbs() {
  const { path } = useRouter();
  const segments = path.split('/').filter(Boolean);

  return (
    <nav className="text-sm text-gray-600">
      <Link to="/" className="hover:underline">Home</Link>
      {segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/');
        return (
          <span key={i}>
            {' > '}
            <Link to={href} className="hover:underline capitalize">
              {segment}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
```

**Resultado en `/posts/hello-world`:**
```
Home > posts > hello-world
```

#### Caso 2: Paginación con estado en URL

```tsx
'use client';

import { useRouter } from 'waku';
import { Link } from 'waku';

export function Pagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();
  const currentPage = parseInt(new URLSearchParams(query).get('page') || '1');

  return (
    <div className="flex gap-2">
      {currentPage > 1 && (
        <Link to={`?page=${currentPage - 1}`}>← Anterior</Link>
      )}
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link 
          key={page}
          to={`?page=${page}`}
          className={page === currentPage ? 'font-bold' : ''}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link to={`?page=${currentPage + 1}`}>Siguiente →</Link>
      )}
    </div>
  );
}
```

---

### Errores comunes con navegación

#### ❌ Error 1: Usar `useRouter` en Server Component

```tsx
// ❌ MALO - Server Components no pueden usar hooks
export default async function Page() {
  const router = useRouter(); // Error!
  return <div>...</div>;
}

// ✅ BUENO - Usar Link en Server Component
import { Link } from 'waku';

export default async function Page() {
  return <Link to="/about">About</Link>;
}
```

#### ❌ Error 2: Olvidar prefijo `/` en rutas

```tsx
// ❌ MALO - Ruta relativa
<Link to="posts/hello-world">Post</Link>

// ✅ BUENO - Ruta absoluta
<Link to="/posts/hello-world">Post</Link>
```

#### ❌ Error 3: Mezclar Link con `<a>` para rutas internas

```tsx
// ❌ MALO - Recarga completa de página
<a href="/about">About</a>

// ✅ BUENO - Navegación optimizada
<Link to="/about">About</Link>
```

---

### Checklist: Navegación en DevBlog

- [ ] Header usa `<Link>` para navegación principal.
- [ ] SearchBar usa `router.push()` para redirigir con query params.
- [ ] Breadcrumbs se actualizan según `router.path`.
- [ ] Paginación usa `Link` con query strings (`?page=2`).
- [ ] Botones "Atrás" y "Adelante" usan `router.back()` y `router.forward()`.
- [ ] Prefetch manual en cards de posts (hover → `router.prefetch()`).
- [ ] Todas las rutas internas usan `Link`, no `<a>`.

---

### Resumen: Link vs useRouter

| Necesidad | Solución | Ejemplo |
|-----------|----------|---------|
| Enlace visual estático | `<Link to="...">` | Menú de navegación |
| Redirigir después de acción | `router.push()` | Post-submit de form |
| Leer ruta actual | `router.path` | Breadcrumbs, active links |
| Leer query params | `router.query` | Filtros, búsqueda |
| Botón "Atrás" | `router.back()` | Navegación personalizada |
| Precargar ruta | `router.prefetch()` | Optimización hover |

---

## 18. Referencia Completa: Deployment en Netlify

### ¿Por qué Netlify?

- ✅ Despliegue automático desde Git
- ✅ Builds incremental (rápido)
- ✅ CDN global gratuito
- ✅ Environment variables fáciles
- ✅ Perfecto para DevBlog estático

### Paso 1: Preparar el Proyecto

```bash
# Asegurate que el build es estático
pnpm build

# Verifica que dist/ tiene todos los archivos
ls dist/
```

### Paso 2: Instalar Netlify CLI

```bash
npm install -g netlify-cli
# o
pnpm add -D netlify-cli
```

### Paso 3: Conectar con Netlify

```bash
# Opción A: Via CLI (recomendado)
netlify login
netlify init

# Opción B: Dashboard en https://netlify.com
# (Autorizar con GitHub, conectar repo)
```

### Paso 4: Configurar netlify.toml

```toml
# netlify.toml (raíz del proyecto)

[build]
  command = "NETLIFY=1 pnpm build"
  publish = "dist"

[functions]
  # Si usas API endpoints, esta es la carpeta de functions
  directory = "dist/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200  # SPA fallback (opcional)

# Environment variables en deploy
[context.production.environment]
  WAKU_PUBLIC_SITE_NAME = "DevBlog Production"

[context.deploy-preview.environment]
  WAKU_PUBLIC_SITE_NAME = "DevBlog Preview"
```

### Paso 5: Deploy desde CLI

```bash
# Deploy manual
netlify deploy --prod

# Output
# Deploy site: https://your-site-id.netlify.app
# Live URL: https://your-site.com (si tiene dominio)
```

### Paso 6: Deploy Automático (Recomendado)

1. Push código a GitHub/GitLab/Bitbucket
2. Netlify detecta cambios automáticamente
3. Corre `pnpm build`
4. Publica a `dist/`
5. Tu sitio está vivo

### Agregar Dominio Personalizado

1. Ir a **Site Settings** → **Domain management**
2. Agregar dominio personalizado
3. Actualizar DNS en tu registrador

### Variables de Entorno en Netlify

1. **Site Settings** → **Build & Deploy** → **Environment**
2. Agregar variables:
   ```
   DATABASE_URL = postgres://...
   WAKU_PUBLIC_SITE_NAME = DevBlog
   ```

### Monitoreo

```bash
# Ver logs en tiempo real
netlify logs

# Ver último deploy
netlify status

# Rollback a versión anterior
netlify deploy --prod --build=false
```

### Checklist Deployment Netlify

- [ ] Proyecto local builds sin errores (`pnpm build`)
- [ ] Código está en GitHub/GitLab
- [ ] Cuenta en netlify.com creada
- [ ] Repo conectado a Netlify
- [ ] `netlify.toml` configurado en raíz
- [ ] Environment variables seteadas en Netlify UI
- [ ] Primer deploy exitoso (`netlify deploy --prod`)
- [ ] Sitio accesible en `https://your-site.netlify.app`
- [ ] Dominio personalizado apuntando (si aplica)
- [ ] CI/CD automático funcionando (push → auto-deploy)

### Troubleshooting Netlify

| Problema | Solución |
|----------|----------|
| Build falla | Chequea logs: `netlify logs` |
| Variables no cargan | Verifica prefijo `WAKU_PUBLIC_` en Netlify UI |
| Sitio retorna 404 | Agrega `[[redirects]]` en netlify.toml |
| Dominio no funciona | Espera 24h para DNS, verifica CNAME en registrador |
| Despliegue muy lento | Habilita "Incremental Builds" en Netlify settings |

### Ejemplo Completo: DevBlog en Netlify

```bash
# 1. Build local
pnpm build

# 2. Verificar build
ls dist/ | head -20

# 3. Deploy
netlify deploy --prod

# 4. Verificar
curl https://your-devblog.netlify.app

# 5. Monitorear
netlify open
```

---

## 19. Conceptos clave a dominar

| Concepto | Explicación | Ejemplo |
| --- | --- | --- |
| **Server Component** | Renderiza en servidor, NO envía JS al cliente | `getPostBySlug()` dentro de componente |
| **Client Component** | Renderiza en cliente, permite hooks | `useState`, `useEffect` |
| **Props JSON-serializables** | Los datos que bajan de Server→Client deben ser JSON | ✅ `{ posts: [...] }` ❌ `{ fn: () => {} }` |
| **Suspense** | Muestra fallback mientras Server Component carga | `<Suspense fallback="Loading"><Posts/></Suspense>` |
| **defineEntries** | Define qué rutas dinámicas prerenderar | `defineEntries(() => posts.map(p => '/posts/' + p.slug))` |
| **API handlers** | Edge Functions en `api/` folder | `api/likes.ts` responde POST |

---

## 20. Próximos pasos

1. **Comentarios mejorados** — Actualmente JSONPlaceholder es de solo lectura. Integra un formulario para que usuarios creen comentarios (POST a tu propio `api/comments.ts`)
2. **Persistencia real** — Reemplaza comentarios JSON con Supabase, Firebase, o tu propia DB
3. **Agrega categorías/tags** a posts con rutas `/tag/[tag]`
4. **RSS feed** (`feed.xml`) para lectores
5. **Analytics** con Plausible o Fathom (privacy-first)
6. **Search mejorada** con Algolia o Meilisearch
7. **Email subscription** integrado
8. **Social share** buttons con OG meta tags dinámicos

---

## 21. Patrón mental: Cuándo usar Server vs Client

**Usa Server Components cuando:**
- ✅ Necesitas leer archivos del sistema
- ✅ Necesitas ejecutar queries a APIs privadas
- ✅ No necesitas interactividad
- ✅ Quieres minimizar JS enviado al navegador

**Usa Client Components cuando:**
- ✅ Necesitas `useState`, `useEffect`
- ✅ Manejas eventos (`onClick`, `onChange`)
- ✅ Accedes a `window`, `localStorage`
- ✅ Integras librerías que requieren interactividad

**Arquitectura típica Waku:**
```
App (Server)
  ├── Header (Server)
  ├── PostList (Server)
  │   └── SearchBar (Client) ← maneja state local
  └── ThemeToggle (Client) ← maneja localStorage
```

---

## 22. Resultado esperado

Al completar esta guía tendrás:

✅ **DevBlog completamente funcional** — Blog estático interactivo con posts en Markdown.

✅ **Comprenderás RSC** — Cuándo y por qué un componente se ejecuta en servidor vs cliente.

✅ **Dominarás prerendering** — Rutas dinámicas generadas en build time con `defineEntries`.

✅ **Implementarás APIs** — Handlers Edge en `api/` para mutaciones y acciones.

✅ **Deployarás sin servidor** — Build 100% estático servible en cualquier CDN.

**Ventajas Waku que entenderás en acción:**
- Bundle JS mínimo (~40 kB) — Solo para interactividad necesaria
- Zero hydration mismatch — Server renderiza, cliente recibe HTML puro
- Performance por defecto — Prerendering estático es la estrategia
- Mantenibilidad — Límites server/client claros, sin magia

---

Con esta base, estarás preparado para proyectos más complejos: e-commerce, dashboards, portales con datos dinámicos. Waku te da el control total sobre qué renderizar dónde, sin la complejidad innecesaria de frameworks monolíticos.

**¡Que disfrutes aprendiendo Waku!** 🚀
