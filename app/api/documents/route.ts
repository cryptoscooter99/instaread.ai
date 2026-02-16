import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // For now, return all documents (anonymous mode)
    // In production, you'd filter by userId from session
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // Serialize dates
    const serializedDocuments = documents.map(doc => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      extractedData: doc.extractedData as any,
    }))

    return NextResponse.json({ documents: serializedDocuments })
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
