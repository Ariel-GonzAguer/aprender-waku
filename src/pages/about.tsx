import { Link } from 'waku';

export default async function AboutPage() {

  return (
    <section>
      <p>Los íconos animados usados en este proyecto son de <a href="http://https://lordicon.com/" target="_blank" rel="noopener noreferrer"></a></p>

    </section>
  );
}


export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
