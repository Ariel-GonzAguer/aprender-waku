// funcion para obtener la lista de posts y mostrarlos
import { getPosts } from '../lib/posts'

import { Link } from 'waku'

export default async function PostList() {
  const posts = await getPosts()

  return (
    <section>
      <h2>Últimos artículos</h2>
      <ul className="list-none grid gap-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="p-4 border border-gray-300 rounded-lg"
          >
            <h3>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.excerpt}</p>
            <small className="text-gray-600">📅 {post.date}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}
