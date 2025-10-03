'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete blog post');
        }

        setBlogPosts(blogPosts.filter((post) => post.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog Management</h1>
        <Link href="/blog/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Post
        </Link>
      </div>

      <div className="space-y-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="border p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(post.createdAt).toLocaleDateString()} - {post.published ? <span className="text-green-500">Published</span> : <span className="text-yellow-500">Draft</span>}
            </p>
            <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="flex justify-end mt-4 space-x-2">
              <Link href={`/blog/${post.id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}