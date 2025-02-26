'use client';

import { useEffect, useState } from 'react';
import { Typography } from '../Typography';
import { Icon } from '../Icon';
import Link from 'next/link';

interface GitHubProps {
  url: string;
}

type RepoData = {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  owner: {
    avatar_url: string;
  };
};

export const GitHub = ({ url }: GitHubProps) => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [ownerAvatar, setOwnerAvatar] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const repoPath = url.split('github.com/')[1].split('/')[0] + '/' + url.split('github.com/')[1].split('/')[1];

        const response = await fetch(`https://api.github.com/repos/${repoPath}`);

        if (!response.ok) {
          throw new Error('Failed to fetch repository data');
        }

        const data = await response.json();
        setRepoData(data);

        const avatarResponse = await fetch(data.owner.avatar_url);
        if (!avatarResponse.ok) {
          throw new Error('Failed to fetch avatar');
        }

        const avatarBlob = await avatarResponse.blob();
        const avatarUrl = URL.createObjectURL(avatarBlob);
        setOwnerAvatar(avatarUrl);

        const previewResponse = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);

        if (!previewResponse.ok) {
          throw new Error('Failed to fetch preview image');
        }

        const previewData = await previewResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(previewData, 'text/html');
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        setPreviewImage(image);
        setLoading(false);
      } catch (error) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    if (url) {
      fetchRepoData();
    }
  }, [url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !repoData) {
    return null;
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full p-4 border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden block"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center">
          <img src={ownerAvatar} alt="Owner Avatar" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <Typography.Body variant="large-bold">
              {repoData.full_name && repoData.full_name.length > 40
                ? repoData.full_name.slice(0, 40) + '...'
                : repoData.full_name}
            </Typography.Body>
            <Typography.Body variant="small" className="opacity-80">
              {repoData.description && repoData.description.length > 150
                ? repoData.description.slice(0, 150) + '...'
                : repoData.description}
            </Typography.Body>
            <div className="flex gap-4">
              <div className="flex gap-1">
                <span className="text-[15px]" role="img" aria-label="star">
                  ⭐
                </span>
                <Typography.Body variant="small">{repoData.stargazers_count}</Typography.Body>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center">
                  <Icon.GitFork size="15" />
                </div>
                <Typography.Body variant="small">{repoData.forks_count}</Typography.Body>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center">
                  <Icon.Eye size="15" />
                </div>
                <Typography.Body variant="small">{repoData.subscribers_count}</Typography.Body>
              </div>
            </div>
          </div>
        </div>
        {previewImage && (
          <div>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full md:w-auto md:max-w-40 h-auto max-h-[744px] md:max-h-[120px] rounded-lg"
            />
          </div>
        )}
      </div>
    </Link>
  );
};
