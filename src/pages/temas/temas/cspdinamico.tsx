import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData";

export default function CSPDinamico() {

  const data = {
    titulo: "15-CSP Dinámico",
    autor: "Ariel",
    fecha: "21-12-2025",
    tags: ["waku", "guía", "seguridad", "autenticación", "autorización"],
  }

  const codigo = {
    cspNoce: `// src/edge-functions/csp-nonce.ts 
    import type { Context } from '@netlify/edge-functions';

/**
 * Genera un nonce criptográficamente seguro para CSP
 */
function generateNonce(): string {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}

/**
 * Edge Function que añade nonces dinámicos a la Content Security Policy
 * y los inyecta en los scripts inline del HTML
 */
export default async (request: Request, context: Context) => {
  // Obtener la respuesta original
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  // Solo procesar respuestas HTML
  if (!contentType.includes('text/html')) {
    return response;
  }

  console.log('Procesando request para añadir CSP con nonce dinámico');
  // Generar un nonce único para esta request
  const nonce = generateNonce();

  // Crear nueva respuesta con headers modificados
  const newHeaders = new Headers(response.headers);
  
  // Configurar CSP con el nonce dinámico
  const csp = [
    "default-src 'none'",
    \`script-src 'self' 'nonce-\${nonce}'\`,
    \`script-src-elem 'self' 'nonce-\${nonce}'\`,
    "connect-src 'self' https://pokeapi.co https://api.thecatapi.com https://jsonplaceholder.typicode.com",
    "img-src 'self' data: https: blob:",
    // ...otras políticas necesarias para su aplicación
  ].join('; ');
  
  newHeaders.set('Content-Security-Policy', csp);

  // Leer el HTML y añadir el nonce a los scripts inline
  const html = await response.text();
  
  // Inyectar el nonce en todos los scripts inline
  // Captura scripts con o sin atributos, pero solo inline (sin src)
  const modifiedHtml = html.replace(
    /<script(?!\s+src=)([^>]*)>/gi,
    (match, attributes) => {
      // Si ya tiene nonce, no añadir otro
      if (attributes.includes('nonce=')) {
        return match;
      }
      // Añadir nonce antes del cierre >
      return \`<script\${attributes} nonce="\${nonce}">\`;
    }
  );

  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config = {
  path: '/*',
};
    `,
  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className="tema">
        <p>Nota: Esta es una sección extra que no se menciona en la documentación oficial de Waku, pero que considero importante tratar.</p>

        <h3>Introducción</h3>

        <p>Waku inyecta scripts para mostrar el contenido de nuestra página, lo que puede generar choques con una CSP (Content Security Policy) estricta.</p>
        <p>Una forma de mitigar este problema es usar `nonce` en los scripts inyectados.</p>
        <p>Para ello podemos crear un `middleware` que genere un `nonce` único para cada solicitud y lo agregue a los encabezados de respuesta, pero hay un detalle: según dónde se despliegue, la forma de agregar encabezados puede variar.</p>
        <p>En Vercel los cabezados se configuran en el archivo `vercel.json`, de manera estática, por lo que no es posible (o no he logrado) agregar un `nonce` dinámicamente.</p>

        <p> En Netlify, en cambio, podemos usar un middleware para agregar los encabezados dinámicamente mediante Edge Functions.</p>
        <p>Acá un ejemplo de un middleware que agrega un `nonce` a los scripts inyectados por Waku:</p>

        <CodeBlock>
          {codigo.cspNoce}
        </CodeBlock>

        <p>Este middleware genera un `nonce` único para cada solicitud, lo agrega a la política de seguridad de contenido y lo inyecta en los scripts inline del HTML. De esta manera, podemos mantener una CSP estricta sin bloquear los scripts necesarios para que Waku funcione correctamente.</p>

        <p>El anterior código, aunque logra el resultado esperable, puede mejorarse. En el siguiente enlace puede ver un poco más sobre cómo hacerlo → <a href="https://github.com/wakujs/waku/pull/1925#issuecomment-3797015616">MasterHash CSP Approach</a>.</p>
        <p>También puede ver la siguiente guía sobre Configurar CSP que está en la documentación oficial → <a href="https://waku.gg/guides/csp">Configurar CSP</a>.</p>

        <h3>Sugerencias adicionales</h3>
        <ul>
          <li>→ Analizar qué políticas de seguridad son necesarias para nuestra aplicación y ajustarlas según el contexto.</li>
          <li>→ Siempre validar y sanitizar cualquier entrada del usuario para prevenir ataques de inyección.</li>
          <li>→ Utilizar HTTPS para todas las comunicaciones para proteger los datos en tránsito.</li>
          <li>→ Implementar mecanismos de autenticación y autorización adecuados para proteger las rutas sensibles de la aplicación.</li>
          <li>→ Mantener las dependencias actualizadas para evitar vulnerabilidades conocidas.</li>
          <li>→ Realizar auditorías de seguridad periódicas para identificar y mitigar posibles riesgos.</li>
          <li>→ Considerar el uso de herramientas de análisis de seguridad estática para detectar vulnerabilidades en el código.</li>
          <li>→ No usar 'unsafe-eval' ni 'unsafe-inline' en la CSP (a menos que sea absolutamente necesario), ya que esto puede abrir la puerta a ataques XSS.</li>
        </ul>

        <BotonesAvance
          rutaSiguiente="/temas/temas/pwa"
          rutaAnterior="/temas/temas/despliegue"
          textoSiguiente="16-PWA"
          textoAnterior="15-Despliegue"
        />
      </section>
    </>
  )
};
