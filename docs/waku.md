🟧 PLAN ULTRA DIDÁCTICO PARA APRENDER WAKU EN 5 DÍAS (2 H/DÍA)

Guía paso a paso para dominar **Waku**: el framework minimalista basado en React Server Components (RSC) pensado para aplicaciones JAMStack ultrarápidas. A través del proyecto **DevBlog**, aprenderás a construir un blog moderno con renderizado estático, rutas dinámicas y componentes interactivos.

---

## 0. Cómo usar este manual

1. **Lee la sección completa del día antes de iniciar.** Cada bloque incluye tiempo estimado, pasos con comandos y explicaciones de diseño.
2. **Sigue los pasos en orden** y marca los checklists. Son tu Definition of Done diaria.
3. **Anota hallazgos en `notes/waku.md`** (crea la carpeta si no existe). Registrarás decisiones y problemas.
4. **Entiende los términos RSC:** Server Components vs Client Components. Consulta tablas cuando sea necesario.
5. **Completa los retos opcionales** si te sobra tiempo; consolidan el aprendizaje.

Duración total: **10 horas efectivas** (6 a 7 días, 2 horas por día).

---

## 1. ¿Qué es Waku y por qué te conviene?

| Aspecto | Descripción |
| --- | --- |
| **Filosofía** | RSC minimalista: explícito sobre qué renderiza donde |
| **Infra necesaria** | CDN estático puro (Vercel, Netlify, Cloudflare) |
| **Tamaño inicial** | ~40 kB bundle |
| **Data fetching** | Server Components async, cero waterfalls |
| **Rutas dinámicas** | File-based routing desde `src/pages/` con `defineEntries` |
| **APIs** | Edge handlers simples en `src/pages/api/` |

**Mentalidad Waku:**
- Componentes `.server.tsx` → renderiza en servidor, envía HTML puro.
- Componentes `.client.tsx` → se hidratan en cliente, permite interactividad.
- Props entre ellos **deben ser JSON-serializables**.

---

## 2. Proyecto: DevBlog — Blog estático interactivo

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
3. Practica **rutas dinámicas** con `defineEntries`.
4. Implementa **APIs handlers** para acciones (likes, comentarios).
5. Resulta en **build 100% estático** deployable en cualquier CDN.

---

## 3. Prerrequisitos (Día 0 – 30 min)

1. **Node 18.18+ / pnpm 8+**
   ```bash
   node -v  # ≥ 18.18
   pnpm -v  # ≥ 8
   ```

2. **Crear proyecto Waku**
   ```bash
   pnpm create waku@latest devblog
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
       api/
         likes.ts                 # Endpoint para guardar likes
         comments.ts              # Endpoint para comentarios
     components/
       Header.server.tsx          # Navegación renderizada servidor
       PostCard.client.tsx        # Card interactiva con like button
       SearchBar.client.tsx       # Búsqueda client-side
     lib/
       posts.ts                   # Carga y parseo de posts en Markdown
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

## 4. Roadmap de los 5 días

| Día | Foco | Qué construyes |
| --- | --- | --- |
| 1 | Fundamentos RSC + estructura | Layout, setup básico |
| 2 | Server Components async | Sistema de posts con Markdown, Suspense |
| 3 | Client Components + interactividad | Búsqueda, comentarios con JSONPlaceholder, dark mode |
| 4 | Routing + APIs edge | File-based routing, rutas dinámicas `/posts/[slug]`, APIs handlers |
| 5 | Optimización + deploy | QA, audits (Lighthouse), build estático, deploy CDN |

---

## Día 1 – Entender Waku: Server Components, Client Components y Routing

**Meta:** Comprender la arquitectura Waku y dejar funcionando un layout base con navegación.

### Bloque A (60 min) – Conceptos fundamentales de RSC

**¿Qué son React Server Components (RSC)?**

Un **Server Component** es un componente que se ejecuta **SOLO en el servidor** (build time o request time) y su resultado se envía como HTML al navegador. NO puede usar hooks de React, NO tiene acceso a `window` o APIs browser, pero SÍ puede hacer `await`, acceder a `process.env`, y leer archivos del sistema.

Un **Client Component** es un componente marcado con `'use client'` que se ejecuta en el navegador y puede usar hooks (`useState`, `useEffect`), acceder a `window`, escuchar eventos.

**Tabla comparativa:**

| Capacidad | Server Component | Client Component |
| --- | --- | --- |
| `await` fetch/lectura archivo | ✅ | ❌ |
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

### Bloque B (60 min) – Setup y primer layout

1. **Crear componente Header** (`src/components/Header.server.tsx`)
   ```tsx
   export default function Header() {
     return (
       <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
         <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
           <h1 style={{ margin: 0 }}>
             <a href="/" style={{ textDecoration: 'none', color: '#000' }}>
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
         <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
           {children}
         </main>
         <footer style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '2rem', textAlign: 'center' }}>
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

