import { NextResponse } from 'next/server';
import { searchAirports } from '@/lib/flights/dataset';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const results = searchAirports(q);
  return NextResponse.json({ airports: results });
}
