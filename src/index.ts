import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import session from "express-session";
import cors from "cors";
import { redis } from "./redis";
import { RegisterResolver } from "./modules/user/Register";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });

    const apolloServer = new ApolloServer({
        schema,
        formatError: formatArgumentValidationError,
        context: ({ req, res }: any) => ({ req, res }),
    });

    const app = express();

    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000",
        })
    );

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: "qid",
            secret: "aslkjoiq12312",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7,
            },
        })
    );

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server started on http://localhost:4000/graphql");
    });
};

main().catch((err) => console.error(err));

function formatArgumentValidationError(error: GraphQLError): GraphQLFormattedError {
    return {
        message: error.message,
        locations: error.locations,
        path: error.path,
    };
}