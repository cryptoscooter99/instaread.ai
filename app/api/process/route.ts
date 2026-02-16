import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractInvoiceData } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      )
    }

    // Get document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'processing' },
    })

    try {
      // Extract data using OpenAI
      const extractedData = await extractInvoiceData(document.blobUrl)

      // Update document with extracted data
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'completed',
          extractedData: extractedData as any,
        },
      })

      return NextResponse.json({
        success: true,
        data: extractedData,
      })
    } catch (error) {
      // Mark as failed
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'failed' },
      })
      throw error
    }
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}
