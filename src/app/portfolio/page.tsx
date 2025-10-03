'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  dateCompleted: string;
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items');
        }
        const data = await response.json();
        setPortfolioItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete portfolio item');
        }

        setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
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
        <h1 className="text-4xl font-bold">Portfolio Management</h1>
        <Link href="/portfolio/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-lg">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <p className="text-sm text-gray-500">Completed: {new Date(item.dateCompleted).toLocaleDateString()}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <Link href={`/portfolio/${item.id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}