import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

if (!process.env.WOOCOMMERCE_API_URL || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
    console.warn("WooCommerce API credentials are not set. Please check your .env.local file.");
}

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: "wc/v3"
});

export async function getProducts() {
  try {
    const response = await api.get("products", {
        per_page: 20,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getOrders() {
    try {
      const response = await api.get("orders", {
          per_page: 20,
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
        per_page: 20,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }
