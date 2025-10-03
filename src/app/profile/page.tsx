'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CreatorProfile {
  id: string;
  name: string;
  bio: string | null;
  profilePictureUrl: string | null;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data: CreatorProfile = await response.json();
        setProfile(data);
        setName(data.name);
        setBio(data.bio || '');
        setProfilePictureUrl(data.profilePictureUrl || '');
        setEmail(data.email);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: profile.id,
          name,
          bio,
          profilePictureUrl,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
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
      <h1 className="text-4xl font-bold mb-8">Manage Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg font-medium">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-lg font-medium">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={5}
          />
        </div>
        <div>
          <label htmlFor="profilePictureUrl" className="block text-lg font-medium">Profile Picture URL</label>
          <input
            id="profilePictureUrl"
            type="url"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {submitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}