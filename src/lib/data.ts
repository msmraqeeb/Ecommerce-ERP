import type { Product, Order, Customer } from './types';

export const totalMetrics = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: 'DollarSign',
  },
  {
    title: 'Orders',
    value: '+2350',
    change: '+180.1% from last month',
    icon: 'Users',
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    icon: 'CreditCard',
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201 since last hour',
    icon: 'Activity',
  },
];

export const salesData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

export const recentSales = [
    {
      id: "1",
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "$1,999.00",
      avatar: {
        src: "https://picsum.photos/seed/1/40/40",
        fallback: "OM",
        hint: "woman face",
      },
    },
    {
      id: "2",
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "$39.00",
      avatar: {
        src: "https://picsum.photos/seed/2/40/40",
        fallback: "JL",
        hint: "man face",
      },
    },
    {
      id: "3",
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "$299.00",
      avatar: {
        src: "https://picsum.photos/seed/3/40/40",
        fallback: "IN",
        hint: "woman smiling",
      },
    },
    {
      id: "4",
      name: "William Kim",
      email: "will@email.com",
      amount: "$99.00",
      avatar: {
        src: "https://picsum.photos/seed/4/40/40",
        fallback: "WK",
        hint: "man portrait",
      },
    },
    {
      id: "5",
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "$39.00",
      avatar: {
        src: "https://picsum.photos/seed/5/40/40",
        fallback: "SD",
        hint: "woman profile",
      },
    },
  ];

export const products: Product[] = [
    { id: 'prod-001', name: 'Cute Teddy Bear', image: { src: 'https://picsum.photos/seed/101/40/40', hint: 'teddy bear' }, status: 'in-stock', price: 25.00, sales: 150, stock: 200 },
    { id: 'prod-002', name: 'Wooden Blocks Set', image: { src: 'https://picsum.photos/seed/102/40/40', hint: 'wood blocks' }, status: 'in-stock', price: 45.50, sales: 200, stock: 80 },
    { id: 'prod-003', name: 'Remote Control Car', image: { src: 'https://picsum.photos/seed/103/40/40', hint: 'toy car' }, status: 'low-stock', price: 89.99, sales: 80, stock: 15 },
    { id: 'prod-004', name: 'Princess Doll', image: { src: 'https://picsum.photos/seed/104/40/40', hint: 'doll' }, status: 'out-of-stock', price: 32.00, sales: 250, stock: 0 },
    { id: 'prod-005', name: 'Lego Spaceship', image: { src: 'https://picsum.photos/seed/105/40/40', hint: 'lego spaceship' }, status: 'in-stock', price: 120.00, sales: 50, stock: 50 },
    { id: 'prod-006', name: 'Art & Craft Kit', image: { src: 'https://picsum.photos/seed/106/40/40', hint: 'art craft' }, status: 'in-stock', price: 35.00, sales: 120, stock: 100 },
    { id: 'prod-007', name: 'Jigsaw Puzzle', image: { src: 'https://picsum.photos/seed/107/40/40', hint: 'puzzle' }, status: 'low-stock', price: 19.99, sales: 180, stock: 19 },
];

export const orders: Order[] = [
    { id: 'ORD-001', customerName: 'Liam Johnson', customerEmail: 'liam@example.com', date: '2023-10-23', status: 'Fulfilled', total: 250.00 },
    { id: 'ORD-002', customerName: 'Olivia Smith', customerEmail: 'olivia@example.com', date: '2023-10-24', status: 'Fulfilled', total: 150.00 },
    { id: 'ORD-003', customerName: 'Noah Williams', customerEmail: 'noah@example.com', date: '2023-10-25', status: 'Unfulfilled', total: 350.00 },
    { id: 'ORD-004', customerName: 'Emma Brown', customerEmail: 'emma@example.com', date: '2023-10-26', status: 'Fulfilled', total: 450.00 },
    { id: 'ORD-005', customerName: 'Ava Jones', customerEmail: 'ava@example.com', date: '2023-10-27', status: 'Refunded', total: 550.00 },
    { id: 'ORD-006', customerName: 'Lucas Garcia', customerEmail: 'lucas@example.com', date: '2023-10-28', status: 'Unfulfilled', total: 50.00 },
    { id: 'ORD-007', customerName: 'Sophia Miller', customerEmail: 'sophia@example.com', date: '2023-10-29', status: 'Fulfilled', total: 120.50 },
];

export const customers: Customer[] = [
    { id: 'cust-001', name: 'Liam Johnson', email: 'liam@example.com', totalSpent: 1250, orders: 5 },
    { id: 'cust-002', name: 'Olivia Smith', email: 'olivia@example.com', totalSpent: 850, orders: 3 },
    { id: 'cust-003', name: 'Noah Williams', email: 'noah@example.com', totalSpent: 2350, orders: 8 },
    { id: 'cust-004', name: 'Emma Brown', email: 'emma@example.com', totalSpent: 4500, orders: 12 },
    { id: 'cust-005', name: 'Ava Jones', email: 'ava@example.com', totalSpent: 550, orders: 2 },
    { id: 'cust-006', name: 'Lucas Garcia', email: 'lucas@example.com', totalSpent: 300, orders: 4 },
    { id: 'cust-007', name: 'Sophia Miller', email: 'sophia@example.com', totalSpent: 1720, orders: 6 },
];

export const exampleProductData = {
    "product_id": "KC12345",
    "name": "Super Soft Baby Onesie - Blue",
    "description": "A comfortable and cute onesie for your little one. Made from 100% organic cotton.",
    "price": "15.99",
    "currency": "USD",
    "stock_quantity": "75",
    "category": "Apparel",
    "images": [
        "https://kidsparadise.com.bd/images/KC12345-1.jpg",
        "https://kidsparadise.com.bd/images/KC12345-2.jpg"
    ],
    "attributes": {
        "color": "Blue",
        "size": "6-12 months",
        "material": "Organic Cotton"
    }
};

export const exampleErpData = {
    "sku": "KC12345",
    "productName": "Super Soft Baby Onesie",
    "details": "A comfy onesie for babies. 100% organic cotton.",
    "pricing": {
        "unitPrice": 15.99,
        "currency": "USD"
    },
    "inventory": {
        "onHand": 78
    },
    "productCategory": "Clothing",
    "variants": [
        { "color": "Blue", "size": "6-12m" }
    ]
};
