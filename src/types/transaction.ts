import type { PaginatedApiResponse } from './product'; // Reuse PaginatedApiResponse

export type TransactionType = 'IN' | 'OUT';
export type PaymentStatus = 'PAID' | 'UNPAID';
export type DeliveryStatus = 'ON_DELIVERY' | 'DELIVERED';

export interface TransactionStore {
  uuid: string;
  name: string;
}

export interface TransactionHeader {
  uuid: string;
  store: TransactionStore;
  type: TransactionType;
  date: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
}

export type TransactionListResponse = PaginatedApiResponse<TransactionHeader>;

export interface TransactionFormData {
  store_id: string;
  type: TransactionType;
  date: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
}

