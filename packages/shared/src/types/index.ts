export interface User {
  id: string,
  name: string;
  email: string;
}

// types.ts
export interface UserG {
  _id: string;
  name: string;
  email: string;
  role: string;
}


export interface UserRegister{
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdate{
  id: string,
  name?: string,
  email: string;
  password?: string;
}

export interface Product {
  id: string,
  productId: number;
  name: string;
  price: number;
  stock: number;
}

export type InventoryUpdate = Required<Pick<Product, 'id' | 'stock'>>;

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}

export interface CreateProduct {
  productId: Number,
  name: String,
  price: Number,
  stock: Number,
}


export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Status {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}



