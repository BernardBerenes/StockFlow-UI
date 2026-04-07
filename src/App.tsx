import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductPage from '@/pages/ProductPage';
import StorePage from '@/pages/StorePage';
import TransactionPage from '@/pages/TransactionPage';
import TransactionDetailPage from '@/pages/TransactionDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/stores" element={<StorePage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