#### Checklist Día 1 (Parte 1 – Setup básico)

- [ ] Layout renderiza sin JS (Server Component puro).
- [ ] Navegación funciona.
- [ ] Estructura de carpetas creada correctamente.
- [ ] `pnpm dev` corre sin warnings.

#### Errores frecuentes

- ❌ "ReferenceError: window is not defined" → Usaste API browser en `.server.tsx`. Muévelo a `.client.tsx`.
- ❌ "Cannot find module" → Ruta de import incorrecta. Verifica `src/components/`.
- ❌ Componente no renderiza → ¿Olvidaste exportar `default`?

---

**📌 Nota:** La subsección detallada "Sistemas de Rutas en Waku" está movida a Día 4 Bloque A, donde tendrás el contexto de `defineEntries` y rutas dinámicas para entender mejor todo.

## Día 2 – Server Components async: Sistema de posts con Markdown

**Meta:** Cargar artículos desde Markdown, renderizarlos en servidor y mostrar lista prerendereada.

### Bloque A (60 min) – Cargar y parsear posts

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
         <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem' }}>
           {posts.map((post) => (
             <li
               key={post.slug}
               style={{
                 padding: '1rem',
                 border: '1px solid #ddd',
                 borderRadius: '8px',
               }}
             >
               <h3>
                 <a href={`/posts/${post.slug}`}>{post.title}</a>
               </h3>
               <p>{post.excerpt}</p>
               <small style={{ color: '#666' }}>📅 {post.date}</small>
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

### Bloque B (60 min) – Suspense y streaming

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

#### Checklist Día 2

- [ ] Posts se cargan desde archivos Markdown.
- [ ] Lista renderiza sin errors.
- [ ] Suspense muestra fallback mientras carga.
- [ ] Desactiva JS → lista sigue visible (es HTML estático).

#### Errores frecuentes

- ❌ "ENOENT: no such file or directory" → Ruta `src/posts` no existe. Créala.
- ❌ Markdown no parsea correctamente → Regex incorrecto. Añade console.log para debuggear.
- ❌ Suspense no funciona → ¿Olvidaste `@ts-expect-error`? Waku espera ese comment.

---

## Día 3 – Client Components: Búsqueda, Dark Mode y Comentarios Reales

**Meta:** Agregar interactividad client-side, fetchear comentarios reales desde JSONPlaceholder (API pública), sin romper la arquitectura RSC.

**Nota:** En lugar de simular datos, usaremos **JSONPlaceholder** (`jsonplaceholder.typicode.com`), una API pública gratuita que proporciona posts y comentarios reales para desarrollo y testing.

### Bloque A (90 min) – Búsqueda client-side + Comentarios con JSONPlaceholder

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
       <div style={{ marginBottom: '2rem' }}>
         <input
           type="text"
           placeholder="Buscar posts..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           style={{
             width: '100%',
             padding: '0.5rem',
             fontSize: '1rem',
             borderRadius: '4px',
             border: '1px solid #ccc',
           }}
         />
         <p style={{ marginTop: '0.5rem', color: '#666' }}>
           {filtered.length} de {posts.length} posts encontrados
         </p>
         <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem', marginTop: '1rem' }}>
           {filtered.map((post) => (
             <li
               key={post.slug}
               style={{
                 padding: '1rem',
                 border: '1px solid #ddd',
                 borderRadius: '8px',
               }}
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

### Bloque B (60 min) – Dark mode con localStorage

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
         style={{
           background: 'none',
           border: 'none',
           fontSize: '1.5rem',
           cursor: 'pointer',
         }}
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
       <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
         <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
             <h1 style={{ margin: 0 }}>
               <a href="/" style={{ textDecoration: 'none', color: '#000' }}>
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
      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h3>💬 Comentarios</h3>
        <p style={{ color: '#666' }}>⏳ Cargando comentarios desde JSONPlaceholder...</p>
      </section>
    )
  }

  // Estado de error
  if (error) {
    return (
      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ffe0e0' }}>
        <h3>💬 Comentarios</h3>
        <p style={{ color: '#d32f2f' }}>❌ {error}</p>
        <small style={{ color: '#999' }}>
          💡 Tip: JSONPlaceholder proporciona comentarios para posts 1-100. 
          Si el slug no mapea a un ID válido, prueba con otro post.
        </small>
      </section>
    )
  }

  // Sin comentarios (raro en JSONPlaceholder, pero posible)
  if (comments.length === 0) {
    return (
      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h3>💬 Comentarios</h3>
        <p>Sin comentarios para este post aún.</p>
      </section>
    )
  }

  // Renderizar comentarios
  return (
    <section style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
      <h3>💬 Comentarios ({comments.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((comment) => (
          <li
            key={comment.id}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              borderLeft: '4px solid #0066cc',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem' }}>{comment.name}</strong>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.25rem 0' }}>
                ✉️ {comment.email}
              </p>
            </div>
            <p style={{ margin: '0.5rem 0', lineHeight: '1.6' }}>{comment.body}</p>
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
import { getPostBySlug, getPosts } from '../../lib/posts'
import Layout from '../../components/Layout.server'
import CommentsList from '../../components/CommentsList.client'
import { defineEntries } from 'waku/server'

export const entries = defineEntries(async () => {
  const posts = await getPosts()
  return posts.map((post) => `/posts/${post.slug}`)
})

interface Params {
  slug: string
}

export default async function PostDetail({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug)

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
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          📅 {new Date(post.date).toLocaleDateString('es-ES')}
        </p>

        <div
          style={{
            marginTop: '2rem',
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/^# .+$/gm, ''), // Remove title
          }}
        />

        {/* 🟡 Componente de comentarios reales */}
        <CommentsList postId={postId} />

        <nav style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          <a href="/">← Volver a posts</a>
        </nav>
      </article>
    </Layout>
  )
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

#### Checklist Día 3

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

---

## Día 4 – Routing en Waku, APIs Edge y Rutas dinámicas

**Meta:** Dominar el sistema de file-based routing, crear rutas dinámicas con `defineEntries`, implementar APIs de mutaciones.

### Bloque A (120 min) – Routing en Waku + Rutas dinámicas con `defineEntries`

#### 🟢 SUBSECCIÓN: Sistemas de Rutas en Waku (Concepto + Práctica)

**¿Cómo Waku maneja las rutas?**

Waku usa **file-based routing**: los archivos en `src/pages/` determinan automáticamente las rutas. No necesitas un `react-router` ni configuración manual.

**Convención de archivos:**

| Archivo | Ruta generada | Tipo | Prerendering |
| --- | --- | --- | --- |
| `src/pages/index.tsx` | `/` (home) | Estática | Build time |
| `src/pages/about.tsx` | `/about` | Estática | Build time |
| `src/pages/blog/index.tsx` | `/blog` | Estática | Build time |
| `src/pages/posts/[slug].tsx` | `/posts/hello-world`, `/posts/faq` | Dinámica | Con `defineEntries` |
| `src/pages/posts/[slug]/comments.tsx` | `/posts/hello-world/comments` | Dinámica anidada | Con `defineEntries` |
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
import Layout from '../../components/Layout.server'

interface Params {
  category: string
}

export async function defineEntries() {
  return [
    { params: { category: 'javascript' } },
    { params: { category: 'react' } },
    { params: { category: 'deployment' } },
  ]
}

export default function CategoryPage({ params }: { params: Params }) {
  const { category } = params

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
```

Rutas generadas automáticamente:
- `http://localhost:4173/blog/category/javascript`
- `http://localhost:4173/blog/category/react`
- `http://localhost:4173/blog/category/deployment`

---

##### 3️⃣ Rutas dinámicas con múltiples segmentos

**Caso:** Subrutas dinámicas como `/posts/[slug]/comments` (comentarios de un post específico).

```tsx
// src/pages/posts/[slug]/comments.tsx
interface Params {
  slug: string
}

export async function defineEntries() {
  // Obtener todos los posts
  const posts = await getPosts() // función que lees archivos .md

  return posts.map((post) => ({
    params: { slug: post.slug },
  }))
}

export default function CommentsPage({ params }: { params: Params }) {
  const { slug } = params

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
      <body style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>🔍 404 - Página no encontrada</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          No pudimos encontrar: <code>/{path}</code>
        </p>
        <p>Tal vez quisiste:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li><a href="/">Ir a home</a></li>
          <li><a href="/posts">Ver todos los posts</a></li>
          <li><a href="/about">Sobre mí</a></li>
        </ul>
        <pre style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
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
| **Dinámica simple** | `pages/posts/[slug].tsx` | 1 archivo + `defineEntries` = N rutas | `/posts/hello-world`, `/posts/faq` |
| **Dinámica anidada** | `pages/blog/[category]/[post].tsx` | 1 archivo + `defineEntries` con 2 params = M×N rutas | `/blog/react/hooks-guide` |
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
✓ /posts/hello-world (generada por defineEntries)
✓ /posts/waku-rsc-guide
✓ /posts/state-management
✓ /blog/category/javascript (generada por defineEntries)
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

##### 8️⃣ Implementación real en DevBlog: Rutas dinámicas con defineEntries

```tsx
// src/pages/posts/[slug].tsx
import Layout from '../../components/Layout.server'
import { getPosts, getPostBySlug } from '../../lib/posts'

interface Params {
  slug: string
}

export async function defineEntries() {
  const posts = await getPosts()
  return posts.map((post) => ({
    params: { slug: post.slug },
  }))
}

export default async function PostDetail({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return (
      <Layout>
        <h1>Post no encontrado: {params.slug}</h1>
        <a href="/posts">Volver a posts</a>
      </Layout>
    )
  }

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Publicado: {new Date(post.date).toLocaleDateString('es-ES')}
        </p>
        <div>{post.content}</div>
      </article>
    </Layout>
  )
}
```

---

##### 9️⃣ Errores frecuentes con rutas en Waku

- ❌ **Olvidar `defineEntries` en rutas dinámicas**
  ```tsx
  // ❌ MALO: Sin defineEntries, Waku no sabe qué valores pregenerar
  export default function Post({ params }: { params: { slug: string } }) {
    return <h1>{params.slug}</h1>
  }

  // ✅ BUENO
  export async function defineEntries() {
    return [{ params: { slug: 'hello-world' } }, { params: { slug: 'faq' } }]
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
- [ ] Rutas dinámicas generadas: `/posts/[slug]` con `defineEntries`
- [ ] Rutas anidadas: `/blog/category/[category]`
- [ ] Página 404 personalizada: `/[...notFound].tsx` captura rutas inválidas
- [ ] Test: `http://localhost:4173/invalid-route` → Muestra 404 personalizado
- [ ] Test: `http://localhost:4173/posts/hello-world` → Funciona
- [ ] Test: `http://localhost:4173/posts/invalid-slug` → ¿Fallback o 404?

---

#### 2. Práctica: Crear página de post individual con rutas dinámicas

1. **Crear página de post individual** (`src/pages/posts/[slug].tsx`)
   ```tsx
   import { getPostBySlug, getPosts } from '../../lib/posts'
   import Layout from '../../components/Layout.server'
   import { defineEntries } from 'waku/server'

   // Define qué rutas prerenderar en build time
   export const entries = defineEntries(async () => {
     const posts = await getPosts()
     return posts.map((post) => `/posts/${post.slug}`)
   })

   interface Params {
     slug: string
   }

   export default async function PostDetail({ params }: { params: Params }) {
     const post = await getPostBySlug(params.slug)

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
           <p style={{ color: '#666', fontSize: '0.9rem' }}>
             📅 {new Date(post.date).toLocaleDateString()}
           </p>

           <div
             style={{
               marginTop: '2rem',
               lineHeight: '1.8',
             }}
             dangerouslySetInnerHTML={{
               __html: post.content.replace(
                 /^# .+$/gm,
                 ''
               ), // Remove title heading
             }}
           />

           <nav style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
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

### Bloque B (60 min) – APIs handlers

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
         style={{
           padding: '0.5rem 1rem',
           background: liked ? '#ff6b6b' : '#ddd',
           color: liked ? 'white' : 'black',
           border: 'none',
           borderRadius: '4px',
           cursor: 'pointer',
         }}
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

### Bloque C (OPCIONAL - 90 min) – Server Actions: Alternativa moderna a API handlers

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
           style={{
             padding: '0.5rem 1rem',
             background: liked ? '#ff6b6b' : '#ddd',
             color: liked ? 'white' : 'black',
             border: 'none',
             borderRadius: '4px',
             cursor: loading ? 'not-allowed' : 'pointer',
             opacity: loading ? 0.6 : 1,
           }}
         >
           {loading ? '⏳' : liked ? '❤️' : '🤍'} {count} likes
         </button>
         {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
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

#### Checklist Día 4 (ampliado)

- [ ] `pnpm build` genera archivos HTML para cada post en `dist/posts/[slug]/`.
- [ ] `/posts/hello-world` se renderiza correctamente.
- [ ] **API handler (Bloque B):** Like button funciona con fetch POST.
- [ ] **Server Action (Bloque C):** Like button alternativo funciona sin fetch.
- [ ] Comparación: Ambas opciones funcionan, entiendes cuándo usar cada una.
- [ ] Rutas 404 se manejan gracefully.

#### Errores frecuentes

- ❌ `defineEntries` tarda mucho → Si hay 1000 posts, prerenderar todos es lento. Limita o usa fallback.
- ❌ API retorna 404 → Asegúrate que el archivo está en `api/likes.ts` (no `api/likes/index.ts`).
- ❌ Ruta dinámica no renderiza → ¿Olvidaste `export const entries`?

---

## Día 5 – Optimización, Audits y Deploy

**Meta:** Asegurar calidad, pasar audits de performance y desplegar.

### Bloque A (60 min) – QA y Lighthouse

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

### Bloque B (60 min) – Build y Deploy

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

#### Checklist Día 5

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

## 6. Recursos y referencia

- **Docs Waku:** https://waku.gg/docs — Documentación oficial
- **Repo ejemplos:** https://github.com/dai-shi/waku-examples
- **React RFC RSC:** https://github.com/facebook/react/discussions/tag/rsc — Entender qué son RSC
- **Playground:** https://waku.gg/playground — Prueba online sin instalar
- **Comunidad:** Discord Waku para preguntas

---

## 7. Conceptos clave a dominar

| Concepto | Explicación | Ejemplo |
| --- | --- | --- |
| **Server Component** | Renderiza en servidor, NO envía JS al cliente | `getPostBySlug()` dentro de componente |
| **Client Component** | Renderiza en cliente, permite hooks | `useState`, `useEffect` |
| **Props JSON-serializables** | Los datos que bajan de Server→Client deben ser JSON | ✅ `{ posts: [...] }` ❌ `{ fn: () => {} }` |
| **Suspense** | Muestra fallback mientras Server Component carga | `<Suspense fallback="Loading"><Posts/></Suspense>` |
| **defineEntries** | Define qué rutas dinámicas prerenderar | `defineEntries(() => posts.map(p => '/posts/' + p.slug))` |
| **API handlers** | Edge Functions en `api/` folder | `api/likes.ts` responde POST |

---

## 8. Próximos pasos después de esta semana

1. **Comentarios mejorados** — Actualmente JSONPlaceholder es de solo lectura. Integra un formulario para que usuarios creen comentarios (POST a tu propio `api/comments.ts`)
2. **Persistencia real** — Reemplaza comentarios JSON con Supabase, Firebase, o tu propia DB
3. **Agrega categorías/tags** a posts con rutas `/tag/[tag]`
4. **RSS feed** (`feed.xml`) para lectores
5. **Analytics** con Plausible o Fathom (privacy-first)
6. **Search mejorada** con Algolia o Meilisearch
7. **Email subscription** integrado
8. **Social share** buttons con OG meta tags dinámicos

---

## 9. Patrón mental: Cuándo usar Server vs Client

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

## 10. Resultado esperado

Tras 5 días tendrás:

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

¡Que disfrutes aprendiendo Waku! 🚀
