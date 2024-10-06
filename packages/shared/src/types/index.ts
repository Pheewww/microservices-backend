export interface User {
  name: string;
  email: string;
}

export interface UserRegister{
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdate{
  name?: string,
  email: string;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export type InventoryUpdate = Partial<Pick<Product, 'id' | 'stock'>>;

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}


export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

