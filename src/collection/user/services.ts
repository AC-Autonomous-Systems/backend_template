import { Context } from '../../types/context';
import {
  CreateUserInput,
  GetUserInput,
  LoginUserInput,
  RequestResetPasswordInput,
  ResetPasswordInput,
  UpdateUserInput,
  User,
  UserModel,
} from './schema';
import { ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../config/email';
/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: - Business Layer
 *          - Used by the GraphQL interface (query.ts & mutation.ts) to execute business logic.
 */

dotenv.config();

export class UserService {
  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Retrieve all staff members.
   * @returns Array of Users that isn't a Customer, or empty array, in a Promise.
   */
  async getStaff(): Promise<Array<User>> {
    return UserModel.find({ role: { $nin: ['Customer', 'Counter'] } });
  }

  /**
   * Retrieve all Users.
   * @returns Array of Users, or empty array, in a Promise.
   */
  async getUsers(): Promise<Array<User>> {
    return UserModel.find();
  }

  /**
   * Retrieve a User by _id.
   * @returns User object, or null, in a Promise.
   */
  async getUser(input: GetUserInput): Promise<User | null> {
    return UserModel.findById(input._id);
  }

  /**
   * Authenticate a new user using email and password.
   * @param input LoginUserInput object containing email and password.
   * @param context The context for GraphQL which holds important contextual information.
   * @returns Signed JSON web token in a Promise.
   */
  async login(input: LoginUserInput, context: Context): Promise<String> {
    const { email, password } = input;

    const lowerCaseEmail = email.toLowerCase();
    // Get user by email.
    const user: User | null = await UserModel.findOne({
      email: lowerCaseEmail,
    });

    if (user === null || user === undefined) {
      throw new ApolloError('User with given email does not exist');
    } else if (user.active === false) {
      throw new ApolloError('User has been marked as inactive.');
    }

    // Validate password.
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError('Invalid Password!');
    }

    const privateKey = process.env.PRIVATE_KEY!;

    let jwtToken;
    // Sign a JWT.
    if (user.role === 'Counter') {
      jwtToken = jwt.sign((user as any).toObject(), privateKey, {
        expiresIn: '1y',
      });
    } else {
      jwtToken = jwt.sign((user as any).toObject(), privateKey, {
        expiresIn: '1d',
      });
    }

    // Set cookie for JWT.
    context.res.cookie('accessToken', jwtToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: false,
      domain: process.env.DOMAIN,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    // Return JWT.
    return jwtToken;
  }

  /**
   * Reset the password of a User. The user will receive an email containing an URL with the resetToken and expiry time.
   * @param input RequestResetPasswordInput containing the email of the account to reset.
   */
  async requestPasswordLink(
    input: RequestResetPasswordInput
  ): Promise<Boolean> {
    const { email } = input;

    const lowerCaseEmail = email.toLowerCase();

    const userFromEmail: User | null = await UserModel.findOne({
      email: lowerCaseEmail,
    });

    if (!userFromEmail) {
      throw new ApolloError(`${email} does not belong to a User!`);
    }

    if (
      userFromEmail.resetTokenExpiry &&
      new Date().getTime() <
        new Date().setTime(
          userFromEmail.resetTokenExpiry.getTime() + 60 * 60 * 1000
        )
    ) {
      return true;
    }
    // Create randomBytes that will be used as a token
    const resetToken = Math.random().toString(36) + Math.random().toString(36);
    let currentTime = new Date();
    // 1 hour from now
    const resetTokenExpiry = currentTime.setTime(
      currentTime.getTime() + 60 * 60 * 1000
    );

    const updatedUser: User | null = await UserModel.findByIdAndUpdate(
      userFromEmail._id,
      { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry },
      { runValidators: true, new: true }
    );

    if (!updatedUser) {
      throw new ApolloError(
        `Failed to update User with resetToken and resetTokenExpiry.`
      );
    }

    // Send out reset email:
    try {
      sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'POS Password',
        html: `<body>
        <p>
        To reset your password, go to: http://${process.env.DOMAIN}/reports/password?token=${resetToken}</p>
        </body>`,
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Mutations                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a new user.
   * @param input CreateUserInput that stores the inputs needed to create a user.
   * @returns User object of the newly created User in a Promise.
   */
  async createUser(input: CreateUserInput): Promise<User | null> {
    const {
      firstName,
      lastName,
      email,
      role,
      cellphone,
      organization,
      organizationName,
      hourlyRate,
      code,
      address,
      payee,
    } = input;
    const lowerCaseEmail = email.toLowerCase();

    // Create randomBytes that will be used as a token
    const resetToken = Math.random().toString(36) + Math.random().toString(36);
    let currentTime = new Date();
    // 1 hour from now
    const resetTokenExpiry = currentTime.setTime(
      currentTime.getTime() + 60 * 60 * 1000
    );

    // Make call to typegoose model to create user.
    const user: User | null = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: lowerCaseEmail,
      role: role,
      cellphone,
      password: resetToken,
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry,
      organization: organization,
      organizationName: organizationName ? organizationName : '!Not An Org!',
      hourlyRate: hourlyRate,
      code: code ? code : Math.floor(Math.random() * 900000) + 100000,
      address: address ? address : 'None',
      payee: payee ? payee : 'None',
    });

    if (!user) {
      throw new ApolloError(`User creation failed!`);
    }

    // Send out the email:

    sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Welcome to Rewards Program',
      html: `<body>
      <p>Dear ${firstName}
      <br>
      To start using your account, please set your password at: http://${process.env.DOMAIN}/reports/password?token=${resetToken}</p>
      </body>`,
    });

    return user;
  }

  /**
   * Reset a User's password.
   * @param input ResetPasswordInput containing the resetToken and the password.
   * @returns The User with password resetted.
   */
  async resetPassword(input: ResetPasswordInput): Promise<User | null> {
    const { token, password } = input;

    if (!token) {
      throw new ApolloError(`Token must be specified!`);
    }

    const userFromResetToken: User | null = await UserModel.findOne({
      resetToken: token,
    });

    if (!userFromResetToken) {
      throw new ApolloError(`No User found with reset token!`);
    }

    if (
      new Date().getTime() >
      new Date().setTime(
        userFromResetToken.resetTokenExpiry.getTime() + 60 * 60 * 1000
      )
    ) {
      const updatedUser: User | null = await UserModel.findByIdAndUpdate(
        userFromResetToken._id,
        { resetToken: null, resetTokenExpiry: null }
      );
      throw new ApolloError(`Token has expired, please request new Token`);
    }

    const updatedUser: User | null = await UserModel.findByIdAndUpdate(
      userFromResetToken._id,
      { password: password, resetToken: null, resetTokenExpiry: null },
      { runValidators: true, new: true }
    );

    if (!updatedUser) {
      throw new ApolloError(`Failed to update password`);
    }

    return updatedUser;
  }

  /**
   * Update any field of a User (minus password). Exclusive to the owner.
   * @param input UpdateUserInput containing paramters to update.
   * @param context To update the logged in User in context in case the User being updated is the one logged in.
   * @returns The updated User or null.
   */
  async updateUser(
    input: UpdateUserInput,
    context: Context
  ): Promise<User | null> {
    const { _id, ...updateUserData } = input;

    const currentUserRole: String = context.user?.role!;

    // A User cannot update his/her own role.
    if (updateUserData.role && _id === context.user?._id.toString()) {
      throw new ApolloError('Current user cannot update his/her own Role.');
    }

    // Admin cannot make other people an Admin or Owner, only Owner can assign Admins.
    if (
      currentUserRole === 'Admin' &&
      (updateUserData.role === 'Owner' || updateUserData.role === 'Admin')
    ) {
      throw new ApolloError('Admins cannot set other users to Admin or Owner');
    }

    // Update the User.
    const updatedUser: User | null = await UserModel.findByIdAndUpdate(
      _id,
      updateUserData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedUser === null) {
      throw new ApolloError(`User with _id ${_id} not found`);
    }

    // Update the context
    if (_id === context.user?._id.toString()) {
      context.user = updatedUser;
    }

    return updatedUser;
  }
}
