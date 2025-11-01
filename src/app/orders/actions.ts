'use server';
import 'dotenv/config';
import { api } from '@/lib/woocommerce';
import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateOrder(id: number, data: { status: string }) {
  if (!await isAdmin()) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const response = await api.put(`orders/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating order:', error.response.data);
    return { success: false, error: error.response.data.message || 'Failed to update order.' };
  }
}
