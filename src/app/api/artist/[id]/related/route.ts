import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: req as any });
    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${params.id}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related artists');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Related Artists API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related artists' },
      { status: 500 }
    );
  }
}