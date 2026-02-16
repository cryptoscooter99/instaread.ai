'use client'

import { useState, useEffect } from 'react'
import { UploadZone, DocumentList } from '@/components/dashboard'

interface Document {
  id: string
  filename: string
  status: string
  createdAt: string
  extractedData?: any
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch documents on mount and poll every 3 seconds
  useEffect(() => {
    fetchDocuments()
    const interval = setInterval(fetchDocuments, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched documents:', data) // Debug
        setDocuments(data.documents || [])
      } else {
        console.error('Failed to fetch:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    // Refresh the documents list
    fetchDocuments()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Anonymous mode - Sign in to save history</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Invoice
              </h2>
              <UploadZone onUploadComplete={handleUploadComplete} />
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Documents
              </h2>
              <DocumentList documents={documents} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Plan
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-900">Free</p>
              <p className="mt-1 text-sm text-gray-600">5 documents/month</p>
              <a
                href="#"
                className="mt-4 block w-full text-center py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition"
              >
                Upgrade to Pro
              </a>
            </div>

            {/* Usage */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Usage This Month
              </h3>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{documents.length} / 5 documents</span>
                  <span className="text-gray-900 font-medium">
                    {Math.round((documents.length / 5) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((documents.length / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
