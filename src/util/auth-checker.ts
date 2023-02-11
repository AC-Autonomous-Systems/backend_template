import { print } from "graphql";
import { AuthChecker } from "type-graphql";
import { Context } from "../types/context";

/**
 * Original Author: An Chang
 * Created Date: 6/16/2022
 * Purpose: Verify the authorized User has proper permission to execute query/mutation based on the User's Role.
 */

/**
 * Verify the authorized User has proper permission to execute query/mutation based on the User's Role.
 * @param param0 Important one is context.
 * @param roles The role(s) that have permission to execute query/mutation.
 * @returns Whether the User can execute query/mutation (True/False)
 */
export const customAuthChecker: AuthChecker<Context> = async (
  { root, args, context, info },
  roles
) => {
  const role: string | undefined = context.user?.role;

  if (role === undefined || role === null) {
    // First check that a user exists and he has a role.
    return false;
  } else if (roles.length === 0) {
    // If only authorized is specified, that means all roles can have access.
    return true;
  } else if (roles.includes(role!)) {
    // Make sure the user's role is in the list of specified roles.
    return true;
  } else {
    // Deny access in all other cases.
    return false;
  }
};
