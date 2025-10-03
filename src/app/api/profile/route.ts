import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get the creator profile (assuming only one exists)
export async function GET() {
  try {
    let profile = await prisma.creatorProfile.findFirst();

    // If no profile exists, create a default one
    if (!profile) {
      profile = await prisma.creatorProfile.create({
        data: {
          name: 'New Creator',
          email: 'creator@example.com',
          bio: 'Welcome to my portfolio!',
          profilePictureUrl: '',
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching or creating profile:", error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}

// Update the creator profile
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name, bio, profilePictureUrl, email } = data;

    if (!id || !name || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedProfile = await prisma.creatorProfile.update({
      where: { id },
      data: {
        name,
        bio,
        profilePictureUrl,
        email,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
  }
}