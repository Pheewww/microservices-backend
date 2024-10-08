import axios from "axios";
import { verifyAdminToken } from "../middleware.auth";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002/api/v1/product/';

export const productResolvers = {
    Query: {
        products: async () => {
            try {
                const response = await axios.get(`${PRODUCT_SERVICE_URL}`);
                console.log("response.data ", response.data);

                return response.data;
            } catch (error: any) {
                console.error('Error fetching orders:', error.response ? error.response.data : error.message);
                throw new Error('Failed to fetch orders: ' + error.message);
            }
        },
        product: async (_: any, { id }: { id: string }) => {
            try {
                
                console.log("docid for product", id);
                const response = await axios.get(`${PRODUCT_SERVICE_URL}/${id}`);
                return response.data;
            } catch (error: any) {
                console.error('Error fetching orders:', error.response ? error.response.data : error.message);
                throw new Error('Failed to fetch orders: ' + error.message);
            }
        },
    },
    Mutation: {
        createProduct: async (_: any, { input }: { input: { productId: number; name: string; price: number; stock: number } }, context: any, next:any) => {
            // Ensure that the user is an admin

            try {

                const authHeader = context.req.headers.authorization || '';
                const token = authHeader.split(' ')[1];

                console.log("token", token);
                const user = await verifyAdminToken(token);
                console.log("user", user);

                // if (user.role !== 'admin') {
                //     console.log("user isn not admin");
                //     throw new Error;
                    
                // }

                const { productId, name, price, stock } = input;
                const productData = { productId, name, price, stock };


                console.log("input1", productData);
                const response = await axios.post(PRODUCT_SERVICE_URL, productData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (error: any) {
                console.error('Error fetching orders:', error.response ? error.response.data : error.message);
                throw new Error('Failed to fetch orders: ' + error.message);
            }
        },
    },
};

 
