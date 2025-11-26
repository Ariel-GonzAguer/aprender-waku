"use client";

import { useState } from "react";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

export default function SearchBar({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Buscar posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 text-base rounded border border-gray-300"
      />
      <p className="mt-2 text-gray-600">
        {filtered.length} de {posts.length} posts encontrados
      </p>
      <ul className="list-none grid gap-4 mt-4">
        {filtered.map((post) => (
          <li key={post.slug} className="p-4 border border-gray-300 rounded-lg">
            <h3>
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </h3>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
