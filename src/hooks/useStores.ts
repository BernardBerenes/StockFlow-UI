import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Store } from '@/types/store';
import { listStore } from '@/services/storeService';

interface UseStoresReturn {
  stores: Store[];
  loading: boolean;
  error: string | null;
  name: string;
  setName: (name: string) => void;
  refetch: () => void;
}

export const useStores = (): UseStoresReturn => {
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setNameState] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setName = useCallback((value: string) => {
    setNameState(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedName(value);
    }, 500);
  }, []);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listStore();
      setAllStores(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stores';
      setError(message);
      setAllStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Filter client-side based on debounced name
  const stores = useMemo(() => {
    if (!debouncedName.trim()) return allStores;
    return allStores.filter((s) =>
      s.name.toLowerCase().includes(debouncedName.toLowerCase())
    );
  }, [allStores, debouncedName]);

  return {
    stores,
    loading,
    error,
    name,
    setName,
    refetch: fetchStores,
  };
};
