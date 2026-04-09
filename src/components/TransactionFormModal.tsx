import { useState, useEffect } from 'react';
import type { TransactionFormData, TransactionHeader, TransactionType, PaymentStatus, DeliveryStatus } from '@/types/transaction';
import type { Store } from '@/types/store';
import { listStore } from '@/services/storeService';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  initialData?: TransactionHeader | null;
}

export default function TransactionFormModal({ isOpen, onClose, onSubmit, initialData }: TransactionFormModalProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [saving, setSaving] = useState(false);

  const [storeId, setStoreId] = useState('');
  const [type, setType] = useState<TransactionType>('IN');
  const [date, setDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('UNPAID');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('ON_DELIVERY');

  useEffect(() => {
    if (isOpen) {
      setLoadingStores(true);
      listStore().then(res => {
        setStores(res.data);
      }).catch(err => {
        console.error('Failed to fetch stores:', err);
      }).finally(() => setLoadingStores(false));

      if (initialData) {
        setStoreId(initialData.store.uuid);
        setType(initialData.type);
        setDate(initialData.date);
        setPaymentStatus(initialData.payment_status);
        setDeliveryStatus(initialData.delivery_status);
      } else {
        setStoreId('');
        setType('IN');
        setDate(new Date().toISOString().split('T')[0]);
        setPaymentStatus('UNPAID');
        setDeliveryStatus('ON_DELIVERY');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !type || !date || !paymentStatus || !deliveryStatus) return;

    setSaving(true);
    try {
      await onSubmit({
        store_id: storeId,
        type,
        date,
        payment_status: paymentStatus,
        delivery_status: deliveryStatus
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-6 space-y-4 flex-1">
            
            {/* Store */}
            <div>
              <label htmlFor="store_id" className="block text-sm font-medium text-slate-700 mb-1">
                Store Required
              </label>
              <select
                id="store_id"
                required
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                disabled={loadingStores}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              >
                <option value="" disabled>Select a store</option>
                {stores.map(store => (
                  <option key={store.uuid} value={store.uuid}>{store.name}</option>
                ))}
              </select>
            </div>

            {/* Type & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value="IN">Inbound (IN)</option>
                  <option value="OUT">Outbound (OUT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
            </div>

            {/* Payment & Delivery */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery</label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value="ON_DELIVERY">On Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-200 bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
