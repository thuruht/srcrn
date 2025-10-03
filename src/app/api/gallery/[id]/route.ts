import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    });

    if (!galleryItem) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    return NextResponse.json({ message: 'Error fetching gallery item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { title, description, imageUrl, price, isSold } = data;

    if (!title || !imageUrl || price === undefined) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedGalleryItem = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        price,
        isSold,
      },
    });

    return NextResponse.json(updatedGalleryItem);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json({ message: 'Error updating gallery item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.galleryItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json({ message: 'Error deleting gallery item' }, { status: 500 });
  }
}