import React from 'react';
import type { ProductStatus } from '@/lib/types';
import { getProducts, getProductCounts } from '@/lib/woocommerce';
import { ProductsPageContent } from './products-client-page';

type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    status?: ProductStatus;
    stock_status?: StockStatus;
    orderby?: 'price';
    order?: 'asc' | 'desc';
    search?: string;
  };
}) {
  return (
    <React.Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductsDataFetcher searchParams={searchParams} />
    </React.Suspense>
  );
}

async function ProductsDataFetcher({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    status?: ProductStatus;
    stock_status?: StockStatus;
    orderby?: 'price';
    order?: 'asc' | 'desc';
    search?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const currentStatus = searchParams?.status || 'all';
  const stockStatus = searchParams?.stock_status;
  const orderby = searchParams?.orderby;
  const order = searchParams?.order;
  const search = searchParams?.search || '';

  const { products, totalPages, totalProducts } = await getProducts({
    page: currentPage,
    status: currentStatus,
    stock_status: stockStatus,
    orderby: orderby,
    order: order,
    search: search,
  });
  const counts = await getProductCounts();

  return (
    <ProductsPageContent
      products={products}
      totalPages={totalPages}
      totalProducts={totalProducts}
      counts={counts}
    />
  );
}
