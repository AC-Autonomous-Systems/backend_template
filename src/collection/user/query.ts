import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../../types/context";
import {
  GetUserInput,
  RequestResetPasswordInput,
  UpdateUserInput,
  User,
} from "./schema";
import { UserService } from "./services";

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: - Graph Layer
 *          - Handles all the queries in regards to the User document.
 */

@Resolver()
export class UserQueryResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  /**
   * Returns the user object of the currently logged in user.
   * @param context The context info that contains the current logged in user (NOTE: It is possible that
   *                there isn't a user logged in).
   * @returns The current logged in user if it exists.
   */
  @Authorized()
  @Query(() => User)
  me(@Ctx() context: Context): User | null {
    return context.user;
  }

  /**
   * Retrieve all staff members.
   * @returns Array of Users that isn't a Customer, or empty array, in a Promise.
   */
  @Authorized("Manager", "Admin", "Owner")
  @Query(() => [User])
  async staff(): Promise<Array<User>> {
    return this.userService.getStaff();
  }

  /**
   * Retrieve all Users.
   * @returns Array of Users, or empty array, in a Promise.
   */
  @Authorized("Admin", "Owner")
  @Query(() => [User])
  async users(): Promise<Array<User>> {
    return this.userService.getUsers();
  }

  /**
   * Retrieve a User by _id.
   * @returns User object, or null, in a Promise.
   */
  @Authorized("Admin", "Owner")
  @Query(() => User)
  async user(@Arg("input") input: GetUserInput): Promise<User | null> {
    return this.userService.getUser(input);
  }

  /**
   * Reset the password of a User. The user will receive an email containing an URL with the resetToken and expiry time.
   * @param input RequestResetPasswordInput containing the email of the account to reset.
   */
  @Query(() => Boolean)
  async requestPasswordLink(
    @Arg("input") input: RequestResetPasswordInput
  ): Promise<Boolean> {
    return this.userService.requestPasswordLink(input);
  }
}
