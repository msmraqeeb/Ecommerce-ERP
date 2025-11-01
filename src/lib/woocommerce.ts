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

export async function getProductBySKU(sku: string): Promise<Product[]> {
    if (!sku) return [];
    try {
        const response = await api.get("products", { sku: sku });
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
    };

    if (status && status !== 'all' && status !== 'any') {
      params.status = status;
    } else {
      params.status = 'any';
    }

    if (stock_status) params.stock_status = stock_status;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    
    let combinedProducts: Product[] = [];
    let totalProductsHeader = '0';
    let totalPagesHeader = '0';
    
    if (search) {
      // Primary search by general term (name, desc)
      const searchResponse = await api.get("products", { ...params, search: search });
      if (searchResponse.data) {
        combinedProducts = combinedProducts.concat(searchResponse.data);
      }
      
      // Secondary search specifically by SKU
      const skuResponse = await api.get("products", { ...params, sku: search });
      if (skuResponse.data) {
         combinedProducts = combinedProducts.concat(skuResponse.data);
      }

      // Remove duplicates
      const uniqueIds = new Set();
      combinedProducts = combinedProducts.filter(product => {
        if (uniqueIds.has(product.id)) {
          return false;
        } else {
          uniqueIds.add(product.id);
          return true;
        }
      });
      
      // Since we are combining results, the pagination headers from a single API call are not accurate.
      // We'll set them based on the combined results.
      totalProductsHeader = String(combinedProducts.length);
      totalPagesHeader = "1"; // We are showing all results on one page for now. A more complex pagination would be needed for large result sets.

    } else {
       const response = await api.get("products", params);
       combinedProducts = response.data;
       totalPagesHeader = response.headers['x-wp-totalpages'];
       totalProductsHeader = response.headers['x-wp-total'];
    }

    return {
      products: combinedProducts,
      totalPages: Number(totalPagesHeader),
      totalProducts: Number(totalProductsHeader),
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

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await api.get(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
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
