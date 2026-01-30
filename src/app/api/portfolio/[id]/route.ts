import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
    });

    if (!portfolioItem) {
      return NextResponse.json({ message: 'Portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json(portfolioItem);
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json({ message: 'Error fetching portfolio item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { title, description, imageUrl, dateCompleted } = data;

    if (!title || !imageUrl || !dateCompleted) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedPortfolioItem = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        dateCompleted: new Date(dateCompleted),
      },
    });

    return NextResponse.json(updatedPortfolioItem);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ message: 'Error updating portfolio item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.portfolioItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ message: 'Error deleting portfolio item' }, { status: 500 });
  }
}