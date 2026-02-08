import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData"

export default function Despliegue() {

  const data = {
    titulo: "14-Despliegue",
    autor: "Ariel",
    fecha: "30-11-2025",
    tags: ["waku", "guía", "despliegue", "vercel", "netlify"],
  }

  const codigo = {
    despliegueDocumentacion: `NETLIFY=1 pnpm run build
netlify deploy --prod`,
    script: `# scripts/deploy-netlify.sh

#!/usr/bin/env bash
set -euo pipefail

# Usar \`NETLIFY_SITE_ID\` en .env.local permitirá pasar implicitamente el site id al comando de deploy.
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

if [[ -z "\${NETLIFY_SITE_ID:-}" ]]; then
  echo "Ejecutando: netlify deploy --prod"
  netlify deploy --prod
else
  echo "Ejecutando: netlify deploy --prod --site $NETLIFY_SITE_ID"
  netlify deploy --prod --site "$NETLIFY_SITE_ID"
fi
`,
    scriptJson: `// package.json

"scripts": {
"deploy:netlify": "bash scripts/deploy-netlify.sh"
} 
`,
    deploy: `pnpm deploy:netlify`
  }

  return (
    <>
      <RenderTemaData data={data} />

      <section className="tema">

        <h3>Introducción</h3>
        <p>Desplegar proyectos/aplicaciones Waku es relativamente fácil, sobre todo si ya hemos desplegado otro tipo de aplicaciones web.</p>

        <p>Después de ejecutar el comando para build `waku build` (o simplemente pnpm build), podemos ejecutar el comando`waku start`(pnpm start) para ejecutar el servidor de desarrollo <strong>localmente</strong>.</p>

        <p>Si nuestro proyecto es puro SSG, basta con subir la carpeta `dist` a cualquier servidor estático, teniendo en cuenta que cualquier funcionalidad dinámica (como renderizado dinámico, server actions, API endpoints) <strong>no funcionará</strong>.</p>

        <p>En esta sección veremos cómo desplegar específicamente en Netlify. Para más info sobre cómo desplegar en otras plataformas, pueden visitar <a href="https://waku.gg/#deployment">este enlace</a> que lo llevará a la sección de despliegue de la documentación oficial.</p>

        <h4>Despliegue en Netlify</h4>
        <p>Para desplegar en Netlify, la documentación nos indica que debemos ejecutar lo siguiente en la terminal:</p>

        <CodeBlock lang="bash">
          {codigo.despliegueDocumentacion}
        </CodeBlock>

        <p>Si intentamos desplegar mediante Despliegue Continuo, podríamos tener errores, por lo que es recomendable realizar el despliegue manualmente utilizando los comandos anteriores, o bien generando un bash script para automatizarlo.</p>

        <p>Acá un ejemplo de cómo hacerlo:</p>
        <ol>
          <li>1. Creamos un archivo `.env.local` en la raíz del proyecto. Este archivo NUNCA debe subirse a un repositorio público, ya que puede contener información sensible. Para ello basta con agregarlo al `.gitignore` antes de hacer commit. En este archivo agregamos la variable `NETLIFY_SITE_ID` con el ID de nuestro sitio en Netlify (opcional, pero recomendado para evitar tener que loguearse en la CLI de Netlify cada vez que desplegamos).</li>
          <li>Creamos un archivo `scripts/deploy-netlify.sh` con el siguiente contenido: <br />
            <CodeBlock lang="bash">
              {codigo.script}
            </CodeBlock>
          </li>
          <li>Agregamos el script a `package.json`: <br />
            <CodeBlock lang="json">
              {codigo.scriptJson}
            </CodeBlock>
          </li>
          <li>Y para desplegar ejecutamos el siguiente comando: <br />
            <CodeBlock lang="bash">
              {codigo.deploy}
            </CodeBlock>
          </li>
        </ol>

        <BotonesAvance
          rutaSiguiente="/temas/temas/cspdinamico"
          rutaAnterior="/temas/temas/variablesdeentorno"
          textoSiguiente="15-CSP Dinámico"
          textoAnterior="3-Variables de entorno"
        />
      </section>
    </>
  )
};
