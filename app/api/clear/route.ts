import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    const result = await prisma.document.deleteMany({})
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} documents`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to clear documents: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const count = await prisma.document.count()
    
    return NextResponse.json({
      count,
      limit: 5,
      remaining: Math.max(0, 5 - count),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get count: ' + error.message },
      { status: 500 }
    )
  }
}
