import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

/**
 * Original Author: An Chang
 * Created Date: 6/15/2022
 * Purpose: Verify the JWT token and return the object. In this case it will be used to validate User objects.
 */

/**
 * Verify the JWT token and return the object
 * @param token The token to be verified.
 * @returns The object of type T after decoding or null.
 */
export function verifyJwt<T>(token: string): T | null {
  const privateKey = process.env.PRIVATE_KEY!;
  try {
    const decoded = jwt.verify(token, privateKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
