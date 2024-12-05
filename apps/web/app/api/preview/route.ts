import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const statusText = error.response?.statusText || 'Internal Server Error';
      const errorMessage = error.message;

      console.error(
        `AxiosError: ${statusCode} ${statusText} - ${errorMessage}`,
      );

      return NextResponse.json(
        {
          error: 'Error fetching URL',
          details: {
            statusCode,
            statusText,
            message: errorMessage,
          },
        },
        { status: statusCode },
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
