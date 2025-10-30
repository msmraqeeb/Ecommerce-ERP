export type Product = {
  id: string;
  name: string;
  image: {
    src: string;
    hint: string;
  };
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  price: number;
  sales: number;
  stock: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Fulfilled' | 'Unfulfilled' | 'Refunded';
  total: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
};
