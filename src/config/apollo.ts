import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { resolvers } from '../collection/resolvers';
import { Context } from '../types/context';
import { verifyJwt } from '../util/jwt-helper';
import { User, UserModel } from '../collection/user/schema';
import { customAuthChecker } from '../util/auth-checker';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'reflect-metadata';
import express from 'express';
dotenv.config();

/**
 * Original Author: An Chang
 * Created Date: 7/6/2022
 * Purpose: Function to create Express and Apollo servers.
 */

export async function startApolloServer(expressPort: number | string) {
  // Build the schema:

  const schema = await buildSchema({
    resolvers,
    // emitSchemaFile: path.resolve(__dirname, "schema.gql"), // Optional argument to create GraphQL schema file.
    authChecker: customAuthChecker,
    validate: { forbidUnknownValues: false },
  });

  // Initialize express:

  const app = express();

  app.use(cookieParser());

  app.use(express.json());

  // Create apollo server:

  const server = new ApolloServer({
    schema: schema,
    persistedQueries: false,
    context: async (ctx: Context) => {
      const context = ctx;
      if (ctx.req.cookies.accessToken) {
        const user: User | null = verifyJwt<User>(ctx.req.cookies.accessToken);
        if (user) {
          // const { password, ...otherInfo } = user;
          const userUpdated: User | null | undefined = await UserModel.findById(
            user._id
          );

          if (userUpdated !== undefined && userUpdated !== null) {
            context.user = userUpdated;
          }
        }
      }

      return context;
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    csrfPrevention: true,
  });
  // Wait for server to start:

  await server.start();

  // Apply middleware to server:

  server.applyMiddleware({
    app,
    cors: {
      credentials: (process.env.CORS_CREDS ?? 'true') === 'true', // Coverts the .env string to a boolean.
      origin: process.env.CORS?.split(' '),
    },
  });

  // Start listening on the express server.

  app.listen({ port: expressPort });

  console.log(`App is listen on port ${expressPort}`);
}
