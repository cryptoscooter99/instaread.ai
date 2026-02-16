import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractInvoiceData, extractInvoiceDataFromText } from '@/lib/openai'
import pdfParse from 'pdf-parse'

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
      // Fetch the file
      console.log('Fetching file from blob...')
      const fileResponse = await fetch(document.blobUrl)
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.status}`)
      }
      
      const fileBuffer = await fileResponse.arrayBuffer()
      console.log('File fetched, size:', fileBuffer.byteLength, 'bytes')

      let extractedData

      if (document.fileType === 'application/pdf') {
        // Extract text from PDF
        console.log('Extracting text from PDF...')
        const pdfData = await pdfParse(Buffer.from(fileBuffer))
        console.log('PDF text extracted, length:', pdfData.text.length)
        
        // Send text to Venice for extraction
        extractedData = await extractInvoiceDataFromText(pdfData.text)
      } else {
        // For images, use vision model
        const base64 = Buffer.from(fileBuffer).toString('base64')
        const mimeType = document.fileType || 'image/jpeg'
        const dataUrl = `data:${mimeType};base64,${base64}`
        
        extractedData = await extractInvoiceData(dataUrl)
      }

      console.log('Extracted data:', extractedData)

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
