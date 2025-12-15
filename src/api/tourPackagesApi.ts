import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface TourPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerPersonUgx: number;
  pricePerPersonUsd: number;
  primaryPhotoUrl: string;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TourPackageItineraryItem {
  name: string;
  description: string;
}

export const tourPackagesQueryKey = 'tourPackagesQueryKey';

export const useTourPackages = () => {
  return useQuery({
    queryKey: [tourPackagesQueryKey],
    queryFn: async () => {
      const apiResponse = (await apiClient.get<ApiResponse<TourPackage[]>>('/tour-packages')).data;
      const tourPackages = apiResponse.payload;
      return tourPackages;
    },
    initialData: [],
    refetchInterval: 10000,
  });
};

interface CreateTourPackageMutationData {
  name: string;
  description: string;
  pricePerPersonUgx: number;
  pricePerPersonUsd: number;
  photo: File;
  photos: File[];
  itinerary: TourPackageItineraryItem[];
}

export const useCreateTourPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTourPackageMutationData) => {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('description', payload.description);
      formData.append('pricePerPersonUgx', payload.pricePerPersonUgx.toString());
      formData.append('pricePerPersonUsd', payload.pricePerPersonUsd.toString());
      formData.append('itinerary', JSON.stringify(payload.itinerary));
      formData.append('photo', payload.photo);

      for (const photo of payload.photos) {
        formData.append('photos', photo);
      }

      const apiResponse = (
        await apiClient.post<ApiResponse<TourPackage>>('/tour-packages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;

      return apiResponse;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tourPackagesQueryKey] });
    },
  });
};

