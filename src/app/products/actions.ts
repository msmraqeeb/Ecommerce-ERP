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

export async function getAllProductsForExport() {
  try {
    let allProducts: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const { data, headers }: any = await api.get('products', {
        per_page: 100,
        page: page,
      });

      if (data && data.length > 0) {
        allProducts = allProducts.concat(data);
      }
      
      if (headers && headers['x-wp-totalpages']) {
        totalPages = Number(headers['x-wp-totalpages']);
      } else {
        // If the header is not present, we assume we are done
        totalPages = page;
      }
      page++;

    } while (page <= totalPages);

    return allProducts;
  } catch (error) {
    console.error('Error fetching all products for export:', error);
    // In case of an error, return an empty array or handle it as needed
    return [];
  }
}

export async function updateProduct(id: number, data: any) {
  try {
    const response = await api.put(`products/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating product:', error.response.data);
    return { success: false, error: error.response.data.message || 'Failed to update product.' };
  }
}
