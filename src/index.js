const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./qraphql');
const { verifyToken } = require('./helpers/tokenHelper');

const app = express();

app.use((req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        // authorization: Bearer XXXXXXXXXXXXXXXX
        const token = authorization.split(' ')[1];
        req.user = verifyToken(token);
    }

    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    engine: {
        // https://engine.apollographql.com/service/MikhailSemichev-7695/explorer
        apiKey: 'service:MikhailSemichev-7695:JIEFvdrvmmn5ALyOz4WJYA',
    },
    introspection: true,
    playground: {
        endpoint: '/graphql',
        settings: {
            'editor.theme': 'light',
            'editor.fontSize': 16,
            'editor.cursorShape': 'line',
        },
    },
    context: ({ req }) => {
        return {
            req,
            user: req.user,
        };
    },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
