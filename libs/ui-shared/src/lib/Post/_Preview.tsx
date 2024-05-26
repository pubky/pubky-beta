'use client';

import { useState, useEffect } from 'react';

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
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4">
        <h3 className="text-lg font-bold">{previewData.title}</h3>
        <p>{previewData.description}</p>
      </div>
    </div>
  );
}

export default LinkPreview;
