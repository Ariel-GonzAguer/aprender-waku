import Zustand from "../../components/Zustand.client"
import Jotai from "../../components/Jotai";

export default function ManejoDeEstado() {

  return (
    <section className="flex flex-col justify-center items-center gap-4 w-full p-2 text-center">
      <Zustand />
      <Jotai />
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static',
  };
};
