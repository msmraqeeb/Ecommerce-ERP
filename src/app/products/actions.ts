'use server';
import 'dotenv/config';
import { api } from '@/lib/woocommerce';
import { getProductBySKU } from '@/lib/woocommerce';

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

export async function updateProductFromSync(identifier: string, correctedData: any) {
  try {
    // The AI might return various keys. We need to map them to what WooCommerce expects.
    const wooData: { [key: string]: any } = {};
    
    if (correctedData.name) wooData.name = correctedData.name;
    if (correctedData.price) wooData.regular_price = correctedData.price;
    if (correctedData.stock_quantity !== undefined) {
        wooData.stock_quantity = correctedData.stock_quantity;
        wooData.manage_stock = true; // Required to update stock
    }

    // Find the product ID. The identifier could be the ID or SKU.
    let productId: number | null = null;

    // First, try to find the product by SKU. This is more reliable.
    const productsBySku = await getProductBySKU(identifier);
    if (productsBySku && productsBySku.length > 0) {
        productId = productsBySku[0].id;
    } else if (!isNaN(Number(identifier))) {
        // If not found by SKU, and if the identifier is a number, assume it's the product ID.
        // A more robust solution might check if the product exists by ID first.
        productId = Number(identifier);
    }

    if (!productId) {
        throw new Error(`Product with SKU or ID '${identifier}' not found.`);
    }
    
    const response = await api.put(`products/${productId}`, wooData);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update product from sync.';
    console.error('Error in updateProductFromSync:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
