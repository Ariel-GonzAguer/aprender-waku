import { Link } from "waku";
import BotonesAvance from "../../../components/BotonesAvance";
import CodeBlock from "../../../components/CodeBlock";
import RenderTemaData from "../../../components/RenderTemaData";

export default function Renderizado() {
  const data = {
    titulo: "2-Renderizado",
    autor: "Ariel",
    fecha: "5-2-2026",
    tags: [
      "waku",
      "framework",
      "react",
      "renderizado",
      "server components",
      "client components",
      "shared components",
      "ssr",
      "ssg",
      "weaving patterns",
      "RSC",
      "renderizado del lado del servidor",
      "renderizado estático",
      "renderizado dinámico",
      "server-side rendering",
      "static site generation",
    ],
  } as const;

  const codigo = {
    server: `export default async function ComponenteServidor() {
	/**
	 * Hace fetch a un post de JSONPlaceholder.
	 * @returns {Promise<any>} Una promesa que resuelve con los datos del post.
	 */
	async function fetchPosts(): Promise<any> {
		const postUno = await fetch("https://jsonplaceholder.typicode.com/posts/1");
		return postUno.json().then((data) => data.title);
	}

	return (
		<section className="p-6 border border-gray-300 rounded-lg mb-6">
			<h2 className="text-2xl font-bold mb-4">Server Component</h2>
			<p className="mb-6">
				El siguiente dato es el título del post 1 de JSONPlaceholder:
			</p>
			<code>{await fetchPosts()}</code>
		</section>
	);
}

export const getConfig = async () => {
	return {
		render: "dynamic",
	} as const;
};`,
    client: `"use client";

import { useState } from "react";
import type { ReactElement } from "react";

export default function EjemploComponenteCliente() {
	const [gatos, setGatos] = useState<ReactElement[]>([]);

	/**
	 * Genera un elemento de imagen de un gato.
	 * @returns {JSX.Element} Un elemento img que muestra un ícono de un gato rojo que mueve su cabeza.
	 */
	function generarImgGato(): ReactElement {
		return (
			<img
				src="/imagenes/gato-cliente.webp"
				alt="ícono de un gato color rojo que mueve su cabeza."
				className="size-20 rounded-full"
				key={gatos.length}
			/>
		);
	}

	/**
	 * Agrega un nuevo gato a la lista de gatos.
	 */
	function agregarGatos() {
		const imgGato = generarImgGato();
		setGatos([...gatos, imgGato]);
	}

	return (
		<section className="p-6 border border-gray-300 rounded-lg">
			<h2 className="text-2xl font-bold mb-4">Client Component</h2>
			<p className="mb-4">
				Este componente se ejecuta en el cliente, y agrega un gato cada vez que
				se presiona el botón 'Incrementar gatos'.
			</p>
			<button
				onClick={agregarGatos}
				className="px-4 py-2 bg-amber-300 text-black cursor-pointer rounded"
			>
				Incrementar gatos
			</button>
			<p className="mt-4">Gatos:</p>
			<div className="flex flex-wrap gap-2 my-6">{gatos}</div>
		</section>
	);
}
`,
    shared: `import { useId } from "react";

export default function EjemploSharedComponent() {
	function generarId() {
		let ids: string[] = [];
		for (let i = 0; i < 5; i++) {
			ids.push(useId());
		}
		console.log("ID generado:", ids);
		return ids.join(", ");
	}

	return (
		<section className="mt-6">
			<div className="p-6 bg-linear-to-r from-amber-300 to-red-600 text-black rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Componente Shared</h2>
				<p className="mb-3">
					Este componente puede renderizarse en cliente y servidor
				</p>
				<ul className="list-none space-y-2">
					<li>✓ No tiene estado</li>
					<li>✓ No usa APIs del navegador</li>
					<li>✓ No accede a funcionalidades exclusivas del servidor</li>
				</ul>
			</div>
			<p>ID generado por React con useID: {generarId()}</p>
		</section>
	);
}
`,
  } as const;

  return (
    <>
      <RenderTemaData data={data} />

      <section className="tema">
        <h3>
          Server Components y Client Components
        </h3>

        <p>
          Waku nos permite trabajar con componentes de servidor y de cliente.
          Si usted viene de crear proyectos React con Vite, ya ha trabajado con componentes de cliente.
        </p>

        <h4>Server Components / Componentes de Servidor</h4>
        <p>
          Se renderizan en el servidor y envían HTML pre-renderizado al
          navegador. Pueden ejecutar operaciones asíncronas (fetch a APIs,
          consultas a bases de datos) y acceder al sistema de archivos o
          variables de entorno de <strong>manera segura</strong>.
        </p>
        <p>Importante: No tienen estado, efectos ni acceso a APIs del navegador.</p>

        <p className="mt-4">Ejemplo de Server Component:</p>
        <CodeBlock lang="tsx">{codigo.server}</CodeBlock>
        <p className="mt-2">
          Ver renderizado: <Link className="text-amber-300" to="/ejemplos/componenteservidor">Componente de servidor</Link>
        </p>

        <h4>Client Components / Componentes de Cliente</h4>
        <p>
          Se ejecutan en el navegador y permiten interactividad, estado y acceso
          al DOM. Deben comenzar con la directiva <strong>'use client'</strong>  para que Waku los
          renderice en el cliente.
        </p>

        <p className="mt-4">Ejemplo de Client Component:</p>
        <CodeBlock lang="tsx">{codigo.client}</CodeBlock>
        <p className="mt-2">
          Ver renderizado: <Link className="text-amber-300" to="/ejemplos/componentecliente">Componente de cliente</Link>
        </p>

        <h5>Importante</h5>
        <ul className="list-disc list-inside space-y-2 text-left mx-auto max-w-4xl">
          <li>No importe un Server Component dentro de un Client Component.</li>
          <li>No coloque nada antes de la directiva <strong>'use client'</strong> en un Client Component.</li>
          <li>Se pueden anidar Client dentro de Client y Server dentro de Server sin problemas.</li>
          <li>Se pueden importar Client dentro de Server y pasar Server como children a Client.</li>
          <li>Los Shared Components funcionan tanto en cliente como en servidor.</li>
        </ul>

        <h4>Shared Components / Componentes Compartidos</h4>
        <p>
          No usan estado, efectos, DOM, APIs del navegador ni accesos exclusivos
          del servidor. Por eso pueden renderizarse en ambos contextos.
        </p>

        <p className="mt-4">Ejemplo de Shared Component:</p>
        <CodeBlock lang="tsx">{codigo.shared}</CodeBlock>
        <p className="mt-2">
          Ver renderizado: <Link className="text-amber-300" to="/ejemplos/componenteshared">Componente compartido</Link>
        </p>

        <h4>¿Cómo decidir?</h4>
        <p>
          Si necesita interactividad o DOM → Client. <br />
          Si usa APIs del servidor o lógica sensible → Server. <br />
          Si no usa nada exclusivo de cliente ni servidor → Server o Shared.
        </p>

        <h4>Weaving patterns / Patrones de Tejido</h4>
        <p>
          Combina Server y Client Components para equilibrar rendimiento e
          interactividad: Server con Client anidado, Client con Shared anidado.
        </p>

        <h4>Renderizado en Waku</h4>
        <p>
          Waku ofrece pre-renderizado estático (SSG) y renderizado en cada
          solicitud (SSR) para layouts y páginas, tanto con Componentes de
          Servidor como de Cliente.
        </p>

        <h5>¿Qué es SSR y SSG?</h5>
        <p>
          SSR (Server-Side Rendering) genera el HTML en cada solicitud,
          ideal para contenido dinámico. SSG (Static Site Generation) pre-renderiza
          páginas en tiempo de construcción, perfecto para contenido estático y
          mejora el rendimiento.
        </p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/enrutamiento"
          rutaAnterior="/temas/temas/primerospasos"
          textoSiguiente="3-Enrutamiento"
          textoAnterior="1-Primeros pasos"
        />
      </section>
    </>
  );
}
