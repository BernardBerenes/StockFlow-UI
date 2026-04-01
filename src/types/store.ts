export interface Store {
  uuid: string;
  name: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type StoreListResponse = ApiResponse<Store[]>;
