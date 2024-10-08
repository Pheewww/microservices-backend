import axios from "axios";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001/api/v1/users";

export const userResolvers = {
  Query: {
    users: async () => {
      try {
        const response = await axios.get(`${USER_SERVICE_URL}`);
        return response.data;
      } catch (error: any) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        const response = await axios.get(`${USER_SERVICE_URL}/${id}`);
        if (!response.data) {
          throw new Error("User not found");
        }

        
        const user = response.data;

        if (!user) {
          console.log("user is null", user);
        }

        console.log('Fetched user:', user);


        return user;
      } catch (error: any) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { input }: { input: { name: string; email: string; password: string; role?: string } }
    ) => {
      try {
        const response = await axios.post(`${USER_SERVICE_URL}/register`, input);
        return response.data;
      } catch (error: any) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
    updateUserProfile: async (
      _: any,
      {
        id,
        name,
        email,
        password,
      }: { id: string; name?: string; email?: string; password?: string }
    ) => {
      try {
        const response = await axios.put(`${USER_SERVICE_URL}/update`, {
          id,
          name,
          email,
          password,
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
  },
};
