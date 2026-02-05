---
titulo: "16-pwa"
autor: "Ariel"
fecha: "25-01-2026"
tags: ["waku", "guía", "PWA", "progressive web app"]
---

**Nota**: Esta es una sección extra que no se menciona en la documentación oficial de Waku, pero considero útil.

### Introducción

Las Progressive Web Apps (PWA) son aplicaciones web que ofrecen una experiencia similar a la de las aplicaciones nativas en dispositivos móviles y de escritorio. Algunas de las características clave de las PWA incluyen la capacidad de trabajar sin conexión, recibir notificaciones push y **ser instaladas en el dispositivo** de la persona usuaria.

### Cómo convertir una aplicación web hecho con Waku en una PWA

#### Instalar las dependencias necesarias

```bash
pnpm add vite-plugin-pwa @vite-pwa/assets-generator -D
```

La primera de estas dependencias es el _plugin_ que nos permitirá convertir nuestra aplicación web en una PWA, y la segunda es una herramienta para generar los assets necesarios (íconos, manifest, etc), facilitando mucho el proceso. Ambas son dependencias de desarrollo.

Acá un enlace con info sobre las dependencias → [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

#### Agregar el plugin de PWA a `waku.config.ts`:

```typescript
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "waku/config";
import { VitePWA } from "vite-plugin-pwa"; // Importamos el plugin de PWA

export default defineConfig({
  vite: {
    server: {
      port: 3000,
      watch: {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/dist/**",
          "**/*.gen.ts",
        ],
        usePolling: false,
      },
    },
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      VitePWA({
        // Configuramos el plugin de PWA
        registerType: "autoUpdate",
        injectRegister: null, // No inyectar automáticamente porque usamos SSR
        includeAssets: [
          // Archivos estáticos a incluir
          "imagenes/favicon.ico",
          "imagenes/apple-touch-icon-180x180.png",
          "imagenes/maskable-icon-512x512.png",
          "imagenes/pwa-192x192.png",
          "imagenes/pwa-512x512.png",
          "imagenes/pwa-64x64.png",
        ],
        manifest: {
          // Configuración del manifiesto de la PWA
          name: "Pasaporte.app",
          short_name: "Pasaporte.app",
          lang: "es",
          description: "Transforma cómo se viven tus eventos con Pasaporte.app",
          theme_color: "#000000", // Debe coincidir con el meta theme-color en _root.tsx
          background_color: "#000000",
          display: "standalone",
          scope: "/",
          start_url: "/login",
          icons: [
            // Iconos de la PWA
            {
              src: "imagenes/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "imagenes/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "imagenes/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "imagenes/apple-touch-icon-180x180.png",
              sizes: "180x180",
              type: "image/png",
            },
            {
              src: "imagenes/favicon.ico",
              sizes: "48x48",
              type: "image/x-icon",
            },
            {
              src: "imagenes/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          // Configuración de Workbox para el service worker
          maximumFileSizeToCacheInBytes: 3000000,
        },
      }),
    ],
    // @ts-expect-error - `test` is a Vitest option and may not exist on waku's Vite types
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/tests/setup.ts"],
    },
  },
});
```

> **Importante**: El valor de `theme_color` en el manifest debe coincidir con el meta tag `<meta name="theme-color">` definido en `_root.tsx` para una experiencia consistente.

#### Crear un archivo que nos ayudará a generar los assets necesarios para la PWA

Podemos crear un archivo llamado `pwa-assets.config.ts` **en la raíz del proyecto** con el siguiente contenido:

```typescript
/**
 * Configuración para la generación automática de assets de PWA.
 *
 * Este archivo configura el generador de assets de @vite-pwa/assets-generator
 * para crear todos los iconos y splash screens necesarios para una Progressive Web App (PWA).
 *
 * El generador toma una imagen base y crea:
 * - Iconos en múltiples tamaños (192x192, 512x512, etc.)
 * - Iconos para Apple Touch
 * - Favicons
 * - Splash screens para dispositivos iOS
 * - Máscaras de iconos (maskable icons) para Android
 *
 * Preset utilizado: minimal2023Preset
 * - Conjunto mínimo de assets recomendado para 2023
 * - Incluye los tamaños estándar más utilizados
 * - Optimizado para reducir el tamaño del bundle
 *
 * Comando de generación:
 * pnpm generate-pwa-assets
 *
 * @see https://vite-pwa-org.netlify.app/assets-generator/
 */
import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  /** Preset con configuración predefinida de assets mínimos para PWA */
  preset,
  /** Ruta a la imagen fuente que se usará para generar todos los assets */
  images: ["public/imagenes/escudo.webp"],
});
```

#### Agregar un script a nuestro `package.json`

Para generar los assets de la PWA facilmente:

```json
"scripts": {
      "generate-pwa-assets": "pwa-assets-generator"
}
```

El comando `pnpm generate-pwa-assets` busca automáticamente un archivo de **configuración** en la raíz del proyecto con el nombre `pwa-assets.config.ts` (o .js, .mjs). Si lo encuentra, lo carga y usa su configuración.

Esto es una convención estándar en herramientas de JavaScript.
Por eso podemos ejecutar simplemente `pnpm generate-pwa-assets` sin parámetros, y automáticamente usará la configuración, preset e imágenes definidas en pwa-assets.config.ts.

#### Colocar la imagen base en la ruta `public/imagenes/`

Para este ejemplo la ruta sería `public/imagenes/escudo.webp`. Esta imagen se usará para generar todos los assets necesarios para la PWA.

> **Importante**: La imagen base **debe existir antes** de ejecutar el comando de generación. Si la imagen no existe o la ruta es incorrecta, el generador fallará. Se recomienda usar una imagen cuadrada de al menos 512x512 píxeles para obtener mejores resultados.

Si se coloca la imagen en otra ruta, hay que actualizar la ruta en el archivo `pwa-assets.config.ts`.

#### Ejecutar el comando para generar los assets

```bash
pnpm generate-pwa-assets
```

Esto generará todos los iconos y _splash screens_ necesarios para la PWA, colocándolos en la carpeta `public/imagenes/`.

#### Verificar que los assets se generaron correctamente

```bash
ls public/imagenes/*.png
```

Deberíamos ver los siguientes archivos generados:

- `apple-touch-icon-180x180.png`
- `maskable-icon-512x512.png`
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`

Si alguno de estos archivos no existe, hay que revisar que la imagen base sea válida y volvemos a ejecutar el comando.

#### Registrar el Service Worker manualmente

Ahora, para que el service worker funcione correctamente con SSR en Waku, necesitamos registrar el service worker manualmente. Para esto, la solución que encontré fue crear un Client Component que se encargue de registrar el service worker cuando la aplicación se cargue en el navegador. Creamos un archivo llamado `src/componentes/ServiceWorkerRegistration.tsx` con el siguiente contenido:

```typescript
"use client";

import { useEffect } from "react";

/**
 * Componente que registra el Service Worker de la PWA
 * Se ejecuta solo en el cliente después de que la página carga
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registrado:", registration.scope);
          })
          .catch((error) => {
            console.error("Error al registrar Service Worker:", error);
          });
      });
    }
  }, []);

  return null;
}
```

#### Importar el componente de registro del Service Worker en `_root.tsx`

Ya con el componente creado, lo importamos a `_root.tsx` para que se cargue en toda la aplicación. Modificamos el archivo `src/pages/_root.tsx` para incluir el componente de registro del service worker.

El siguiente es un ejemplo de cómo quedaría el archivo `_root.tsx` con la inclusión del componente `ServiceWorkerRegistration`, además de (un listener de autenticación y) otros metadatos importantes para una PWA:

```typescript
import type { ReactNode } from 'react';
import '../styles.css';
import AuthStateListener from '../componentes/AuthStateListener';
import ServiceWorkerRegistration from '../componentes/ServiceWorkerRegistration'; // Importamos el componente de registro del service worker

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="min-h-screen">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/imagenes/gatoRojoLab-mini-negra.webp"
          title="favicon Gato Rojo Lab"
        />
        <meta
          name="description"
          content="Pasaporte.app es tu pasaporte digital para eventos como ferias, conferencias y conciertos. Registra tu asistencia de manera rápida y sencilla, guarda tus recuerdos y comparte tu experiencia con amigos y familiares."
        />
        <meta
          name="keywords"
          content="Pasaporte digital, eventos, ferias, conferencias, conciertos, asistencia, recuerdos, compartir, amigos, familiares, gatorojolab, gato rojo lab, gatos, michis, cats, costa rica, desarrollo web, aplicaciones web, diseño UX, accesibilidad web, responsive web design, JAMstack, React, TypeScript, Waku"
        />
        <meta name="author" content="Gato Rojo Lab" />
        <meta name="publisher" content="Gato Rojo Lab" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://pasaporte.app/" />
        <title> Pasaporte.app</title>

        {/* Open Graph / Twitter */}
        <meta property="og:site_name" content="Pasaporte.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pasaporte.app — Tu pasaporte digital para eventos" />
        <meta
          property="og:description"
          content="Pasaporte.app es tu pasaporte digital para eventos como ferias, conferencias y conciertos. Registra tu asistencia de manera rápida y sencilla, guarda tus recuerdos y comparte tu experiencia con amigos y familiares."
        />
        <meta property="og:image" content="/imagenes/soloGato.webp" title="favicon Gato Rojo Lab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="publisher" content="Gato Rojo Lab" />
        <meta name="theme-color" content="#000000" /> {/* Debe coincidir con theme_color en waku.config.ts */}

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Apple Touch Icon para iOS */}
        <link rel="apple-touch-icon" href="/imagenes/apple-touch-icon-180x180.png" />

        {/* JSON-LD básico de organización (archivo estático para evitar inline scripts) */}
        <script type="application/ld+json" src="/structured-data.json"></script>
      </head>
      <body data-version="1.0" className="min-h-screen">
        <AuthStateListener />
        <ServiceWorkerRegistration /> {/* Registramos el service worker para la PWA */}
        {children}
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};

```

#### Construir y desplegar la aplicación

Finalmente, construimos nuestra aplicación Waku como de costumbre:

```bash
pnpm build
```

O si vamos a desplegar a producción, podemos usar un script de despliegue que tengamos configurado, como el mencionado en esta guía: [14-despliegue](/temas/14-despliegue). Ejecutamos:

```bash
pnpm deploy:netlify
```

El plugin de PWA se encargará de generar el service worker y el manifiesto durante el proceso de construcción, y nuestra aplicación ahora debería funcionar como una PWA.

#### Confirmar PWA en producción

Después de desplegar la aplicación, podemos confirmar que funciona como una PWA abriendo la aplicación en un navegador compatible (como Chrome o Edge) y verificamos que aparezca la opción para "Agregar a la pantalla de inicio" o "Instalar" desde el menú del navegador. Vamos a ver un ícono como este en la barra de direcciones:
![Ícono de PWA en navegador](/imagenes/pwa-icono-instalar.svg)

[← Volver](/temas/15-seguridad)
