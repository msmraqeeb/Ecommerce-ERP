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
      status: (status && status !== 'all') ? status : 'any',
    };

    if (stock_status) params.stock_status = stock_status;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    
    let combinedProducts: Product[] = [];
    let totalProducts = 0;
    let totalPages = 0;

    if (search) {
      // Perform two separate searches: one for general text and one for SKU
      const [textSearchResponse, skuSearchResponse] = await Promise.all([
        api.get("products", { ...params, search }),
        api.get("products", { ...params, sku: search })
      ]);

      const textProducts: Product[] = textSearchResponse.data;
      const skuProducts: Product[] = skuSearchResponse.data;

      // Combine and deduplicate results
      const allProducts = [...textProducts, ...skuProducts];
      const uniqueProductIds = new Set<number>();
      combinedProducts = allProducts.filter(product => {
        if (!uniqueProductIds.has(product.id)) {
          uniqueProductIds.add(product.id);
          return true;
        }
        return false;
      });
      
      // For simplicity, pagination might not be perfect with combined results,
      // but we can estimate or use the larger of the two counts.
      totalProducts = uniqueProductIds.size; // This is only for the current page. A full count is more complex.
      // In a real-world scenario, you might need a more sophisticated pagination for combined searches.
      // For this implementation, we will show the results from the first page of both queries.
      totalPages = 1; // Simplification for now.

    } else {
      // No search term, just fetch with filters
      const response = await api.get("products", params);
      combinedProducts = response.data;
      totalPages = Number(response.headers['x-wp-totalpages']);
      totalProducts = Number(response.headers['x-wp-total']);
    }

    return {
      products: combinedProducts,
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