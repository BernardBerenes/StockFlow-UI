export interface Product {
  uuid: string;
  name: string;
  photo: string | null;
}

export interface PaginationMetadata {
  page: number;
  size: number;
  total: number;
  total_page: number;
}

export interface ProductListData {
  data: Product[];
  metadata: PaginationMetadata;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type ProductListResponse = ApiResponse<ProductListData>;
