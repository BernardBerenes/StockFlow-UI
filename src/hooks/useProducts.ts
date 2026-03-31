import { useState, useEffect, useCallback } from 'react';
import type { Product, PaginationMetadata } from '@/types/product';
import { listPaginateProduct } from '@/services/productService';

interface UseProductsReturn {
  products: Product[];
  metadata: PaginationMetadata | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  refetch: () => void;
}

export const useProducts = (initialPage = 1, initialSize = 10): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listPaginateProduct(page, pageSize);
      setProducts(response.data.data);
      setMetadata(response.data.metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      setProducts([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    metadata,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchProducts,
  };
};
