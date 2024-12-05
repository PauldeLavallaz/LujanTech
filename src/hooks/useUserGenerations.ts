import useSWR from 'swr';
import { Generation } from '@/types/generation';

export function useUserGenerations(deploymentId?: string) {
  const { data, error, mutate } = useSWR<{ generations: Generation[] }>(
    `/api/generations${deploymentId ? `?deploymentId=${deploymentId}` : ''}`,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch generations');
      return response.json();
    }
  );

  return {
    generations: data?.generations || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
} 