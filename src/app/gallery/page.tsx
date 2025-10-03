'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  price: number;
  isSold: boolean;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        const data = await response.json();
        setGalleryItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete gallery item');
        }

        setGalleryItems(galleryItems.filter((item) => item.id !== id));
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
        <h1 className="text-4xl font-bold">Gallery Management</h1>
        <Link href="/gallery/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <div key={item.id} className={`border p-4 rounded-lg shadow-lg ${item.isSold ? 'bg-gray-200' : ''}`}>
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-lg font-bold text-green-600 mb-4">${item.price.toFixed(2)}</p>
              {item.isSold && <p className="text-red-500 font-semibold">Sold</p>}
              <div className="flex justify-end mt-4 space-x-2">
                <Link href={`/gallery/${item.id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}