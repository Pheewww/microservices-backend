export interface User {
  id: string,
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
  docId: number,
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
}



