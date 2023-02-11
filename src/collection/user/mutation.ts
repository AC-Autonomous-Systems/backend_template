import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import {
  CreateUserInput,
  LoginUserInput,
  ResetPasswordInput,
  UpdateUserInput,
  User,
} from "./schema";
import { UserService } from "./services";
import { Context } from "../../types/context";

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: - Graph Layer
 *          - Handles all the mutations in regards to the User document.
 */

@Resolver()
export class UserMutationResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }
  /**
   * Create a new user.
   * @param input CreateUserInput that stores the inputs needed to create a user.
   * @returns User object of the newly created user.
   */
  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput): Promise<User | null> {
    return this.userService.createUser(input);
  }

  /**
   * Authenticate a new user using email and password.
   * @param input LoginUserInput object containing email and password.
   * @param context The context for GraphQL which holds important contextual information.
   * @returns Signed JSON web token in a string.
   */
  @Mutation(() => String)
  login(
    @Arg("input") input: LoginUserInput,
    @Ctx() context: Context
  ): Promise<String> {
    return this.userService.login(input, context);
  }

  /**
   * Update any field of a User (minus password). Exclusive to the owner.
   * @param input UpdateUserInput containing paramters to update.
   * @param context To update the logged in User in context in case the User being updated is the one logged in.
   * @returns The updated User or null.
   */
  @Authorized("Admin", "Owner")
  @Mutation(() => User)
  updateUser(
    @Ctx() context: Context,
    @Arg("input") input: UpdateUserInput
  ): Promise<User | null> {
    return this.userService.updateUser(input, context);
  }

  /**
   * Reset a User's password.
   * @param input ResetPasswordInput containing the resetToken and the password.
   * @returns The User with password resetted.
   */
  @Mutation(() => User)
  resetPassword(@Arg("input") input: ResetPasswordInput): Promise<User | null> {
    return this.userService.resetPassword(input);
  }
}
