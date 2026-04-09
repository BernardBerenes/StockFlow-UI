import api from './api';
import type { TransactionDetailListResponse, TransactionDetailFormData, TransactionDetail } from '@/types/transactionDetail';

export const listTransactionDetails = async (transactionUuid: string): Promise<TransactionDetailListResponse> => {
  const response = await api.get<TransactionDetailListResponse>(`/transaction-detail/list/${transactionUuid}`);
  return response.data;
};

export const createTransactionDetail = async (transactionUuid: string, data: TransactionDetailFormData) => {
  const response = await api.post(`/transaction-detail/create/${transactionUuid}`, data);
  return response.data;
};

export const updateTransactionDetail = async (uuid: string, data: TransactionDetailFormData) => {
  const response = await api.patch(`/transaction-detail/update/${uuid}`, data);
  return response.data;
};

export const deleteTransactionDetail = async (uuid: string) => {
  const response = await api.delete(`/transaction-detail/delete/${uuid}`);
  return response.data;
};
