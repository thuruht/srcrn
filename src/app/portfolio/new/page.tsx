'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPortfolioItemPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
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
        throw new Error('Failed to create portfolio item');
      }

      router.push('/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Add New Portfolio Item</h1>
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
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}