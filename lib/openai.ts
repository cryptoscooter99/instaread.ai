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
  receipt_number?: string
  invoice_date?: string
  date_paid?: string
  due_date?: string
  total_amount?: number
  subtotal?: number
  tax_amount?: number
  currency?: string
  line_items?: Array<{
    description: string
    quantity: number
    unit_price: number
    tax?: number
    amount: number
  }>
  payment_method?: string
  bill_to?: string
}

export async function extractInvoiceData(base64Image: string): Promise<ExtractedInvoiceData> {
  const venice = getVenice()
  
  // Using Qwen3 VL 235B - Venice's default vision model
  const response = await venice.chat.completions.create({
    model: 'qwen3-vl-235b-a22b',
    messages: [
      {
        role: 'system',
        content: `You are an expert invoice and receipt data extractor. Your job is to carefully read the document and extract ONLY the information that is actually visible. Do not make up or hallucinate any data. If a field is not present in the document, omit it entirely.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Extract all visible information from this receipt/invoice image.

Return ONLY a valid JSON object with these fields (ONLY include fields you can actually see):
- vendor_name: The company name (e.g., "Vercel Inc.", "Amazon")
- vendor_address: Full address if present
- invoice_number: Invoice number (e.g., "TBVVKUVE-0008")
- receipt_number: Receipt number if different from invoice
- invoice_date: Date in ISO format (e.g., "2026-02-12")
- date_paid: Payment date if different
- due_date: Due date if present
- total_amount: Final total as a number (e.g., 1.95)
- subtotal: Subtotal before tax as a number
- tax_amount: Total tax as a number
- currency: Currency code (e.g., "USD")
- line_items: Array of items with description, quantity, unit_price, tax, amount
- payment_method: How they paid (e.g., "Mastercard - 3523")
- bill_to: Customer name/address

IMPORTANT: Only extract what you can actually see. Do not guess or make up data.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
    temperature: 0.1,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from Venice AI')
  }

  console.log('Venice raw response:', content.substring(0, 500))

  // Try to extract JSON from the response
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
