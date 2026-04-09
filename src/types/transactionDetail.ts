export type TransactionDetailUnit = 'PIECE' | 'DOZEN' | 'BOX' | 'CARTON';

export interface TransactionDetailProduct {
  uuid: string;
  name: string;
  photo: string | null;
}

export interface TransactionDetail {
  uuid: string;
  product: TransactionDetailProduct;
  quantity: number;
  unit: TransactionDetailUnit;
  price: number;
}

export interface TransactionDetailListResponse {
  message: string;
  data: TransactionDetail[];
}

export interface TransactionDetailFormData {
  product_id: string;
  quantity: number;
  unit: TransactionDetailUnit;
  price: number;
}
