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



