import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { Product, ProductStatus, OrderStatus, Customer } from "@/lib/types";

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
    
    let searchPromise = Promise.resolve({ data: [], headers: {} });
    let skuPromise = Promise.resolve({ data: [], headers: {} });

    if (search) {
      searchPromise = api.get("products", { ...params, search });
      skuPromise = api.get("products", { ...params, sku: search });
    } else {
      searchPromise = api.get("products", params);
    }
    
    const [searchResponse, skuResponse] = await Promise.all([searchPromise, skuPromise]);
    
    const combinedProducts = [...searchResponse.data, ...skuResponse.data];
    const uniqueProducts = Array.from(new Map(combinedProducts.map(p => [p.id, p])).values());

    // For simplicity, we'll use the headers from the main search response for pagination.
    // This might not be perfectly accurate if the SKU search returns vastly different total numbers,
    // but it's a reasonable trade-off to avoid complex header merging.
    const finalResponse = search && search.length > 0 ? searchResponse : await api.get("products", { per_page: 1, page });
    const totalPages = Number(finalResponse.headers['x-wp-totalpages']);
    const totalProducts = Number(finalResponse.headers['x-wp-total']);

    return {
      products: uniqueProducts,
      totalPages,
      totalProducts,
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

    const response = await api.get("products", {per_page: 1});
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
