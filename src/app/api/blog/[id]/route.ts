import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!blogPost) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ message: 'Error fetching blog post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { title, content, published } = data;

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedBlogPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        content,
        published,
      },
    });

    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ message: 'Error updating blog post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ message: 'Error deleting blog post' }, { status: 500 });
  }
}