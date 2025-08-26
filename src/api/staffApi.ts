import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse, MutationArgs } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface StaffRole {
  id: string;
  name: string;
  createdAt: string;
}

export const staffRolesQueryKey = 'staffRolesQueryKey';

export const useStaffRole = () => {
  return useQuery({
    queryKey: [staffRolesQueryKey],
    queryFn: async () => {
      const apiResponse = (await apiClient.get<ApiResponse<Staff[]>>('/staff/roles')).data;
      const staffRoles = apiResponse.payload;
      return staffRoles;
    },
    initialData: [],
    refetchInterval: 10000,
  });
};

interface CreateStaffRoleMutationData {
  name: string;
  permissions: string[];
}

export const useCreateStaffRoleMutation = ({ onError, onSuccess }: MutationArgs) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffRoleMutationData) => {
      const apiResponse = (await apiClient.post<ApiResponse<StaffRole>>('/staff/roles', payload)).data;
      return apiResponse;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [staffRolesQueryKey] });
    },
    onError: (error) => {
      onError(error.message);
    },
    onSuccess: (data) => {
      onSuccess(data.message);
    },
  });
};

export interface Staff {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber: string;
  photoUrl: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
}

export const staffMembersQueryKey = 'staffMembersQueryKey';

export const useStaffMembers = () => {
  return useQuery({
    queryKey: [staffMembersQueryKey],
    queryFn: async () => {
      const apiResponse = (await apiClient.get<ApiResponse<Staff[]>>('/staff')).data;
      const staff = apiResponse.payload;
      return staff;
    },
    initialData: [],
    refetchInterval: 10000,
  });
};

interface CreateStaffMemberMutationData {
  name: string;
  phoneNumber: string;
  password: string;
  roleId: string;
  photo: File;
}

export const useCreateStaffMemberMutation = ({ onError, onSuccess }: MutationArgs) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffMemberMutationData) => {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('phoneNumber', payload.phoneNumber);
      formData.append('password', payload.password);
      formData.append('roleId', payload.roleId);
      formData.append('photo', payload.photo);

      const apiResponse = (
        await apiClient.post<ApiResponse<Staff>>('/staff', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;
      return apiResponse;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [staffMembersQueryKey] });
    },
    onError: (error) => {
      console.log(error);
      onError(error.message);
    },
    onSuccess: (data) => {
      onSuccess(data.message);
    },
  });
};
