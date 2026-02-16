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
  
  // Using Qwen 2.5 VL 72B - Venice's vision model for document understanding
  const response = await venice.chat.completions.create({
    model: 'qwen-2.5-vl-72b',
    messages: [
      {
        role: 'system',
        content: `You are an expert invoice data extractor. Extract all relevant information from the invoice image/PDF.
        Return ONLY a valid JSON object with these fields:
        - vendor_name: string
        - vendor_address: string
        - invoice_number: string
        - invoice_date: string (ISO format)
        - due_date: string (ISO format)
        - total_amount: number
        - subtotal: number
        - tax_amount: number
        - currency: string (3-letter code)
        - line_items: array of objects with description, quantity, unit_price, total
        
        If a field is not found, omit it. Do not include any markdown or explanation.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: fileUrl,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from Venice AI')
  }

  // Clean up the response - remove markdown code blocks if present
  const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
  
  try {
    return JSON.parse(jsonStr) as ExtractedInvoiceData
  } catch (e) {
    console.error('Failed to parse Venice AI response:', content)
    throw new Error('Invalid JSON from Venice AI')
  }
}
