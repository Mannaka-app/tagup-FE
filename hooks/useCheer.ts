import { useQuery } from '@tanstack/react-query';
import { CheerResponse, getCheer } from '@/apis/cheer';

export const useCheers = () => {
  return useQuery<CheerResponse['cheerTalks']>({
    queryKey: ['cheers'],
    queryFn: () => getCheer().then((res) => res.cheerTalks),
  });
};
