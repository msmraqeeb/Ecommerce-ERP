import 'dotenv/config';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { Product, ProductStatus, OrderStatus, Customer, Order } from "@/lib/types";

const wooCommerceApiUrl = process.env.WOOCOMMERCE_API_URL;
const wooCommerceConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const wooCommerceConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!wooCommerceApiUrl || !wooCommerceConsumerKey || !wooCommerceConsumerSecret) {
    throw new Error("WooCommerce API credentials are not set. Please check your environment variables.");
}

export const api = new WooCommerceRestApi({
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

export async function getProductBySKU(sku: string): Promise<Product[]> {
    if (!sku) return [];
    try {
        const response = await api.get("products", { sku: sku, per_page: 100 });
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with SKU ${sku}:`, error);
        return [];
    }
}

export async function getProducts({
  page = 1,
  status,
  stock_status,
  orderby,
  order,
  search
}: GetProductsParams = {}) {
  try {
    const params: any = {
      per_page: 20,
      page,
      status: 'any',
    };

    if (status && status !== 'all' && status !== 'any') {
      params.status = status;
    }
    
    if (stock_status) params.stock_status = stock_status;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    
    // If there's a search term, first try to find an exact SKU match.
    if (search) {
      const skuResults = await getProductBySKU(search);
      if (skuResults.length > 0) {
        return {
          products: skuResults,
          totalPages: 1,
          totalProducts: skuResults.length,
        };
      }
      // If no SKU match, fall back to a general search.
      params.search = search;
    }

    const response = await api.get("products", params);

    return {
      products: response.data,
      totalPages: Number(response.headers['x-wp-totalpages']),
      totalProducts: Number(response.headers['x-wp-total']),
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
    // Fetching all products with status 'any' to get the total count.
    const allResponse = await api.get("products", { status: 'any', per_page: 1 });
    const allCount = Number(allResponse.headers['x-wp-total']);

    // Fetching published products count.
    const publishedResponse = await api.get("products", { status: 'publish', per_page: 1 });
    const publishedCount = Number(publishedResponse.headers['x-wp-total']);

    // Fetching draft products count.
    const draftResponse = await api.get("products", { status: 'draft', per_page: 1 });
    const draftCount = Number(draftResponse.headers['x-wp-total']);

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


export async function getOrders(status: OrderStatus = 'any', dateRange?: { after?: string, before?: string }) {
    try {
      const params: any = {
          per_page: 100,
      };
      if (status && status !== 'any') {
        params.status = status;
      }
       if (dateRange?.after) {
        params.after = dateRange.after;
      }
      if (dateRange?.before) {
        params.before = dateRange.before;
      }

      let allOrders: any[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await api.get("orders", { ...params, page });
        if (response.data && response.data.length > 0) {
            allOrders = allOrders.concat(response.data);
        }
        if (response.headers && response.headers['x-wp-totalpages']) {
            totalPages = Number(response.headers['x-wp-totalpages']);
        } else {
            totalPages = page;
        }
        page++;
      } while (page <= totalPages);

      return allOrders;
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

export async function getOrderById(id: number): Promise<Order | null> {
  try {
    const response = await api.get(`orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return null;
  }
}
