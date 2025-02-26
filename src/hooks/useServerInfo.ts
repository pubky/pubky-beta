'use client';

import { useQuery } from '@tanstack/react-query';
import { getServerInfo } from '../services/serverInfoService';

export function useServerInfo() {
  return useQuery({
    queryKey: ['serverInfo'],
    queryFn: getServerInfo,
    retry: false
  });
}
