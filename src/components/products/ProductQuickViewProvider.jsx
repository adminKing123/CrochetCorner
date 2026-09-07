"use client";

import { createContext, useContext, useMemo, useState } from "react";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";

const ProductQuickViewContext = createContext(null);

export function ProductQuickViewProvider({ children }) {
  const [productId, setProductId] = useState(null);

  const value = useMemo(
    () => ({
      openQuickView: (id) => setProductId(id),
      closeQuickView: () => setProductId(null),
    }),
    []
  );

  return (
    <ProductQuickViewContext.Provider value={value}>
      {children}
      <ProductQuickViewModal productId={productId} onClose={() => setProductId(null)} />
    </ProductQuickViewContext.Provider>
  );
}

export function useProductQuickView() {
  return useContext(ProductQuickViewContext);
}
