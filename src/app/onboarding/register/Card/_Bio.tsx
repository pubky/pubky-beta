'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { searchUsersById, searchUsersByName } from '@/services/streamService';
import { getUserProfile } from '@/services/userService';
import { usePubkyClientContext } from '@/contexts';
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
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  errors: Errors;
}

export default function Bio({ bio, setBio, name, setName, errors }: BioProps) {
  const { pubky } = usePubkyClientContext();
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleUserClick = (userId: string) => {
    // Find the last @ or pk: pattern in the text and replace it
    const atRegex = /@[^\s]*$/;
    const pkRegex = /pk:[^\s]*$/;

    let newContent = bio;

    // Check if there's a pk: pattern at the end of the text
    if (pkRegex.test(bio)) {
      newContent = bio.replace(pkRegex, `pk:${userId}`);
    }
    // Check if there's an @ pattern at the end of the text
    else if (atRegex.test(bio)) {
      newContent = bio.replace(atRegex, `pk:${userId}`);
    }
    // If no pattern found, just append the pk:userId
    else {
      newContent = bio + ` pk:${userId}`;
    }

    setBio(newContent);
    setSearchedUsers([]);
  };

  const searchUsername = async (content: string) => {
    const pkMatches = content.match(/(pk:[^\s]+)/g);
    const atMatches = content.match(/(@[^\s]+)/g);

    const searchQueries = [...(pkMatches || []), ...(atMatches || [])];

    if (searchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    // Filter out complete pubkeys and partial matches that are too short
    const filteredQueries = searchQueries.filter((query) => {
      if (query.startsWith('pk:')) {
        const userId = query.slice(3);
        const isCompletePubkey = userId.length >= 52 && /^[a-zA-Z0-9]+$/.test(userId);
        const shouldSkip = isCompletePubkey || userId.length < 3;
        return !shouldSkip;
      }
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const shouldSkip = username.length < 2;
        return !shouldSkip;
      }
      return false;
    });

    if (filteredQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let allUserIds: string[] = [];

    for (const query of filteredQueries) {
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const searchResult = await searchUsersByName(username);
        allUserIds = [...allUserIds, ...(searchResult || [])];
      } else if (query.startsWith('pk:')) {
        const userId = query.slice(3); // Remove 'pk:' prefix
        const searchResult = await searchUsersById(userId);
        allUserIds = [...allUserIds, ...(searchResult || [])];
      }
    }

    // Remove duplicates
    const uniqueUserIds = Array.from(new Set(allUserIds));

    if (uniqueUserIds.length > 0) {
      // Fetch user profiles for each unique user ID
      const userProfiles = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            return await getUserProfile(userId, pubky ?? '');
          } catch (error) {
            return null;
          }
        })
      );

      // Filter out null results and set the searched users
      const validUsers = userProfiles.filter((user): user is UserView => user !== null);
      setSearchedUsers(validUsers);
    } else {
      setSearchedUsers([]);
    }
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
      <div className="flex flex-col gap-4">
        <div>
          <Input.Label value="Name" />
          <Input.Text
            placeholder="Your name"
            id="onboarding-name-input"
            defaultValue={name}
            maxLength={30}
            autoFocus
            autoCorrect="off"
            error={errors.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </div>
        <div>
          <Input.Label value="Short bio" />
          <Card.Primary
            background="bg-transparent"
            className="relative border border-white border-opacity-30 border-dashed mt-2"
          >
            <Input.TextArea
              placeholder="Short bio. Tell a bit about yourself."
              className="h-[70px]"
              id="onboarding-bio-input"
              value={bio ? bio : ''}
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
              <Modal.SearchedUsersCard
                className="top-56"
                handleUserClick={handleUserClick}
                searchedUsers={searchedUsers}
              />
            )}
          </Card.Primary>
        </div>
      </div>
    </Card.Primary>
  );
}
