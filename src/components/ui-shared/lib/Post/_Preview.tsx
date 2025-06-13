'use client';

import { useState, useEffect } from 'react';
import { Typography } from '../Typography';

interface PreviewData {
  title: string;
  description: string;
  image: string | null;
}

function LinkPreview({ url }: { url: string }) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    const decoded = textarea.value;
    // Decode both named and numeric HTML entities and strip HTML tags
    return decoded
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  };

  const isValidImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
          console.error('Error fetching preview:', data.error);
          setPreviewData(null);
          return;
        }

        const validImage = data.image ? await isValidImage(data.image) : false;

        const preview = {
          title: data.title ? decodeHtmlEntities(data.title) : '',
          description: data.description ? decodeHtmlEntities(data.description) : '',
          image: validImage ? data.image : null
        };

        if (preview.title || preview.description || preview.image) {
          setPreviewData(preview);
        } else {
          setPreviewData(null);
        }
      } catch (error) {
        console.error(error);
        setPreviewData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) return <p>Loading...</p>;
  if (!previewData) return null;

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-full mb-6">
      <div
        onClick={handleClick}
        className="cursor-pointer w-full mt-4 p-6 bg-white bg-opacity-10 border border-transparent hover:border-white hover:border-opacity-30 rounded-xl justify-between gap-6 items-start flex flex-col lg:flex-row"
      >
        <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
          {previewData.title && (
            <Typography.H2 className="break-words">
              {previewData.title.length > 82 ? previewData.title.slice(0, 82) + '...' : previewData.title}
            </Typography.H2>
          )}
          {previewData.description ? (
            <Typography.Body variant="small" className="break-words text-opacity-80 leading-5">
              {previewData.description.length > 150
                ? previewData.description.slice(0, 150) + '...'
                : previewData.description}
            </Typography.Body>
          ) : (
            <Typography.Body variant="small" className="break-words text-opacity-80 leading-5">
              {url.length > 60 ? url.slice(0, 60) + '...' : url}
            </Typography.Body>
          )}
        </div>
        {previewData.image && (
          <img
            alt="preview-link"
            className="w-auto max-h-[200px] lg:max-w-40 lg:max-h-[90px] rounded-lg"
            src={previewData.image}
          />
        )}
      </div>
    </div>
  );
}

export default LinkPreview;
