---
titulo: "2-renderizado"
autor: "Ariel"
fecha: "28-11-2025"
---

### Renderizado
Waku nos permite renderizar desde dos lugares: el servidor (Server Components) y el cliente (Client Components).
Si usted viene de crear proyectos React con Vite, ya está familiarizado con el renderizado en el cliente. Waku añade la capacidad de renderizar en el servidor, lo que trae varias ventajas como mejor SEO y tiempos de carga inicial más rápidos.

#### Server Components
Los Server Components se ejecutan en el servidor y envían HTML pre-renderizado al cliente. Esto significa que el contenido ya está listo para mostrarse cuando llega al navegador, mejorando la experiencia del usuario. Estos componentes pueden realizar operaciones asincrónicas, como llamadas a APIs, consultas a bases de datos, y demás operaciones que requieran de lógica del lado del servidor de manera **segura**.
Podemos acceder al sistema de archivos, variables de entorno y otras funcionalidades del servidor sin preocuparnos por exponer información sensible al cliente.
Estos componentes no tienen estado, efectos secundarios, acceso a APIs del navegador, interactividad ni acceso al DOM, ya que **no** se ejecutan en el navegador, ya que se ejecutan **exclusivamente** en el servidor.

Este componente es un ejemplo de Server Component que obtiene datos desde una API y los renderiza en el servidor:

![Componente de servidor](/imagenes/componente-de-servidor.webp)

Puede ver el renderizado en este link → [Componente de servidor renderizado](/ejemplos/componente-servidor)




