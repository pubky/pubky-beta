'use client';

import { useQuery } from '@tanstack/react-query';
import { getFile } from '@/services/fileService';

export function useFile(fileUri: string) {
  return useQuery({
    queryKey: ['file', fileUri],
    queryFn: () => getFile(fileUri),
    retry: false
  });
}
