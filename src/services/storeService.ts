import api from './api';
import type { StoreListResponse, ApiResponse, Store } from '@/types/store';

export const listStore = async (): Promise<StoreListResponse> => {
  const response = await api.get<StoreListResponse>('/store/list');

  return response.data;
};

export const createStore = async (data: { name: string }): Promise<ApiResponse<Store>> => {
  const response = await api.post<ApiResponse<Store>>('/store/create', data);

  return response.data;
};

export const updateStore = async (uuid: string, data: { name: string }): Promise<ApiResponse<Store>> => {
  const response = await api.patch<ApiResponse<Store>>(`/store/update/${uuid}`, data);

  return response.data;
};

export const deleteStore = async (uuid: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/store/delete/${uuid}`);

  return response.data;
};
