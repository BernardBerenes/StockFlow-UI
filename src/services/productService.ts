import api from './api';
import type { ProductListResponse, ApiResponse, Product } from '@/types/product';

export const listPaginateProduct = async (page: number = 1, size: number = 10): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>('/product/list-paginate', {
    params: { page, size },
  });

  return response.data;
};

export const createProduct = async (formData: FormData): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const updateProduct = async (uuid: string, formData: FormData): Promise<ApiResponse<Product>> => {
  const response = await api.patch<ApiResponse<Product>>(`/product/update/${uuid}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const deleteProduct = async (uuid: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/product/delete/${uuid}`);

  return response.data;
};

