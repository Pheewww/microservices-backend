# Microservices-Based Platform

This project is a microservices-based e-commerce platform using Node.js, TypeScript, GraphQL, MongoDB, and Kafka.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Development](#development)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v18 or later)
- Docker and Docker Compose
- Git

## Project Structure
```
├── apps
│   ├── graphql-gateway
│   ├── order-service
│   ├── product-service
│   └── user-service
├── packages
│   ├── eslint-config
│   ├── shared
│   ├── typescript-config
│   └── ui
├── docker-compose.yml
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
 ```bash
   git clone https://github.com/Pheewww/microservices-backend
   cd microservices-backend
   ```

## Configuration

1. Set up environment variables:
- Copy the `.env.example` file in each service directory to `.env`
- Update the `.env` files with your specific configuration

2. Update Graphql configuration:
- change graphql service env as per your designed ports for each service

## Running the Application

1. Start the application using Docker: `docker-compose up --build`.
This command will build the Docker images and start all the services.

2. The ( Default ) services will be available at:
- GraphQL Gateway: http://localhost:4000
- User Service: http://localhost:3001
- Product Service: http://localhost:3002
- Order Service: http://localhost:3003

## Development

To run the application in development mode:

1. In root dir, `npm install` then `npm run build` to build all services.
2. Then start the services: `npm run dev`
3. To run a specific service: `cd <service-directory>` then `npm run build` then `npm run dev`

Replace `<service-name>` with graphql-gateway, user-service, product-service, or order-service.

## Postman Collection Apis
use `backendApis.postman_collection.json` file 

## Graphql Playground Queries and Mutations

Create User
```
mutation RegisterUser {
    registerUser(
        input: {
            name: "john doww"
            email: "email@gmail.com"
            password: "secure11"
            role: "admin"
        }
    ) {
        name
        email
        role
        token //copy it if user is admin
        id
    }
} 
```

Get User by ID
```query Users {
    user(id: "670504d3ff2ee3e8e456ccb4") {
        name
        email
        role
    }
}
```

Get All Users
```
query Users {
    users {
        name
        email
        role
    }
}
```

Update User Profile
```
mutation UpdateUserProfile {
    updateUserProfile(
        id: "6705261cd87d7e3cd63b1c10"
        name: "john doeee"
        email: "nextemail@gmail.com"
    ) {
        id
        name
        email
    }
}
```
Get All Products
```
query Product {
    products {
        productId
        name
        price
        stock
        createdAt
    }
}
```

Get Product by ID
```
query Product {
    product(id: "6705111ae8b42dfc570afe15") {
        productId
        name
        price
        stock
        createdAt
    }
}
```

Create Product (ADMIN ONLY, needs token)
```
// Send Copied Token as Auth Header

mutation PlaceOrder {
    createProduct(
        input: { productId: 122222, name: "asdas", price: 100, stock: 1000 }
    ) {
        productId
        name
        price
        stock
        createdAt
    }
}
```
Place an Order
```
mutation PlaceOrder {
    placeOrder(
        input: {
            orderId: 1222
            userId: "6705261cd87d7e3cd63b1c10"
            productId: 123
            quantity: 10
        }
    ) {
        orderId
        userId
        productId
        quantity
        createdAt
        status
    }
}

```

Place an Order 
```
mutation PlaceOrder2 {
    placeOrder(input: { orderId: 444, userId: "userId", productId: 123, quantity: 10 }) {
        orderId
        userId
        productId
        quantity
        createdAt
        status
    }
}
```

Get All Orders
```
query Orders {
    orders {
        orderId
        userId
        productId
        quantity
        createdAt
        status
    }
}
```

Get Order by ID
```
query Order {
    order(id: "67052a245e1cf09a57aab44a") {
        orderId
        userId
        productId
        quantity
        createdAt
        status
    }
}
```
```
support for update product and update order is not at present, they are in postman apis at present
```




## API Documentation

- GraphQL API: Access the GraphQL Playground at http://localhost:4000/graphql when the application is running.

## Troubleshooting

1. If you encounter connection issues with MongoDB Atlas, ensure your IP address is whitelisted in the Atlas dashboard.

2. For Kafka connection issues, check if the Kafka service is running and the broker addresses are correct in your service configurations.

3. If a service fails to start, check the Docker logs: