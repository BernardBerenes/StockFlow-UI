import { useState, useEffect, useCallback } from 'react';
import type { Store } from '@/types/store';
import { listStore } from '@/services/storeService';

interface UseStoresReturn {
  stores: Store[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStores = (): UseStoresReturn => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listStore();
      setStores(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stores';
      setError(message);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    loading,
    error,
    refetch: fetchStores,
  };
};
