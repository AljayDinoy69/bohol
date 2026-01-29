import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface BoholTown {
  _id?: string;
  name: string;
  lat: number;
  lng: number;
  district: number;
  createdAt?: string;
  updatedAt?: string;
}

// Initialize towns data if collection is empty
async function initializeTowns() {
  const client = await clientPromise;
  const db = client.db('site1');
  const townsCollection = db.collection('bohol_towns');
  
  const existingCount = await townsCollection.countDocuments();
  if (existingCount > 0) return; // Already initialized
  
  const initialTowns = [
    // First District
    { name: "Tagbilaran City", lat: 9.6399, lng: 123.8543, district: 1 },
    { name: "Alburquerque", lat: 9.6081, lng: 123.9575, district: 1 },
    { name: "Antequera", lat: 9.7828, lng: 123.8997, district: 1 },
    { name: "Baclayon", lat: 9.6222, lng: 123.9111, district: 1 },
    { name: "Balilihan", lat: 9.7547, lng: 123.9694, district: 1 },
    { name: "Calape", lat: 9.8911, lng: 123.8825, district: 1 },
    { name: "Catigbian", lat: 9.8294, lng: 124.0225, district: 1 },
    { name: "Corella", lat: 9.6869, lng: 123.9222, district: 1 },
    { name: "Cortes", lat: 9.6911, lng: 123.8825, district: 1 },
    { name: "Dauis", lat: 9.6283, lng: 123.8689, district: 1 },
    { name: "Loon", lat: 9.7997, lng: 123.8017, district: 1 },
    { name: "Maribojoc", lat: 9.7431, lng: 123.8422, district: 1 },
    { name: "Panglao", lat: 9.5806, lng: 123.7486, district: 1 },
    { name: "Sikatuna", lat: 9.6914, lng: 123.9725, district: 1 },
    { name: "Tubigon", lat: 9.9514, lng: 123.9639, district: 1 },

    // Second District
    { name: "Bien Unido", lat: 10.1692, lng: 124.3311, district: 2 },
    { name: "Buenavista", lat: 10.0822, lng: 124.1106, district: 2 },
    { name: "Clarin", lat: 9.9614, lng: 124.0253, district: 2 },
    { name: "Dagohoy", lat: 9.9239, lng: 124.2697, district: 2 },
    { name: "Danao", lat: 10.0019, lng: 124.2014, district: 2 },
    { name: "Getafe", lat: 10.1472, lng: 124.1528, district: 2 },
    { name: "Inabanga", lat: 10.0039, lng: 124.0725, district: 2 },
    { name: "Pres. Carlos P. Garcia", lat: 10.1206, lng: 124.4842, district: 2 },
    { name: "Sagbayan", lat: 9.9208, lng: 124.1086, district: 2 },
    { name: "San Isidro", lat: 9.8894, lng: 123.9931, district: 2 },
    { name: "San Miguel", lat: 9.9889, lng: 124.3456, district: 2 },
    { name: "Talibon", lat: 10.1489, lng: 124.3325, district: 2 },
    { name: "Trinidad", lat: 10.0889, lng: 124.3344, district: 2 },
    { name: "Ubay", lat: 10.0572, lng: 124.4719, district: 2 },

    // Third District
    { name: "Alicia", lat: 9.8978, lng: 124.4419, district: 3 },
    { name: "Anda", lat: 9.7444, lng: 124.5761, district: 3 },
    { name: "Batuan", lat: 9.7864, lng: 124.1503, district: 3 },
    { name: "Bilar", lat: 9.7153, lng: 124.1136, district: 3 },
    { name: "Candijay", lat: 9.8411, lng: 124.5458, district: 3 },
    { name: "Carmen", lat: 9.8214, lng: 124.1950, district: 3 },
    { name: "Dimiao", lat: 9.6053, lng: 124.1683, district: 3 },
    { name: "Duero", lat: 9.6881, lng: 124.3700, district: 3 },
    { name: "Garcia Hernandez", lat: 9.6136, lng: 124.2344, district: 3 },
    { name: "Guindulman", lat: 9.7522, lng: 124.4858, district: 3 },
    { name: "Jagna", lat: 9.6517, lng: 124.3683, district: 3 },
    { name: "Lila", lat: 9.5911, lng: 124.0989, district: 3 },
    { name: "Loay", lat: 9.6031, lng: 124.0117, district: 3 },
    { name: "Loboc", lat: 9.6414, lng: 124.0353, district: 3 },
    { name: "Mabini", lat: 9.8631, lng: 124.5222, district: 3 },
    { name: "Pilar", lat: 9.8169, lng: 124.3353, district: 3 },
    { name: "Sevilla", lat: 9.7156, lng: 124.0531, district: 3 },
    { name: "Sierra Bullones", lat: 9.7844, lng: 124.2881, district: 3 },
    { name: "Valencia", lat: 9.6097, lng: 124.2036, district: 3 }
  ];

  const townsWithTimestamps = initialTowns.map(town => ({
    ...town,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  await townsCollection.insertMany(townsWithTimestamps);
  console.log('Bohol towns initialized in database');
}

export async function GET(request: NextRequest) {
  try {
    await initializeTowns();
    
    const client = await clientPromise;
    const db = client.db('site1');
    const townsCollection = db.collection('bohol_towns');
    
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const search = searchParams.get('search');
    
    let filter: any = {};
    
    if (district) {
      filter.district = parseInt(district);
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const towns = await townsCollection
      .find(filter)
      .sort({ district: 1, name: 1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: towns,
      total: towns.length
    });
  } catch (error) {
    console.error('Error fetching towns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch towns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lat, lng, district } = body;
    
    if (!name || lat === undefined || lng === undefined || !district) {
      return NextResponse.json(
        { success: false, error: 'Name, lat, lng, and district are required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('site1');
    const townsCollection = db.collection('bohol_towns');
    
    const newTown = {
      name,
      lat,
      lng,
      district: parseInt(district),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await townsCollection.insertOne(newTown as any);
    
    return NextResponse.json({
      success: true,
      data: { ...newTown, _id: result.insertedId.toString() },
      message: 'Town added successfully'
    });
  } catch (error) {
    console.error('Error adding town:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add town' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, lat, lng, district } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Town ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('site1');
    const townsCollection = db.collection('bohol_towns');
    
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (name) updateData.name = name;
    if (lat !== undefined) updateData.lat = lat;
    if (lng !== undefined) updateData.lng = lng;
    if (district) updateData.district = parseInt(district);
    
    const result = await townsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Town not found' },
        { status: 404 }
      );
    }
    
    const updatedTown = result.value || result;
    
    return NextResponse.json({
      success: true,
      data: updatedTown,
      message: 'Town updated successfully'
    });
  } catch (error) {
    console.error('Error updating town:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update town' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Town ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('site1');
    const townsCollection = db.collection('bohol_towns');
    
    const result = await townsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Town not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Town deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting town:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete town' },
      { status: 500 }
    );
  }
}
