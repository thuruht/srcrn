import Link from "next/link";

export default function DevIndex() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Development Index</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/portfolio" className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Portfolio Management</h2>
          <p>Manage past work.</p>
        </Link>
        <Link href="/gallery" className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Gallery Management</h2>
          <p>Manage items for sale.</p>
        </Link>
        <Link href="/profile" className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Profile</h2>
          <p>Manage creator profile.</p>
        </Link>
        <Link href="/blog" className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Blog</h2>
          <p>Manage blog posts.</p>
        </Link>
        <Link href="/admin" className="border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
          <p>Central management area.</p>
        </Link>
      </div>
    </main>
  );
}