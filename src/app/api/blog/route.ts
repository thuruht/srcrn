import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ message: 'Error fetching blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, published } = data;

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newBlogPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        published,
      },
    });

    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ message: 'Error creating blog post' }, { status: 500 });
  }
}