import { useState, useEffect, useCallback } from 'react';
import type { TransactionDetail } from '@/types/transactionDetail';
import { listTransactionDetails } from '@/services/transactionDetailService';

interface UseTransactionDetailsReturn {
  details: TransactionDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTransactionDetails = (transactionUuid: string | undefined): UseTransactionDetailsReturn => {
  const [details, setDetails] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!transactionUuid) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await listTransactionDetails(transactionUuid);
      setDetails(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transaction details';
      setError(message);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  }, [transactionUuid]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    details,
    loading,
    error,
    refetch: fetchDetails,
  };
};
