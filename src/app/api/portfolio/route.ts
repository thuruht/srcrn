import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const portfolioItems = await prisma.portfolioItem.findMany();
    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json({ message: 'Error fetching portfolio items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, imageUrl, dateCompleted } = data;

    if (!title || !imageUrl || !dateCompleted) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newPortfolioItem = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        imageUrl,
        dateCompleted: new Date(dateCompleted),
      },
    });

    return NextResponse.json(newPortfolioItem, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ message: 'Error creating portfolio item' }, { status: 500 });
  }
}