import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    console.log('Upload API called')
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('No file in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size)

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, PNG, JPG allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 10MB.' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    console.log('Uploading to Vercel Blob...')
    const blob = await put(file.name, file, {
      access: 'public',
    })
    console.log('Blob URL:', blob.url)

    // Create document record (anonymous - no userId)
    console.log('Creating document in database...')
    const document = await prisma.document.create({
      data: {
        filename: file.name,
        blobUrl: blob.url,
        fileType: file.type,
        status: 'pending',
      },
    })
    console.log('Document created:', document.id)

    return NextResponse.json({
      success: true,
      documentId: document.id,
      url: blob.url,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
