// funcion para obtener la lista de posts y mostrarlos
import { getPosts } from '../lib/temas'
import SearchBar from './SearchBar.client'
// import { Link } from 'waku'

export default async function PostList() {
  const posts = await getPosts()

   return (
    <section>
      <h2>Artículos</h2>
      <SearchBar posts={posts.map(p => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content }))} />
    </section>
  )
}
