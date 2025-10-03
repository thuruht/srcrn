'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define interfaces for the data types
interface CreatorProfile {
  name: string;
  bio: string | null;
  profilePictureUrl: string | null;
}

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
}

interface BlogPost {
  id: string;
  title: string;
  createdAt: string;
}

export default function LandingPage() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, portfolioRes, galleryRes, blogRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/portfolio'),
          fetch('/api/gallery'),
          fetch('/api/blog'),
        ]);

        const profileData = await profileRes.json();
        const portfolioData = await portfolioRes.json();
        const galleryData = await galleryRes.json();
        const blogData = await blogRes.json();

        setProfile(profileData);
        setPortfolioItems(portfolioData.slice(0, 3)); // Show 3 items
        setGalleryItems(galleryData.slice(0, 3)); // Show 3 items
        setBlogPosts(blogData.slice(0, 3)); // Show 3 posts
      } catch (error) {
        console.error("Failed to fetch landing page data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900/?art,studio')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">{profile?.name || "The Artist's Studio"}</h1>
            <p className="text-xl md:text-2xl font-light">{profile?.bio?.substring(0, 100) || "A collection of fine art and creative works."}...</p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-20 px-8 md:px-16 lg:px-32">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {profile?.profilePictureUrl && (
            <div className="md:w-1/3 mb-8 md:mb-0">
              <img src={profile.profilePictureUrl} alt={profile.name} className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover mx-auto shadow-lg" />
            </div>
          )}
          <div className="md:w-2/3 md:pl-12 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4">About the Creator</h2>
            <p className="text-lg leading-relaxed">{profile?.bio}</p>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Portfolio Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map(item => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/portfolio/all" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Works for Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map(item => (
              <div key={item.id} className="border rounded-lg shadow-lg overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/gallery/all" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">Visit the Gallery</Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Latest from the Blog</h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            {blogPosts.map(post => (
              <div key={post.id} className="border-b pb-4">
                <Link href={`/blog/${post.id}`} className="text-2xl font-semibold hover:text-blue-600 transition-colors">{post.title}</Link>
                <p className="text-sm text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="text-blue-600 font-semibold hover:underline">Read more on the blog</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} {profile?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}