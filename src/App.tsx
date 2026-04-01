import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductPage from '@/pages/ProductPage';
import StorePage from '@/pages/StorePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/stores" element={<StorePage />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
