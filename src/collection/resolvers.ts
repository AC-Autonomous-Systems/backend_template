import { userResolvers } from './user';
/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: Used by TypeGraphQL to generate the schema. Contains all resolvers for each document in an array.
 */

const resolvers = [...userResolvers] as const;

export { resolvers };
