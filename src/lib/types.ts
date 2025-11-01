export type ProductStatus = 'all' | 'publish' | 'draft' | 'pending' | 'private' | 'any';

export type Product = {
  id: number;
  name: string;
  sku: string;
  images: {
    src: string;
  }[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  status: 'publish' | 'draft' | 'pending' | 'private';
  price: string;
  total_sales: number;
  stock_quantity: number;
};

export type OrderStatus = 'any' | 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';

export type Order = {
  id: number;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
  };
  date_created: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
  total: string;
};

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_spent: string;
  orders_count: number;
};
