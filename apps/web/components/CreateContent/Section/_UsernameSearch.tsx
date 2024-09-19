'use client';

import { useUsernameSearch } from '@/hooks/useUser';
import { UserView } from '@/types/User';
import { useEffect } from 'react';

interface UsernameSearchProps {
    query: string;
    pubky: string;
    onResults: (results: UserView[]) => void;
}

const UsernameSearch = ({ query, pubky, onResults }: UsernameSearchProps) => {
    const { data } = useUsernameSearch(query, pubky, 0, 5);

    useEffect(() => {
        if (data) {
            onResults(data);
        }
    }, [data, onResults]);

    return null;
};

export default UsernameSearch;
