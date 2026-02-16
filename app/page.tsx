import Link from 'next/link'
import { Upload, Zap, FileText, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">InstaRead</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link
            href="/dashboard"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Turn PDFs into
          <br />
          <span className="text-primary-600">Structured Data</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Upload any invoice, receipt, or document. Our AI extracts the data instantly. 
          Export to Excel, QuickBooks, or JSON.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/dashboard"
            className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
          >
            Start Free — No Credit Card
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">5 free documents. No signup required.</p>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload</h3>
              <p className="text-gray-600">Drop your PDF or image. We support invoices, receipts, forms, and more.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Processing</h3>
              <p className="text-gray-600">Our AI reads and extracts key data in seconds. No templates needed.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Export</h3>
              <p className="text-gray-600">Download as CSV, JSON, or send directly to QuickBooks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  5 documents/month
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Basic export formats
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 block text-center py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-primary-600 rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-white">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-primary-200">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-white">
                  <CheckCircle className="h-5 w-5 text-primary-300 mr-2" />
                  100 documents/month
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="h-5 w-5 text-primary-300 mr-2" />
                  All export formats
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="h-5 w-5 text-primary-300 mr-2" />
                  QuickBooks integration
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="h-5 w-5 text-primary-300 mr-2" />
                  Priority processing
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 block text-center py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900">Business</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited documents
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Dedicated support
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 block text-center py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500 text-sm">
        © 2026 InstaRead. Built by AI, run by humans.
      </footer>
    </div>
  )
}
