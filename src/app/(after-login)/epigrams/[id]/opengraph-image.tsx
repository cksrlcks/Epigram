import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getEpigramDetailsOnServer } from '@/apis/epigram/epigram.service';
import { truncateText } from '@/utils/truncateText';

//export const runtime = 'edge';
export const contentType = 'image/png';
export const alt = '에피그램';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const iropke = await fetch('https://epigramogtest.vercel.app/IropkeBatang.woff').then((res) =>
    res.arrayBuffer(),
  );

  const bg = await fetch('https://epigramogtest.vercel.app/open-bg.png').then((res) =>
    res.arrayBuffer(),
  );

  let renderText = '에피그램';
  const bgBase64 = `data:image/png;base64,${Buffer.from(bg).toString('base64')}`;

  try {
    const { content } = await getEpigramDetailsOnServer(Number(id));
    renderText = content;
  } catch (error) {
    console.error(error);
  }

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
        {truncateText(renderText, 8)}
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
}
