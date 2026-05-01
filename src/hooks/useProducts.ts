import { useState, useEffect, useCallback, useRef } from 'react';
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
  name: string;
  setName: (name: string) => void;
  refetch: () => void;
}

export const useProducts = (initialPage = 1, initialSize = 10): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [name, setNameState] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce name
  const setName = useCallback((value: string) => {
    setNameState(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedName(value);
      setPageState(1);
    }, 500);
  }, []);

  // When page is set externally, skip debounce reset
  const setPage = useCallback((p: number) => {
    setPageState(p);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listPaginateProduct(page, pageSize, debouncedName || undefined);
      setProducts(response.data);
      setMetadata(response.metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      setProducts([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedName]);

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
    name,
    setName,
    refetch: fetchProducts,
  };
};
