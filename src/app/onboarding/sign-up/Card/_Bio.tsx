'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { searchUsersByUsername } from '@/services/streamService';
import { UserView } from '@/types/User';
import { Card, Input } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

interface Errors {
  name: string;
  bio: string;
}

interface BioProps {
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  errors: Errors;
  loading?: boolean;
}

export default function Bio({ bio, setBio, errors, loading }: BioProps) {
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = bio.replace(regex, `pk:${userId}`);
    console.log('newContent', newContent);

    setBio(newContent);
    setSearchedUsers([]);
  };

  const searchProfiles = async (text: string) => {
    try {
      const result = await searchUsersByUsername(text);
      return result || [];
    } catch (error) {
      // console.error('Error searching profiles:', error);
      return [];
    }
  };

  const searchUsername = async (content: string) => {
    const pkMatches = content.match(/(pk:[^\s]+)/g);
    const atMatches = content.match(/(@[^\s]+)/g);

    const searchQueries = [...(pkMatches || []), ...(atMatches || [])];

    if (searchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let results: UserView[] = [];

    for (const query of searchQueries) {
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const searchResult = await searchUsersByUsername(username);
        results = [...results, ...(searchResult || [])];
      } else if (query.startsWith('pk:')) {
        const searchResult = await searchProfiles(query);
        results = [...results, ...(searchResult || [])];
      }
    }
    setSearchedUsers(results.length > 0 ? results : []);
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchUsername(bio);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bio]);

  return (
    <Card.Primary className="justify-start gap-4 w-full col-span-3" title="Profile">
      <div>
        <Input.Label value="Short bio" />
        <Card.Primary background="bg-transparent" className="border border-white border-opacity-30 border-dashed mt-2">
          <Input.TextArea
            placeholder="Short bio. Tell a bit about yourself."
            className="h-[180px]"
            id="onboarding-bio-input"
            value={bio ? bio : ''}
            disabled={loading}
            maxLength={160}
            error={errors.bio}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              if (Utils.isValidContent(target.value)) {
                const cleanedBio = Utils.cleanText(target.value);
                setBio(cleanedBio);
              } else {
                setBio('');
              }
            }}
          />
          {searchedUsers.length > 0 && (
            <Modal.SearchedUsersCard handleUserClick={handleUserClick} searchedUsers={searchedUsers} />
          )}
        </Card.Primary>
      </div>
    </Card.Primary>
  );
}
