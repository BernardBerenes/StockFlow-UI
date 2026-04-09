import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransactionDetails } from '@/hooks/useTransactionDetails';
import { createTransactionDetail, updateTransactionDetail, deleteTransactionDetail } from '@/services/transactionDetailService';
import TransactionDetailFormModal from '@/components/TransactionDetailFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { TransactionDetail, TransactionDetailFormData } from '@/types/transactionDetail';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { details, loading, error, refetch } = useTransactionDetails(id);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TransactionDetail | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingDetail, setDeletingDetail] = useState<TransactionDetail | null>(null);

  const handleOpenCreate = () => {
    setEditingDetail(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (detail: TransactionDetail) => {
    setEditingDetail(detail);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (detail: TransactionDetail) => {
    setDeletingDetail(detail);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: TransactionDetailFormData) => {
    if (editingDetail) {
      await updateTransactionDetail(editingDetail.uuid, formData);
    } else if (id) {
      await createTransactionDetail(id, formData);
    }
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (deletingDetail) {
      await deleteTransactionDetail(deletingDetail.uuid);
      refetch();
    }
  };

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/transactions"
            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transaction Detail</h1>
            <p className="text-sm text-slate-500 mt-1 font-mono">{id}</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-violet-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-red-500">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-red-800 mb-1">Failed to load transaction details</h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : details?.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Transaction header not found</h3>
          <p className="text-sm text-slate-500 mb-6">Get started by adding your first transaction detail</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Item
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {details.map((detail) => (
            <div key={detail.uuid} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:border-slate-300 transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {detail.product.photo ? (
                    <img src={detail.product.photo} alt={detail.product.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg flex-shrink-0">
                      {detail.product.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{detail.product.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">...{detail.product.uuid.substring(24, 36)}</p>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Qty</p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {detail.quantity} {detail.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="text-sm font-medium text-slate-700 tabular-nums">{formatRupiah(detail.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Subtotal</p>
                    <p className="text-sm font-semibold text-indigo-600 tabular-nums">{formatRupiah(detail.quantity * detail.price)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={() => handleOpenEdit(detail)}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDelete(detail)}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionDetailFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingDetail}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        itemName={`Detail for ${deletingDetail?.product?.name}`}
        itemType="Transaction Detail"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
