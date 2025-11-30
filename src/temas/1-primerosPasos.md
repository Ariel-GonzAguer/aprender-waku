---
titulo: "1-primeros pasos"
autor: "Ariel"
fecha: "28-11-2025"
tags: ["waku", "framework", "react", "primeros pasos"]
---

Comenzar un nuevo proyecto con Waku es sencillo. Antes de empezar, hay que asegurarse de tener Node.js en alguna de estas versiones: `^24.0.0` or `^22.12.0` or `^20.19.0`.

En la terminal ejecutamos el siguiente comando para crear un nuevo proyecto:

<div class="bloqueCodigo w-2xs">
<span class="text-pink-300">pnpm</span> create waku@latest
</div>

Nos pedirá un nombre para el proyecto; podemos escribir el que queramos, por ejemplo `portafolio-waku`, y después empezará a instalar las dependencias necesarias.

Esto creará una estrucura básica de un proyecto Waku, que se mira así:

![Estructura base de Waku](/imagenes/estructura-base-waku.webp)

Luego, navegamos al directorio del proyecto y arrancamos el servidor de desarrollo con:

<div class="bloqueCodigo w-83">
<span class="text-pink-300">cd</span> portafolio-waku && <span class="text-pink-300">pnpm</span> dev
</div>

Esto abrirá el proyecto en `http://localhost:3000`, donde podremos ver la página de inicio por defecto de Waku.

**¡Y eso es todo! Ya tenemos un proyecto Waku corriendo localmente y listo para ser personalizado y desarrollado según nuestras necesidades.**


[Siguiente: 2-renderizado →](/temas/2-renderizado)

[← Volver](/temas/0-intro)
