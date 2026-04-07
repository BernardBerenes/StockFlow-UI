import { useState, useEffect, useCallback } from 'react';
import type { TransactionHeader } from '@/types/transaction';
import type { PaginationMetadata } from '@/types/product';
import { listPaginateTransaction } from '@/services/transactionService';

interface UseTransactionsReturn {
  transactions: TransactionHeader[];
  metadata: PaginationMetadata | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  refetch: () => void;
}

export const useTransactions = (initialPage = 1, initialSize = 10): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<TransactionHeader[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listPaginateTransaction(page, pageSize);
      setTransactions(response.data);
      setMetadata(response.metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(message);
      setTransactions([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    metadata,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchTransactions,
  };
};
