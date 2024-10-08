import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from './schemas';
import { userResolvers } from './resolvers/userResolvers';
import { orderResolvers } from "./resolvers/orderResolvers";
import { productResolvers } from "./resolvers/productResolvers";

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...orderResolvers.Query,
        ...productResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...orderResolvers.Mutation,
        ...productResolvers.Mutation,
    },
};

const server = new ApolloServer({

    typeDefs,
    resolvers,
    introspection: true,  
    context: ({ req }) => {
        return { req };
    },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),  
    ],

});

server.listen().then(({ url }) => {
    console.log(`graphql runninng at ${url}`);
});