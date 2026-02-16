import OpenAI from 'openai'

// Venice AI - OpenAI-compatible API with better privacy and pricing
// https://venice.ai

let veniceClient: OpenAI | null = null

export function getVenice(): OpenAI {
  if (!veniceClient) {
    const apiKey = process.env.VENICE_API_KEY
    if (!apiKey) {
      throw new Error('VENICE_API_KEY is not set')
    }
    veniceClient = new OpenAI({
      apiKey,
      baseURL: 'https://api.venice.ai/api/v1',
    })
  }
  return veniceClient
}

export interface ExtractedInvoiceData {
  vendor_name?: string
  vendor_address?: string
  invoice_number?: string
  invoice_date?: string
  due_date?: string
  total_amount?: number
  subtotal?: number
  tax_amount?: number
  currency?: string
  line_items?: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
}

export async function extractInvoiceData(fileUrl: string): Promise<ExtractedInvoiceData> {
  const venice = getVenice()
  
  // Using Qwen3 VL 235B - Venice's default vision model
  // Venice uses a simpler format - just send the URL in the message
  const response = await venice.chat.completions.create({
    model: 'qwen3-vl-235b-a22b',
    messages: [
      {
        role: 'system',
        content: 'You are an expert invoice data extractor. Extract all relevant information from the invoice and return ONLY a valid JSON object.',
      },
      {
        role: 'user',
        content: `Extract data from this invoice image: ${fileUrl}

Return ONLY a JSON object with these fields (omit if not found):
- vendor_name: string
- vendor_address: string  
- invoice_number: string
- invoice_date: string (ISO format like 2024-01-15)
- due_date: string (ISO format)
- total_amount: number (just the number, no $)
- subtotal: number
- tax_amount: number
- currency: string (3-letter code like USD)
- line_items: array of {description, quantity, unit_price, total}

Example response:
{
  "vendor_name": "Acme Corp",
  "invoice_number": "INV-001",
  "total_amount": 100.00,
  "currency": "USD"
}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.1, // Low temperature for consistent JSON
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from Venice AI')
  }

  console.log('Venice raw response:', content)

  // Try to extract JSON from the response
  // Venice might wrap it in markdown or add extra text
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  const jsonStr = jsonMatch ? jsonMatch[0] : content
  
  try {
    return JSON.parse(jsonStr) as ExtractedInvoiceData
  } catch (e) {
    console.error('Failed to parse Venice AI response:', content)
    console.error('Attempted to parse:', jsonStr)
    throw new Error('Invalid JSON from Venice AI')
  }
}
