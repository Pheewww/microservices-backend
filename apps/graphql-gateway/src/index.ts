import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from './schemas';
import { userResolvers } from './resolvers/userResolvers';
import { orderResolvers } from "./resolvers/orderResolvers";

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...orderResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...orderResolvers.Mutation,
    },
};

const server = new ApolloServer({

    typeDefs,
    resolvers,
    introspection: true,  
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),  
    ],

});

server.listen().then(({ url }) => {
    console.log(`graphql runninng at ${url}`);
});