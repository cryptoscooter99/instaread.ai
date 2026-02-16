import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('Fetching documents...')
    
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    console.log('Found documents:', documents.length)

    const serializedDocuments = documents.map(doc => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      extractedData: doc.extractedData as any,
    }))

    return NextResponse.json({ documents: serializedDocuments })
  } catch (error: any) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents: ' + error.message },
      { status: 500 }
    )
  }
}
