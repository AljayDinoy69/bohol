import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export interface UserProfile {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  department: string;
  bio: string;
  avatar?: string;
  updatedAt?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('site1');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, role, department, bio, avatar } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('site1');
    const usersCollection = db.collection('users');

    const updateData: any = {
      firstName,
      lastName,
      phone,
      role,
      department,
      bio,
      updatedAt: new Date().toISOString()
    };

    // Only include avatar if provided
    if (avatar) {
      updateData.avatar = avatar;
    }

    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );

    console.log('[API] User profile updated:', result?.value || result);

    const updatedUser = result?.value || result;

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile', details: errorMessage },
      { status: 500 }
    );
  }
}
