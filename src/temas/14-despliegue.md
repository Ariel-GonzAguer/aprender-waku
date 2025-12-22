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

Desplegar mediante CI/CD puede generar errores, por lo que **fuertemente** recomiendo crear un `bash script` que haga esto automáticamente, y agregarlo como un script a nuestro `package.json`.
Acá un ejemplo de cómo hacerlo.

1. Creamos un archivo `.env.local` en la raíz del proyecto. Este archivo NUNCA debe subirse a un repositorio público, ya que puede contener información sensible. En este archivo agregamos la variable `NETLIFY_SITE_ID` con el ID de nuestro sitio en Netlify (opcional, pero recomendado para evitar tener que loguearse en la CLI de Netlify cada vez que desplegamos).
2. Creamos un archivo `scripts/deploy-netlify.sh` con el siguiente contenido:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usar `NETLIFY_SITE_ID` en .env.local permitirá pasar implicitamente el site id al comando de deploy.
if [ -f ".env.local" ]; then
  echo "Cargando variables de entorno desde .env.local"
  # exporta todas las variables definidas en el archivo .env.local
  set -o allexport
  # shellcheck disable=SC1091
  source ".env.local"
  set +o allexport
fi

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

if [[ -z "${NETLIFY_SITE_ID:-}" ]]; then
  echo "Ejecutando: netlify deploy --prod"
  netlify deploy --prod
else
  echo "Ejecutando: netlify deploy --prod --site $NETLIFY_SITE_ID"
  netlify deploy --prod --site "$NETLIFY_SITE_ID"
fi
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
pnpm deploy:netlify
```

### Vercel

Con Vercel no encontré problemas al desplegar mediante CI/CD, por lo que desplegar de esa manera o mediante CLI.

Existen otras plataformas que de momento están en etapa experimental:Deno Deploy, Cloudflare, AWS Lambda (experimental).
La documentación oficial también menciona la posibilidad de desplegar el proyecto puro SSG. Pueden visitar esta sección → [Despliegue SSG](https://waku.gg/#deployment) para más información.

[Siguiente: 15-seguridad →](/temas/15-seguridad)

[← Volver](/temas/13-variablesDeEntorno)
