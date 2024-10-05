import axios from 'axios';

const resolvers = {
  Query: {
    users: async () => {
      const res = await axios.get('http://localhost:3001/api/users');
      return res.data;
    },
    products: async () => {
      const res = await axios.get('http://localhost:3002/api/products');
      return res.data;
    },
  },
};

export default resolvers;
