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

    console.log('Processing document:', documentId)
    console.log('File URL:', document.blobUrl)

    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'processing' },
    })

    try {
      // Extract data using Venice AI
      console.log('Calling Venice AI...')
      const extractedData = await extractInvoiceData(document.blobUrl)
      console.log('Venice AI response:', extractedData)

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
    } catch (aiError: any) {
      console.error('AI processing error:', aiError)
      
      // Mark as failed
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'failed' },
      })
      
      return NextResponse.json(
        { error: 'AI processing failed: ' + (aiError.message || 'Unknown error') },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Processing failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
