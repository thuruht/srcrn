'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  portfolioCount: number;
  galleryCount: number;
  blogPostCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [portfolioRes, galleryRes, blogRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/gallery'),
          fetch('/api/blog'),
        ]);

        const portfolioData = await portfolioRes.json();
        const galleryData = await galleryRes.json();
        const blogData = await blogRes.json();

        setStats({
          portfolioCount: portfolioData.length,
          galleryCount: galleryData.length,
          blogPostCount: blogData.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Portfolio Items</h2>
          <p className="text-5xl font-extrabold text-blue-600">{stats?.portfolioCount ?? '...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Gallery Items</h2>
          <p className="text-5xl font-extrabold text-green-600">{stats?.galleryCount ?? '...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Blog Posts</h2>
          <p className="text-5xl font-extrabold text-purple-600">{stats?.blogPostCount ?? '...'}</p>
        </div>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link href="/portfolio" className="block bg-blue-500 text-white text-center p-8 rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
          <h3 className="text-2xl font-bold">Manage Portfolio</h3>
          <p>View, add, edit, and delete past works.</p>
        </Link>
        <Link href="/gallery" className="block bg-green-500 text-white text-center p-8 rounded-lg shadow-lg hover:bg-green-600 transition-colors">
          <h3 className="text-2xl font-bold">Manage Gallery</h3>
          <p>Manage items currently for sale.</p>
        </Link>
        <Link href="/profile" className="block bg-yellow-500 text-white text-center p-8 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors">
          <h3 className="text-2xl font-bold">Manage Profile</h3>
          <p>Update your public creator profile.</p>
        </Link>
        <Link href="/blog" className="block bg-purple-500 text-white text-center p-8 rounded-lg shadow-lg hover:bg-purple-600 transition-colors">
          <h3 className="text-2xl font-bold">Manage Blog</h3>
          <p>Create and manage your blog posts.</p>
        </Link>
      </div>
    </div>
  );
}