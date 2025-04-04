import { ImageResponse } from 'next/og';
import { getEpigramDetailsOnServer } from '@/apis/epigram/epigram.service';
import { truncateText } from '@/utils/truncateText';
import { headers } from 'next/headers';

export const contentType = 'image/png';
export const alt = '에피그램';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const header = await headers();
  const host = header.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;

  try {
    const [fontRes, bgRes, epigramRes] = await Promise.all([
      fetch(`${origin}/IropkeBatang.woff`),
      fetch(`${origin}/open-bg.png`),
      getEpigramDetailsOnServer(Number(id)),
    ]);

    if (!fontRes.ok) throw new Error('Font fetch failed');
    if (!bgRes.ok) throw new Error('BG fetch failed');

    const [iropke, bg] = await Promise.all([fontRes.arrayBuffer(), bgRes.arrayBuffer()]);
    const bgBase64 = `data:image/png;base64,${Buffer.from(bg).toString('base64')}`;
    const { content } = epigramRes;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 100,
            fontWeight: 'bold',
            color: 'black',
            backgroundImage: `url(${bgBase64})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {truncateText(content, 8)}
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Iropke',
            data: iropke,
            style: 'normal',
            weight: 400,
          },
        ],
      },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 100,
            fontWeight: 'bold',
            color: 'black',
            backgroundColor: '#fafafa',
          }}
        >
          에피그램
        </div>
      ),
      {
        ...size,
      },
    );
  }
}
