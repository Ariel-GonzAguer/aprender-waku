"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// importar y agregar tipos correspondientes
interface ZustandStore {
  gatos: number;
  incrementarGatos: () => void;
  decrementarGatos: () => string;
  reiniciarStore: () => void;
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

      reiniciarStore: () =>
        set(() => ({
          gatos: 0,
        })),
    })),
    { name: "zustand-gatos-storage" } //Este es el nombre del local storage → cambiar nombre
  )
);

export default useZustandStore;
