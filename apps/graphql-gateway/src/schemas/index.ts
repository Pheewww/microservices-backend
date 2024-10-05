import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    users: [User]
    products: [Product]
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }
`;

export default typeDefs;
