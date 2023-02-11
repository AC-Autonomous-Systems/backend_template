import { User } from "../collection/user/schema";
import { Request, Response } from "express";

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: TypeScript type definition for the GraphQL context.
 */

interface Context {
  req: Request;
  res: Response;
  // user: Omit<User, "password"> | null;
  user: User | null;
}

export { Context };
