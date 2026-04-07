import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import Pagination from '@/components/Pagination';
import TransactionFormModal from '@/components/TransactionFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { createTransaction, updateTransaction, deleteTransaction } from '@/services/transactionService';
import type { TransactionHeader, TransactionFormData } from '@/types/transaction';

export default function TransactionPage() {
  const {
    transactions,
    metadata,
    loading,
    error,
    setPage,
    refetch,
  } = useTransactions();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHeader | null>(null);

  const handleAddNew = () => {
    setSelectedTransaction(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (transaction: TransactionHeader) => {
    setSelectedTransaction(transaction);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (transaction: TransactionHeader) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.uuid, data);
    } else {
      await createTransaction(data);
    }
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction.uuid);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage inbound and outbound transactions</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          New Transaction
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-violet-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Store</th>
                  <th className="px-6 py-4 whitespace-nowrap">Type</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                  <th className="px-6 py-4 whitespace-nowrap">Delivery</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.uuid} className="even:bg-slate-100 hover:bg-slate-200/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          ...{transaction.uuid.substring(24, 32)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {transaction.store?.name || 'Unknown Store'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                          transaction.type === 'IN' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 tabular-nums">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          transaction.payment_status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${transaction.payment_status === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          transaction.delivery_status === 'DELIVERED'
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                        }`}>
                          {transaction.delivery_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/transactions/${transaction.uuid}`}
                            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            Detail
                          </Link>
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(transaction)}
                            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 pb-4 mt-auto">
            {metadata && (
              <Pagination
                metadata={metadata}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTransaction}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemName={`Transaction ...${selectedTransaction?.uuid?.substring(24, 32)} (${selectedTransaction?.store?.name})`}
        itemType="Transaction"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
