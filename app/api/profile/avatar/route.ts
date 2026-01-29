import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;

    if (!file || !email) {
      return NextResponse.json(
        { success: false, error: 'File and email are required' },
        { status: 400 }
      );
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Please upload an image file' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user profile with avatar
    const client = await clientPromise;
    const db = client.db('site1');
    const usersCollection = db.collection('users');

    const result = await usersCollection.findOneAndUpdate(
      { email },
      { 
        $set: { 
          avatar: dataUrl,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after', upsert: true }
    );

    const updatedUser = result?.value || result;

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update avatar' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: updatedUser.email,
        avatar: dataUrl
      },
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload avatar', details: errorMessage },
      { status: 500 }
    );
  }
}
