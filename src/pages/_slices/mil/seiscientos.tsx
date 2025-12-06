export default function SliceSeiscientos() {

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p>¿Qué tal 600 slices, pero de una mini pizza?</p>
      <p>🍕 x 600</p>
      <p className="text-3xl">🙀</p>
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static',
  };
};
