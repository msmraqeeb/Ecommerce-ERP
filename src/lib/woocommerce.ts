import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const wooCommerceApiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
const wooCommerceConsumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const wooCommerceConsumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

if (!wooCommerceApiUrl || !wooCommerceConsumerKey || !wooCommerceConsumerSecret) {
    throw new Error("WooCommerce API credentials are not set. Please check your .env.local file and ensure they use the NEXT_PUBLIC_ prefix.");
}

const api = new WooCommerceRestApi({
  url: wooCommerceApiUrl,
  consumerKey: wooCommerceConsumerKey,
  consumerSecret: wooCommerceConsumerSecret,
  version: "wc/v3",
  queryStringAuth: true, // Force authentication via query string
  axiosConfig: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  }
});

export async function getProducts(page = 1, status: 'publish' | 'draft' | 'any' = 'publish') {
  try {
    const response = await api.get("products", {
        per_page: 20,
        page: page,
        status: status,
    });
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

    return {
      all: publishedCount + draftCount,
      published: publishedCount,
      draft: draftCount,
    };
  } catch (error) {
    console.error("Error fetching product counts:", error);
    return { all: 0, published: 0, draft: 0 };
  }
}


export async function getOrders() {
    try {
      const response = await api.get("orders", {
          per_page: 100,
      });
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