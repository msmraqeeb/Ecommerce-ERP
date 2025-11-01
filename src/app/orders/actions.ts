'use server';

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const wooCommerceApiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
const wooCommerceConsumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const wooCommerceConsumerSecret =
  process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

if (
  !wooCommerceApiUrl ||
  !wooCommerceConsumerKey ||
  !wooCommerceConsumerSecret
) {
  throw new Error(
    'WooCommerce API credentials are not set. Please check your .env.local file and ensure they use the NEXT_PUBLIC_ prefix.'
  );
}

const api = new WooCommerceRestApi({
  url: wooCommerceApiUrl,
  consumerKey: wooCommerceConsumerKey,
  consumerSecret: wooCommerceConsumerSecret,
  version: 'wc/v3',
  queryStringAuth: true,
});

export async function updateOrder(id: number, data: { status: string }) {
  try {
    const response = await api.put(`orders/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating order:', error.response.data);
    return { success: false, error: error.response.data.message || 'Failed to update order.' };
  }
}
