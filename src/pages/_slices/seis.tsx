export default function SliceSeis() {

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p>¿Qué tal 6 slices de pizza con hongo ostra?</p>
      <p>🍕🍕🍕🍕🍕🍕</p>
      <p className="text-3xl">😸</p>
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static', // por default es 'static', pero igual podemos especificarlo
  };
};
