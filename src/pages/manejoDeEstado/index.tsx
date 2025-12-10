import ZustandCounter from "../../components/ZustandCounter.client"

export default function ManejoDeEstado() {

  return (
    <section>
      <ZustandCounter />
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static',
  };
};
