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
        throw new Error("Failed to fetch users" + error.message);
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        const response = await axios.get(`${USER_SERVICE_URL}/${id}`);
        if (!response.data) {
          throw new Error("User not found");
        }

        
        const user = response.data;

        // return {
        //   id: user._id,
        //   name: user.name,
        //   email: user.email,
        //   role: user.role
        // };
        return user;
      } catch (error: any) {
        throw new Error("Failed to fetch user: " + error.message);
      }
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      {
        name,
        email,
        password,
        role,
      }: { name: string; email: string; password: string; role?: string }
    ) => {
      try {
        const response = await axios.post(`${USER_SERVICE_URL}/register`, {
          name,
          email,
          password,
          role,
        });
        return response.data;
      } catch (error: any) {
        throw new Error("Failed to register user: " + error.message);
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
        throw new Error("Failed to update user profile: " + error.message);
      }
    },
  },
};
