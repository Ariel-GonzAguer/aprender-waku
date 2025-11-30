---
titulo: "2-renderizado"
autor: "Ariel"
fecha: "28-11-2025"
---

### Renderizado

Waku nos permite renderizar desde dos lugares: el servidor (Server Components) y el cliente (Client Components).
Si usted viene de crear proyectos React con Vite, ya está familiarizado con el renderizado en el cliente. Waku añade la capacidad de renderizar en el servidor.

#### Server Components

Los _Server Components_ se ejecutan en el servidor y envían HTML pre-renderizado al cliente. Esto significa que el contenido ya está listo para mostrarse cuando llega al navegador, pudiendo mejorar la experiencia de la persona usuaria. Estos componentes pueden realizar operaciones asincrónicas, como llamadas a APIs, consultas a bases de datos, y demás operaciones que requieran de lógica del lado del servidor de manera **segura**.
Podemos acceder al sistema de archivos, variables de entorno y otras funcionalidades del servidor sin preocuparnos por exponer información sensible al cliente.
Estos componentes **no** tienen estado, efectos secundarios, acceso a APIs **exclusivas del navegador**, interactividad ni acceso al DOM, ya que se ejecutan **exclusivamente** en el servidor.

Este es el código de un _Server Component_ que obtiene datos desde una API y los renderiza en el servidor:

![Componente de servidor/Server Component](/imagenes/componente-de-servidor.webp)

Puede ver el renderizado en este link → [Componente de servidor/Server Component renderizado](/ejemplos/componente-servidor)

---

#### Client Components

Los _Client Components_ se ejecutan en el navegador y permiten crear interfaces interactivas. Estos componentes pueden tener estado, efectos secundarios, acceso al DOM y APIs del navegador. Son los componentes React 'tradicionales'.
Para definir un componente como _Client Component_, debemos agregar la directiva distintiva `'use client'` al inicio del archivo del componente. Esto indica a Waku que este componente debe ser renderizado en el cliente.

Este es el código de un _Client Component_ que agrega gatos a una lista cuando se hace clic en un botón:

![Componente de cliente/Client Component](/imagenes/componente-de-cliente.webp)

Puede ver el renderizado en este link → [Componente de cliente/Client Component renderizado](/ejemplos/componente-cliente)

Siempre que importamos un `Client Component` dentro de un `Server Component`, creamos un `“server-client boundary”` (límite entre servidor y cliente). Si importamos un `Server Component` (llamémosle 'serverCompUno.tsx') dentro de un `Client Component`(llamémosle 'clientCompUno.tsx'), y luego importamos el `clientCompUno.tsx` dentro de un `Server Component`(llamémosle 'parentServerComp.tsx'), `serverCompUno.tsx` se comportará como un `Client Component`.
Para que `serverCompUno.tsx` se comporte como un `Server Component`, debemos importarlo directamente dentro de `parentServerComp.tsx`, sin pasar por un `clientCompUno.tsx`.

##### Importante:

- -> No podemos importar un `Server Component` dentro de un `Client Component`.
- -> No debe haber **nada** antes de la directiva `'use client'` en un `Client Component`, ya que esto causará un error de compilación. No comentarios, importaciones, espacios invisibles ni declaraciones de variables. Nada de nada.
- -> Podemos importar `Client Components` dentro de otros `Client Components` sin problemas.
- -> Podemos importar `Server Components` dentro de otros `Server Components` sin problemas.
- -> Podemos importar `Client Components` dentro de `Server Components` sin problemas.
- -> Podemos pasarle `Server Components` como props(children) a `Client Components`, pero no al revés.
- -> Podemos importar un `Shared Component` (ver más abajo) dentro de un `Client Component` sin problemas.

---

#### Shared components

Los _Shared Components_ son componentes que cumplen las reglas tanto de los _Server Components_ como de los _Client Components_. Estos componentes no utilizan características exclusivas de ninguno de los dos entornos, por lo que se pueden importar y utilizar en ambos tipos de componentes sin problemas. Estas son las reglas que deben seguir los _Shared Components_:

- ->->  No tienen estado.
- -> No utilizan efectos secundarios.
- -> No acceden al DOM.
- -> No utilizan APIs exclusivas del navegador.
- -> No realizan operaciones asíncronas.
- -> No acceden a funcionalidades exclusivas del servidor, como el sistema de archivos o variables de entorno.

Este es el código de un _Shared Component_ que muestra un mensaje simple:
![Componente compartido/Shared Component](/imagenes/componente-shared.webp)

Puede ver el renderizado en este link → [Componente compartido/Shared Component renderizado](/ejemplos/componente-shared)

---

#### ¿Cuándo es un Server Component, un Client Component o un Shared Component?

- -> Si el componente necesita interactividad, estado o acceso al DOM, tiene `'use client'` → **Client Component**.
- -> Si el componente realiza operaciones asíncronas, accede a datos del servidor o utiliza funcionalidades exclusivas del servidor → **Server Component**.
- -> Si el componente no utiliza características exclusivas de ninguno de los dos entornos → **Shared Component**.

            ¿Tiene “use client”?
         ┌──────────┴──────────┐
         |                     |
       Sí → Client Component   No
                              |
                          ¿Usa APIs del servidor?
                     ┌────────┴─────────┐
                     |                  |
                   Sí → Server Component  No
                                         |
                                 ¿Usa APIs del navegador / estado / efectos?
                                 ┌────────┴────────┐
                                 |                 |
                               Sí → Client         No
                                                   |
                                             Shared Component
---

#### Weaving patterns (Patrones de tejido)

Waku permite combinar _Server Components_ y _Client Components_ de diversas maneras para crear aplicaciones web eficientes e interactivas. Algunos patrones comunes incluyen:

- **Server Component con Client Component anidado:** Un _Server Component_ que obtiene datos del servidor y renderiza un _Client Component_ para manejar la interactividad en el cliente.
- **Client Component con Server Component anidado:** Un _Client Component_ que maneja la interactividad y renderiza un _Server Component_ para mostrar datos pre-renderizados.
- **Shared Component en ambos contextos:** Un _Shared Component_ que se utiliza tanto en _Server Components_ como en _Client Components_ para mantener la consistencia en la interfaz de usuario.

---


