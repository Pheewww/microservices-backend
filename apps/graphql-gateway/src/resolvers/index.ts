import axios from 'axios';

const resolvers = {
  Query: {
    users: async () => {
      const res = await axios.get('http://localhost:3001/api/v1/users');
      return res.data;
    },
    products: async () => {
      const res = await axios.get('http://localhost:3002/api/v1/products');
      return res.data;
    },
  },
};

export default resolvers;
