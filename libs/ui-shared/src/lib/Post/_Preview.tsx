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
    <div className="w-full mb-6">
      <div
        onClick={handleClick}
        className="cursor-pointer w-full mt-4 p-6 bg-white bg-opacity-10 border border-transparent hover:border-white hover:border-opacity-30 rounded-xl justify-between items-start inline-flex"
      >
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
          {previewData.title && (
            <Typography.H2>
              {previewData.title.length > 40
                ? previewData.title.slice(0, 40) + '...'
                : previewData.title}
            </Typography.H2>
          )}
          {previewData.description ? (
            <Typography.Body variant="small" className="text-opacity-80">
              {' '}
              {previewData.description.length > 150
                ? previewData.description.slice(0, 150) + '...'
                : previewData.description}
            </Typography.Body>
          ) : (
            <Typography.Body variant="small" className="text-opacity-80">
              {' '}
              {url.length > 60 ? url.slice(0, 60) + '...' : url}
            </Typography.Body>
          )}
        </div>
        {previewData.image && (
          <img
            alt="preview-link"
            className="w-40 h-[90px] rounded-lg"
            src={previewData.image}
          />
        )}
      </div>
    </div>
  );
}

export default LinkPreview;
