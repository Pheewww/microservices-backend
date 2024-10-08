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
    order: async (_: any, { id }: { id: string }) => {
      try {
          const response = await axios.get(`${ORDER_SERVICE_URL}/${id}`);
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
        { input }: { input: { orderId: number; userId: string; quantity: number; productId: number } }
    ) => {
      try {
          const { orderId, userId, quantity, productId } = input;
          const input1 = {
              orderId,
              userId,
              productId,
              quantity,
          }
          console.log("input1", input1);
        const response = await axios.post(`${ORDER_SERVICE_URL}`, input1);
        return response.data;
      } catch (error: any) {
          console.error('Error fetching order:', error.response ? error.response.data : error.message);
          throw new Error('Failed to fetch order: ' + error.message);
      }
    },
  },
};
