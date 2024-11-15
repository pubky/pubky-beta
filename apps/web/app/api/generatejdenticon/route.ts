import { NextResponse } from 'next/server';
import * as jdenticon from 'jdenticon';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }

    const size = 200;
    const png = jdenticon.toPng(id, size);

    return NextResponse.json({ image: png });
  } catch (error) {
    console.error('Error generating Jdenticon image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
