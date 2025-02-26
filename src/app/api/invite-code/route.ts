import { NextRequest, NextResponse } from 'next/server';
import validCodesData from './_code.json';

export async function POST(req: NextRequest) {
  try {
    const { inviteCode } = await req.json();

    if (!inviteCode) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const isValid = validCodesData.validCodes.includes(inviteCode);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Errore API /invite-code:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST instead.' }, { status: 405 });
}
