import api from './api';
import type { TransactionListResponse, TransactionFormData } from '@/types/transaction';

export const listPaginateTransaction = async (page: number = 1, size: number = 10): Promise<TransactionListResponse> => {
  const response = await api.get<TransactionListResponse>('/transaction/list-paginate', {
    params: { page, size },
  });

  return response.data;
};

export const createTransaction = async (data: TransactionFormData) => {
  const response = await api.post('/transaction/create', data);
  return response.data;
};

export const updateTransaction = async (uuid: string, data: TransactionFormData) => {
  const response = await api.patch(`/transaction/update/${uuid}`, data);
  return response.data;
};

export const deleteTransaction = async (uuid: string) => {
  const response = await api.delete(`/transaction/delete/${uuid}`);
  return response.data;
};

