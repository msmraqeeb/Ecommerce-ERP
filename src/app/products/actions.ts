'use server';
import 'dotenv/config';
import { api } from '@/lib/woocommerce';
import { getProductBySKU } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';
import { isAdmin } from '@/lib/auth';

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await api.get(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

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
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }
  try {
    const response = await api.put(`products/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating product:', error.response?.data);
    return { success: false, error: error.response?.data?.message || 'Failed to update product.' };
  }
}

export async function updateProductFromSync(identifier: string | number, correctedData: any) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }
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
    
    if (typeof identifier === 'string') {
        const productsBySku = await getProductBySKU(identifier);
        if (productsBySku && productsBySku.length > 0) {
            productId = productsBySku[0].id;
        }
    } else if (typeof identifier === 'number') {
        productId = identifier;
    }


    if (!productId) {
        // Try to get it from the correctedData as a fallback
        const idFromData = correctedData.id || correctedData.product_id;
        if(idFromData) {
            const product = await getProductById(idFromData);
            if(product) productId = product.id;
        }
    }

    if (!productId) {
        throw new Error(`Product with identifier '${identifier}' not found.`);
    }
    
    const response = await api.put(`products/${productId}`, wooData);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update product from sync.';
    console.error('Error in updateProductFromSync:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
