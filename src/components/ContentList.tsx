import { useContentCollection } from '../hooks/useContentCollection';

export default function ContentList() {
  const posts = useContentCollection();

  if (!posts.length) return <p className="text-center text-gray-400">Cargando contenido...</p>;

  return (
    <section className="max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Entradas Markdown</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.path} className="border rounded p-4 bg-white shadow">
            <h3 className="text-xl font-semibold mb-1">{post.attributes.titulo || 'Sin título'}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {post.attributes.autor && <>Por {post.attributes.autor}</>}
              {post.attributes.autor && post.attributes.fecha && ' — '}
              {post.attributes.fecha && <>{post.attributes.fecha}</>}
            </p>
            <pre className="text-xs text-gray-400 break-all">{post.path.replace(/^.*markdowns\//, '')}</pre>
            <p className="mt-2 text-gray-700">{post.body.slice(0, 100)}...</p>
            <a href={`#${(post.attributes.titulo || (post.attributes as any).title || '')
              .toLowerCase()
              .replace(/[^a-z0-9-_]+/g, '-')}`}>Ir →</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
