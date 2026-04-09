import { useState, useEffect } from 'react';
import type { TransactionDetailFormData, TransactionDetail, TransactionDetailUnit } from '@/types/transactionDetail';
import type { Product } from '@/types/product';
import { listPaginateProduct } from '@/services/productService';

interface TransactionDetailFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionDetailFormData) => Promise<void>;
  initialData?: TransactionDetail | null;
}

export default function TransactionDetailFormModal({ isOpen, onClose, onSubmit, initialData }: TransactionDetailFormModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<TransactionDetailUnit>('PIECE');
  const [price, setPrice] = useState(0);
  const [priceDisplay, setPriceDisplay] = useState('');

  const formatNumber = (num: number): string => {
    return num.toLocaleString('id-ID');
  };

  const handlePriceChange = (value: string) => {
    const raw = value.replace(/\./g, '');
    const num = parseInt(raw, 10);
    if (isNaN(num)) {
      setPrice(0);
      setPriceDisplay('');
    } else {
      setPrice(num);
      setPriceDisplay(formatNumber(num));
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoadingProducts(true);
      // Fetch up to 100 products for the dropdown
      listPaginateProduct(1, 100).then(res => {
        setProducts(res.data);
      }).catch(err => {
        console.error('Failed to fetch products:', err);
      }).finally(() => setLoadingProducts(false));

      if (initialData) {
        setProductId(initialData.product.uuid);
        setQuantity(initialData.quantity);
        setUnit(initialData.unit);
        setPrice(initialData.price);
        setPriceDisplay(formatNumber(initialData.price));
      } else {
        setProductId('');
        setQuantity(1);
        setUnit('PIECE');
        setPrice(0);
        setPriceDisplay('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0 || price < 0) return;

    setSaving(true);
    try {
      await onSubmit({
        product_id: productId,
        quantity,
        unit,
        price
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
            {initialData ? 'Edit Detail' : 'Add Detail'}
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
            
            {/* Product */}
            <div>
              <label htmlFor="product_id" className="block text-sm font-medium text-slate-700 mb-1">
                Product <span className="text-red-500">*</span>
              </label>
              <select
                id="product_id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                disabled={loadingProducts}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              >
                <option value="" disabled>Select a product</option>
                {products.map(product => (
                  <option key={product.uuid} value={product.uuid}>{product.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <select
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as TransactionDetailUnit)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value="PIECE">Piece</option>
                  <option value="DOZEN">Dozen</option>
                  <option value="BOX">Box</option>
                  <option value="CARTON">Carton</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={priceDisplay}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                />
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
