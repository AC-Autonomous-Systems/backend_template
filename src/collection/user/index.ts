import { UserMutationResolver } from "./mutation";
import { UserQueryResolver } from "./query";

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: Used by resolvers.ts to generate the schema. Contains all resolvers for the User document.
 */
export const userResolvers: readonly [
  typeof UserQueryResolver,
  typeof UserMutationResolver
] = [UserQueryResolver, UserMutationResolver] as const;
