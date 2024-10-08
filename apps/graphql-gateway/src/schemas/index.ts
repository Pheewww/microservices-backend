import { gql } from 'apollo-server';

const typeDefs = gql`
 type User {
    id: ID!
    name: String!
    email: String!
    role: String!
}

input UserInput {
  name: String!
  email: String! 
  password: String!
  role: String
}

 type UpdateUser {
    id: ID!
    name: String!
    email: String!
}

type RegisterResponse {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String!
}

type Order {
    id: ID!
    orderId: Int!
    userId: String!
    productId: Int!
    quantity: Int!
    createdAt: String!
    status: String!
  }

input OrderInput {
    orderId: Int!
    userId: ID!
    productId: Int!
    quantity: Int!
}

type Product {
    id: ID!
    productId: Int!
    name: String!
    price: Int!
    stock: Int!
    createdAt: String!
  }

input ProductInput {
    productId: Int!
    name: String!
    price: Int!
    stock: Int
  }
    

type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]! 
    product(id: ID!): Product  
    orders: [Order!]!
    order(id: ID!): Order
}

type Mutation {
    registerUser(input: UserInput!): RegisterResponse!
    updateUserProfile(id: ID!, name: String, email: String,  password: String): UpdateUser!
     createProduct(input: ProductInput!): Product!
     placeOrder(input: OrderInput!): Order!
}
`;

export default typeDefs;
