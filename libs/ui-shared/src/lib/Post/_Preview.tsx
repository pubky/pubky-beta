'use client';

import { useState, useEffect } from 'react';
import { Typography } from '../Typography';

interface PreviewData {
  title: string;
  description: string;
  image: string;
}

function LinkPreview({ url }: { url: string }) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/preview?url=${encodeURIComponent(url)}`
        );
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const title = doc.querySelector('title')?.textContent || '';
        const description =
          doc
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || '';
        const image =
          doc
            .querySelector('meta[property="og:image"]')
            ?.getAttribute('content') || '';

        setPreviewData({ title, description, image });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      {(previewData.title || previewData.description) &&
        (previewData.image ? (
          <div
            onClick={handleClick}
            className="relative cursor-pointer border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden"
            style={{
              height: '350px',
              backgroundImage: `url(${previewData.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4">
              <Typography.Body variant="large-bold">
                {previewData.title.length > 40
                  ? previewData.title.slice(0, 40) + '...'
                  : previewData.title}
              </Typography.Body>
              <Typography.Body
                variant="small"
                className="text-opacity-60 font-normal mt-1"
              >
                {previewData.description.length > 150
                  ? previewData.description.slice(0, 150) + '...'
                  : previewData.description}
              </Typography.Body>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="relative cursor-pointer border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden"
          >
            <div className="bg-black bg-opacity-40 p-4">
              <Typography.Body variant="large-bold">
                {previewData.title}
              </Typography.Body>
              <Typography.Body
                variant="small"
                className="text-opacity-60 font-normal mt-1"
              >
                {previewData.description}
              </Typography.Body>
            </div>
          </div>
        ))}
    </div>
  );
}

export default LinkPreview;
