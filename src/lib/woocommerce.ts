import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { Product, ProductStatus, OrderStatus } from "@/lib/types";

const wooCommerceApiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
const wooCommerceConsumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const wooCommerceConsumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

if (!wooCommerceApiUrl || !wooCommerceConsumerKey || !wooCommerceConsumerSecret) {
    throw new Error("WooCommerce API credentials are not set. Please check your .env.local file and ensure they use the NEXT_PUBLIC_prefix.");
}

const api = new WooCommerceRestApi({
  url: wooCommerceApiUrl,
  consumerKey: wooCommerceConsumerKey,
  consumerSecret: wooCommerceConsumerSecret,
  version: "wc/v3",
  queryStringAuth: true,
});

type GetProductsParams = {
  page?: number;
  status?: ProductStatus;
  stock_status?: string;
  orderby?: string;
  order?: string;
  search?: string;
}

export async function getProducts({
  page = 1,
  status = 'all',
  stock_status,
  orderby,
  order,
  search
}: GetProductsParams = {}) {
  try {
    const params: any = {
      per_page: 20,
      page: page,
    };

    if (status && status !== 'all') {
      params.status = status;
    }

    if (stock_status) {
      params.stock_status = stock_status;
    }

    if (orderby) {
      params.orderby = orderby;
    }

    if (order) {
      params.order = order;
    }

    if (search) {
      params.search = search;
    }

    const response = await api.get("products", params);

    return {
      products: response.data,
      totalPages: Number(response.headers['x-wp-totalpages']),
      totalProducts: Number(response.headers['x-wp-total'])
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      totalPages: 0,
      totalProducts: 0
    };
  }
}

export async function getProductCounts() {
  try {
    const [published, draft] = await Promise.all([
      api.get("products", { status: 'publish', per_page: 1 }),
      api.get("products", { status: 'draft', per_page: 1 })
    ]);

    const publishedCount = Number(published.headers['x-wp-total']);
    const draftCount = Number(draft.headers['x-wp-total']);

    const response = await api.get("products");
    const allCount = Number(response.headers['x-wp-total']);


    return {
      all: allCount,
      published: publishedCount,
      draft: draftCount,
    };
  } catch (error) {
    console.error("Error fetching product counts:", error);
    return { all: 0, published: 0, draft: 0 };
  }
}


export async function getOrders(status: OrderStatus = 'any') {
    try {
      const params: { per_page: number; status?: OrderStatus } = {
          per_page: 100,
      };
      if (status && status !== 'any') {
        params.status = status;
      }
      const response = await api.get("orders", params);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  export async function getCustomers() {
    try {
      const response = await api.get("customers", {
        per_page: 100,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }
