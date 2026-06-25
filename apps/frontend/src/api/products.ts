import type { Product } from '../types';
import { productFetch } from './api';


export const getProducts = (query?: string): Promise<Product[]> =>
  productFetch(`/product${query ? `?${query}` : ''}`);

export const getProduct = (id: string): Promise<Product> => productFetch(`/product/${id}`);

export const createProduct = (data: Omit<Product, 'id'>): Promise<Product> =>
  productFetch('/product', { method: 'POST', body: JSON.stringify(data) });

export const updateProduct = (id: string, data: Partial<Product>): Promise<Product> =>
  productFetch(`/product/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteProduct = (id: string): Promise<void> =>
  productFetch(`/product/${id}`, { method: 'DELETE' });
