---
titulo: "12-manejoDeEstado"
autor: "Ariel"
fecha: "30-11-2025"
tags: ["waku", "guía", "manejo de estado"]
---

La guía oficial recomienda usar [Jotai](https://jotai.org) -Desarrollada también por Daishi Kato- para el manejo del estado global, pero también indica que Waku es compatible con todas las librerías de manejo de estado, como por ejemplo [Zustand](https://zustand-demo.pmnd.rs/) o [Valtio](https://valtio.dev/) -ambas mantenidas también por Daishi Kato 🔥-.

En esta sección veremos un par ejemplos básicos con Zustand y Jotai.

### Zustand

Zustand es una librería de manejo de estado muy sencilla y liviana. Para usarla en Waku, primero debemos instalarla:

```bash
pnpm add zustand
```

Luego debemos crear una tienda (store) para nuestro estado global. Para este proyecto tenemos `src/stores/zustand/useZustandStore.ts`, que se ve así:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// importar y agregar tipos correspondientes
interface ZustandStore {
  gatos: number;
  incrementarGatos: () => void;
  decrementarGatos: () => string;
}

const useZustandStore = create<ZustandStore>()(
  //cambiar nombre
  persist(
    immer((set) => ({
      // estados
      gatos: 0,

      // acciones
      incrementarGatos: () =>
        set((state: any) => {
          state.gatos += 1;
        }),

      decrementarGatos: () =>
        "No se puede decrementar gatos ¿Por qué querría hacer eso? 🐱",
    })),
    { name: "zustand-gatos-storage" } //Este es el nombre del local storage → cambiar nombre
  )
);

export default useZustandStore;
```

Vamos a usar persistencia en el almacenamiento local (local storage) para que el estado se mantenga entre recargas de la página, para ello usamos el middleware `persist`. También usamos el middleware `immer` para poder mutar el estado directamente.

Podemos ver el uso de este store en la siguiente ruta → [/manejoDeEstado](/manejoDeEstado).

[Siguiente: 13-variablesDeEntorno →](/temas/13-variablesDeEntorno)

[← Volver](/temas/11-mutaciones)
