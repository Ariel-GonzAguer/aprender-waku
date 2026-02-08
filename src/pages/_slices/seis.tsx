export default function SliceSeis() {

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p className="m-1!">¿Qué tal 6 slices de pizza con hongo ostra?</p>
      <p className="m-1!">🍕🍕🍕🍕🍕🍕</p>
      <p className="text-3xl m-1!">😸</p>
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static', // por default es 'static', pero igual podemos especificarlo
  };
};
