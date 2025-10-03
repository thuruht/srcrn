import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany();
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json({ message: 'Error fetching gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, imageUrl, price } = data;

    if (!title || !imageUrl || price === undefined) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newGalleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description,
        imageUrl,
        price,
      },
    });

    return NextResponse.json(newGalleryItem, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json({ message: 'Error creating gallery item' }, { status: 500 });
  }
}