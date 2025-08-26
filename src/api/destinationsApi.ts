import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../lib/types';
import apiClient from '../lib/apiClient';

export const DestinationTypes = [
  'national park',
  'city',
  'waterfall',
  'cultural site',
  'historical site',
  'adventure spot',
  'mountain',
  'beach',
  'lake',
  'river',
] as const;

export type DestinationType = (typeof DestinationTypes)[number];

// Region
export const Regions = ['central', 'eastern', 'northern', 'western'] as const;

export type Region = (typeof Regions)[number];

export interface Destination {
  id: string;
  name: string;
  photoUrl: string;
  district: string;
  type: DestinationType;
  region: Region;
  createdAt: string;
}

export const destinationsQueryKey = 'destinationsQueryKey';

export const useDestinations = () => {
  return useQuery({
    queryKey: [destinationsQueryKey],
    queryFn: async () => {
      const apiResponse = (await apiClient.get<ApiResponse<Destination[]>>('/destinations')).data;
      const destinations = apiResponse.payload;
      return destinations;
    },
    initialData: [],
    refetchInterval: 10000,
  });
};

interface CreateDestinationMutationData {
  name: string;
  description: string;
  region: Region;
  district: string;
  type: DestinationType;
  photo: File;
}

export const useCreateDestinationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDestinationMutationData) => {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('description', payload.description);
      formData.append('region', payload.region);
      formData.append('district', payload.district);
      formData.append('type', payload.type);
      formData.append('photo', payload.photo);

      const apiResponse = (
        await apiClient.post<ApiResponse<Destination>>('/destinations', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;

      return apiResponse;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [destinationsQueryKey] });
    },
  });
};
