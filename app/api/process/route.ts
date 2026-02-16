import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractInvoiceData } from '@/lib/openai'
import { fromBuffer } from 'pdf2pic'

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
    console.log('File type:', document.fileType)

    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'processing' },
    })

    try {
      // Fetch the file data
      console.log('Fetching file from blob...')
      const fileResponse = await fetch(document.blobUrl)
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.status}`)
      }
      
      const fileBuffer = await fileResponse.arrayBuffer()
      console.log('File fetched, size:', fileBuffer.byteLength, 'bytes')

      let base64Image: string

      // Convert PDF to image if needed
      if (document.fileType === 'application/pdf') {
        console.log('Converting PDF to image...')
        const convert = fromBuffer(Buffer.from(fileBuffer), {
          density: 150,
          format: 'png',
          width: 1200,
        })
        
        const result = await convert(1) // Convert first page
        if (!result || !result.base64) {
          throw new Error('PDF conversion failed')
        }
        base64Image = `data:image/png;base64,${result.base64}`
        console.log('PDF converted to image')
      } else {
        // For images, use directly
        const base64 = Buffer.from(fileBuffer).toString('base64')
        const mimeType = document.fileType || 'image/jpeg'
        base64Image = `data:${mimeType};base64,${base64}`
      }

      // Extract data using Venice AI with base64 image
      console.log('Calling Venice AI...')
      const extractedData = await extractInvoiceData(base64Image)
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
