// app/api/unsplash/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!query || !accessKey) {
    return NextResponse.json({ error: 'Missing query or API key' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${accessKey}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Error from Unsplash API' }, { status: 500 });
    }

    const data = await res.json();

    const images = data.results.map((img: any) => ({
      url: img.urls.regular,
      alt: img.alt_description || 'Imagen de Unsplash',
    }));

    return NextResponse.json(images);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
