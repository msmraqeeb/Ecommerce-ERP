import React from 'react';
import type { ProductStatus } from '@/lib/types';
import { getProducts, getProductCounts } from '@/lib/woocommerce';
import { ProductsPageContent } from './products-client-page';
import { getSession } from '@/lib/auth';

type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export default async function ProductsPage({
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
  const session = await getSession();
  const isAdmin = session?.user?.role === 'admin';
  return (
    <React.Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductsDataFetcher searchParams={searchParams} isAdmin={isAdmin} />
    </React.Suspense>
  );
}

async function ProductsDataFetcher({
  searchParams,
  isAdmin
}: {
  searchParams?: {
    page?: string;
    status?: ProductStatus;
    stock_status?: StockStatus;
    orderby?: 'price';
    order?: 'asc' | 'desc';
    search?: string;
  };
  isAdmin: boolean;
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
      isAdmin={isAdmin}
    />
  );
}
