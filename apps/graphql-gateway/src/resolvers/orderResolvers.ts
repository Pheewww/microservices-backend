import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003/api/v1/order/';

export const orderResolvers = {
  Query: {
    orders: async () => {
      try {
        const response = await axios.get(`${ORDER_SERVICE_URL}`);
        return response.data;
      } catch (error: any) {
          console.error('Error fetching orders:', error.response ? error.response.data : error.message);
          throw new Error('Failed to fetch orders: ' + error.message);
      }
    },
    order: async (_: any, { orderId }: { orderId: number }) => {
      try {
          const response = await axios.get(`${ORDER_SERVICE_URL}/${orderId}`);
        if (!response.data) {
          throw new Error("Order not found");
        }
        return response.data;
      } catch (error: any) {
          console.error('Error fetching order:', error.response ? error.response.data : error.message);
          throw new Error('Failed to fetch order: ' + error.message);
      }
    },
  },
  Mutation: {
    placeOrder: async (
      _: any,
      {
        orderId,
        userId,
        quantity,
        productId,
      }: {
        orderId: number;
        userId: string;
        quantity: number;
        productId: number;
      }
    ) => {
      try {
        const response = await axios.post(`${ORDER_SERVICE_URL}/`, {
          orderId,
          userId,
          productId,
          quantity,
        });
        return response.data;
      } catch (error: any) {
        throw new Error("Failed to place order: " + error.message);
      }
    },
  },
};
