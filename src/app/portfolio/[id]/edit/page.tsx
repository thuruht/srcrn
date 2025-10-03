'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPortfolioItemPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      async function fetchPortfolioItem() {
        try {
          const response = await fetch(`/api/portfolio/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio item');
          }
          const data = await response.json();
          setTitle(data.title);
          setDescription(data.description || '');
          setImageUrl(data.imageUrl);
          setDateCompleted(new Date(data.dateCompleted).toISOString().split('T')[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      }
      fetchPortfolioItem();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          dateCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio item');
      }

      router.push('/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (error && !loading) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Edit Portfolio Item</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-lg font-medium">Image URL</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="dateCompleted" className="block text-lg font-medium">Date Completed</label>
          <input
            id="dateCompleted"
            type="date"
            value={dateCompleted}
            onChange={(e) => setDateCompleted(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {submitting ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}