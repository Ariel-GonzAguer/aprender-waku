---
titulo: "14-despliegue"
autor: "Ariel"
fecha: "30-11-2025"
tags: ["waku", "guía", "despliegue", "vercel", "netlify"]
---

En esta sección veremos cómo desplegar en dos de las posibles plataformas actualmente que actualmente soportas Waku: Netlify y Vercel. Personalmente recomiendo Netlify.

### Netlify

Para desplegar en Netlify, lo mejor es hacerlo desde la terminal con el comando:

```bash
NETLIFY=1 pnpm run build
netlify deploy --prod
```

Desplegar mediante CI/CD puede generar errores, por lo que fuertemente recomiendo hacerlo de esta manera, o bien crear un `bash script` que haga esto automáticamente, y agregando un script a nuestro `package.json`.
Acá un ejemplo de cómo hacerlo.

```bash
#src/scripts/deploy-netlify.sh

#!/usr/bin/env bash
set -euo pipefail

# Script para desplegar en Netlify
# Ejecuta exactamente:
# NETLIFY=1 pnpm run build
# netlify deploy --prod

# Validaciones básicas
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm no está instalado. Instala pnpm y vuelve a intentar."
  exit 1
fi

if ! command -v netlify >/dev/null 2>&1; then
  echo "Error: Netlify CLI (netlify) no está instalado. Instala netlify-cli y vuelve a intentar."
  exit 1
fi

echo "Ejecutando: NETLIFY=1 pnpm run build"
NETLIFY=1 pnpm run build

echo "Ejecutando: netlify deploy --prod"
netlify deploy --prod
```

Y lo agregamos a nuestro `package.json`:

```json
"scripts": {
  ...
  "deploy:netlify": "bash scripts/deploy-netlify.sh"
}
```

Y simplemente ejecutamos:

```bash
pnpm run deploy:netlify
```

### Vercel

Con Vercel no encontré problemas al desplegar mediante CI/CD, por lo que desplegar de esa manera o mediante CLI.

Existen otras plataformas que de momento están en etapa experimental:Deno Deploy, Cloudflare, AWS Lambda (experimental).
La documentación oficial también menciona la posibilidad de desplegar el proyecto puro SSG. Pueden visitar esta sección → [Despliegue SSG](https://waku.gg/#deployment) para más información.

[← Volver](/temas/13-variablesDeEntorno)
