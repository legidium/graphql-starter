const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./qraphql');
const { verifyToken } = require('./helpers/tokenHelper');
const { ROLE } = require('./enums');


const app = express();

app.use((req, res, next) => {
    const { authorization } = req.headers;
    let user;

    if (authorization) {
        const token = authorization.split(' ')[1];
        req.user = verifyToken(token);
        if (!user) {
            res.send(401);
            res.end();
        }
    } else {
        req.user = {
            role: ROLE.ANONYMOUS,
        };
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
    context: ({ req, res }) => {
        return {
            req,
        };
    },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
