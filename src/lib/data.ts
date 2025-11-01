// This file is no longer used for the dashboard page, 
// but is kept for reference or other potential uses.

export const totalMetrics = [
  {
    title: 'Total Revenue',
    value: '৳45,231.89',
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
      amount: "৳1,999.00",
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
      amount: "৳39.00",
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
      amount: "৳299.00",
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
      amount: "৳99.00",
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
      amount: "৳39.00",
      avatar: {
        src: "https://picsum.photos/seed/5/40/40",
        fallback: "SD",
        hint: "woman profile",
      },
    },
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
