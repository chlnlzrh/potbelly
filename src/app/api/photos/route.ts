import { NextRequest, NextResponse } from 'next/server'
import { DataManager } from '@/lib/data-manager'

export async function GET(request: NextRequest) {
  try {
    const dataManager = new DataManager()
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    
    // Mock photo data - in real app would come from Vercel Blob Storage
    const photos = [
      {
        id: '1',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        title: 'Kitchen area progress',
        description: 'Ducting installation complete',
        category: 'kitchen',
        uploadedBy: 'Pradeep',
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        location: 'Kitchen Area',
        tags: ['ducting', 'kitchen', 'progress']
      },
      {
        id: '2',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        title: 'Bar area veneer work',
        description: 'Veneer installation above bar area',
        category: 'bar',
        uploadedBy: 'Vishal',
        uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        location: 'Bar Area',
        tags: ['veneer', 'bar', 'finishing']
      },
      {
        id: '3',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        title: 'Electrical panel setup',
        description: 'Main electrical panel installation',
        category: 'electrical',
        uploadedBy: 'Sabharwal',
        uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        location: 'Electrical Room',
        tags: ['electrical', 'panel', 'infrastructure']
      },
      {
        id: '4',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        title: 'Terrace glass frame',
        description: 'Glass frame material selection',
        category: 'exterior',
        uploadedBy: 'Arushi',
        uploadedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        location: 'Terrace',
        tags: ['glass', 'terrace', 'exterior']
      },
      {
        id: '5',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        title: 'Plumbing rough-in',
        description: 'Water line installation progress',
        category: 'plumbing',
        uploadedBy: 'Sandeep',
        uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        location: 'Kitchen & Restroom',
        tags: ['plumbing', 'water', 'infrastructure']
      }
    ]

    let filteredPhotos = photos
    
    if (category) {
      filteredPhotos = photos.filter(photo => photo.category === category)
    }
    
    const limitedPhotos = filteredPhotos.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedPhotos,
      total: filteredPhotos.length,
      categories: ['all', 'kitchen', 'bar', 'electrical', 'exterior', 'plumbing']
    })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const uploadedBy = formData.get('uploadedBy') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // In a real implementation, this would upload to Vercel Blob Storage
    // For now, we'll simulate the upload
    const photoId = Date.now().toString()
    const photoUrl = `/api/placeholder/400/300` // Placeholder URL
    const thumbnailUrl = `/api/placeholder/200/150` // Placeholder thumbnail

    const newPhoto = {
      id: photoId,
      url: photoUrl,
      thumbnail: thumbnailUrl,
      title: title || `Photo ${photoId}`,
      description: description || '',
      category: category || 'general',
      uploadedBy: uploadedBy || 'Unknown',
      uploadedAt: new Date().toISOString(),
      location: location || '',
      tags: [category || 'general']
    }

    // In a real app, this would be saved to a database or file storage
    console.log('Photo uploaded:', newPhoto)

    return NextResponse.json({
      success: true,
      data: newPhoto,
      message: 'Photo uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}