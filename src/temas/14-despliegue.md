---
titulo: "14-despliegue"
autor: "Ariel"
fecha: "30-11-2025"
tags: ["waku", "guía", "despliegue", "vercel", "netlify"]
---

Para desplegar en Netlify, lo mejor es hacerlo desde la terminal con el comando:

```bash
NETLIFY=1 pnpm run build
netlify deploy --prod
```

O bien, ejecuta el script proporcionado en el repositorio que hace exactamente lo mismo, pero sin la necesidad de escribir ambos comandos:

```bash
bash scripts/deploy-netlify.sh
```

