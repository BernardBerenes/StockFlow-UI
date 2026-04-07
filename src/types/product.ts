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

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  message: string;
  data: T[];
  metadata: PaginationMetadata;
}

export type ProductListResponse = PaginatedApiResponse<Product>;
