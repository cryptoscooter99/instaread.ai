'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Loader2, Download, Eye } from 'lucide-react'

interface Document {
  id: string
  filename: string
  status: string
  createdAt: string
  extractedData?: any
}

interface UploadZoneProps {
  onUploadComplete: (doc: Document) => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    setError('')

    try {
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Start processing
      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: data.documentId }),
      })

      const processData = await processResponse.json()

      if (!processResponse.ok) {
        throw new Error(processData.error || 'Processing failed')
      }

      onUploadComplete({
        id: data.documentId,
        filename: file.name,
        status: 'completed',
        createdAt: new Date().toISOString(),
        extractedData: processData.data,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing your document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your invoice'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (PDF, PNG, JPG up to 10MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}
    </div>
  )
}

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const downloadCSV = (doc: Document) => {
    if (!doc.extractedData) return

    const data = doc.extractedData
    const headers = ['Field', 'Value']
    const rows = [
      ['Vendor', data.vendor_name || ''],
      ['Invoice #', data.invoice_number || ''],
      ['Date', data.invoice_date || ''],
      ['Due Date', data.due_date || ''],
      ['Subtotal', data.subtotal || ''],
      ['Tax', data.tax_amount || ''],
      ['Total', data.total_amount || ''],
      ['Currency', data.currency || ''],
    ]

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.filename.replace(/\.[^/.]+$/, '')}_extracted.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadJSON = (doc: Document) => {
    if (!doc.extractedData) return

    const blob = new Blob([JSON.stringify(doc.extractedData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.filename.replace(/\.[^/.]+$/, '')}_extracted.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {>/* Debug: Show count */}<
      <p className="text-sm text-gray-500">Total documents: {documents.length}</p>
      
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-4">
            <File className="h-8 w-8 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{doc.filename}</p>
              <p className="text-sm text-gray-500">
                {new Date(doc.createdAt).toLocaleDateString()} • {doc.status}
              </p>
            </div>
          </div>

          {doc.status === 'completed' && doc.extractedData && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadCSV(doc)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Download CSV"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => downloadJSON(doc)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Download JSON"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      ))}

      {documents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No documents yet. Upload your first invoice above!
        </div>
      )}
    </div>
  )
}
