'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface GitHubProps {
  url: string;
}

export const GitHub = ({ url }: GitHubProps) => {
  const [repoData, setRepoData] = useState<any>(null);
  const [ownerAvatar, setOwnerAvatar] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${url.split('github.com/')[1]}`
        );
        const data = await response.json();
        console.log('data', data);
        setRepoData(data);

        const avatarResponse = await fetch(data.owner.avatar_url);
        const avatarBlob = await avatarResponse.blob();
        const avatarUrl = URL.createObjectURL(avatarBlob);
        setOwnerAvatar(avatarUrl);

        const previewResponse = await fetch(
          `/api/preview?url=${encodeURIComponent(url)}`
        );
        const previewData = await previewResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(previewData, 'text/html');
        const image =
          doc
            .querySelector('meta[property="og:image"]')
            ?.getAttribute('content') || '';
        setPreviewImage(image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (url) {
      fetchRepoData();
    }
  }, [url]);

  if (!repoData) {
    return <div>Loading...</div>;
  }

  return (
    <a
      href={`https://github.com/${url.split('github.com/')[1]}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full max-w-[700px] p-4 border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden block"
    >
      <div className="flex items-center">
        <img
          src={ownerAvatar}
          alt="Owner Avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <Typography.Body variant="large-bold">
            {repoData.full_name}
          </Typography.Body>
          <Typography.Body variant="small" className="opacity-80">
            {repoData.description}
          </Typography.Body>
          <div className="flex gap-4">
            <div className="flex gap-1">
              {`⭐`}
              <Typography.Body variant="small">
                {repoData.stargazers_count}
              </Typography.Body>
            </div>
            <div className="flex gap-1">
              <div className="flex items-center">
                <Icon.GitFork size="16" />
              </div>
              <Typography.Body variant="small">
                {repoData.forks_count}
              </Typography.Body>
            </div>
            <div className="flex gap-1">
              <div className="flex items-center">
                <Icon.Eye size="16" />
              </div>
              <Typography.Body variant="small">
                {repoData.subscribers_count}
              </Typography.Body>
            </div>
          </div>
        </div>
      </div>
      {previewImage && (
        <div className="mt-4">
          <img
            src={previewImage}
            alt="Preview"
            className="rounded-lg max-h-[350px]"
          />
        </div>
      )}
    </a>
  );
};
