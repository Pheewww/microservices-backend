import { gql } from 'apollo-server';

const typeDefs = gql`
 type User {
    id: ID!
    name: String!
    email: String!
    role: String!
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
    userId: String!
    productId: Int!
    quantity: Int!
    createdAt: String!
  }

input OrderInput {
    orderId: Int!
    userId: String!
    productId: Int!
    quantity: Int!
}
    

type Query {
    users: [User!]!
    user(id: ID!): User
    orders: [Order!]!
    order(orderId: Int!): Order
}

type Mutation {
    registerUser(name: String!, email: String!, password: String!, role: String): RegisterResponse!
    updateUserProfile(id: ID!, name: String, email: String,  password: String): UpdateUser!
     placeOrder(input: OrderInput!): Order!
}
`;

export default typeDefs;
