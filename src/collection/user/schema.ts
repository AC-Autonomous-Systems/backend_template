import {
  getModelForClass,
  prop as Property,
  pre,
  Ref,
  ReturnModelType,
  index,
} from '@typegoose/typegoose';
import { IsEmail, MaxLength, Min, MinLength } from 'class-validator';
import { Field, Float, ID, Int, InputType, ObjectType } from 'type-graphql';
import bycrpt from 'bcrypt';

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: - Persistence Layer
 *          - Used by the business layer (services.ts) to interact with the database.
 *          - Also serves as the schema definition for GraphQL using TypeGraphQL
 */

/**
 * Model definition for the User document in MongoDB as well as the object definition for GraphQL.
 */
@pre<User>('save', async function () {
  // Hash the password before saving.
  if (!this.isModified('password')) {
    return;
  } else {
    const hashedPassword = await bycrpt.hashSync(this.password, 10);
    this.password = hashedPassword;
  }
})
@pre<User>('findOneAndUpdate', async function () {
  const updated = this.getUpdate();

  if (updated && 'password' in updated) {
    const hashedPassword = await bycrpt.hashSync(updated['password'], 10);
    this.update({ password: hashedPassword });
  }
})
@index({ email: 1 }, { unique: true })
@ObjectType() // Alert GraphQL user is an object.
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Property({ required: true, minlength: 1, maxlength: 35 })
  firstName: string;

  @Field(() => String)
  @Property({ required: true, default: '' })
  lastName: string;

  @Field(() => String)
  @Property({ required: true, unique: true, minlength: 1, maxlength: 60 })
  email: string;

  @Field(() => String)
  @Property({ required: true, minlength: 1 })
  cellphone: string;

  @Property({ required: true })
  password: string;

  @Field(() => String)
  @Property({
    required: true,
    enum: [
      'Customer',
      'Employee',
      'Counter',
      'Manager',
      'Admin',
      'SuperAdmin',
      'SuperAdmin',
      'Owner',
    ],
    default: 'Customer',
  })
  role: string;

  @Field(() => Boolean)
  @Property({ required: true, default: false })
  organization: boolean;

  @Field(() => String)
  @Property({ required: false, default: null })
  organizationName: string;

  @Field(() => Boolean)
  @Property({ required: true, default: true })
  active: boolean;

  @Field(() => String, { nullable: true })
  @Property({ default: null })
  resetToken: string;

  @Field(() => Date, { nullable: true })
  @Property({ default: null })
  resetTokenExpiry: Date;

  @Field(() => Float)
  @Property({ required: true, default: 0, min: 0 })
  hourlyRate: number;

  @Field(() => Int)
  @Property({ required: true, default: 312032 })
  code: number;

  @Field(() => String, { nullable: true })
  @Property({ minlength: 1 })
  address: string;

  @Field(() => String, { nullable: true })
  @Property({ minlength: 1 })
  payee: string;

  @Field(() => String, { nullable: true })
  @Property({ minlength: 1 })
  notes: string;
}

/**
 * Model export for TypeGoose
 */
export const UserModel: ReturnModelType<typeof User> =
  getModelForClass<typeof User>(User);

/**
 * Type definition for input when creating user for both Typescript & GraphQL.
 */
@InputType()
export class CreateUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  role: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  cellphone?: string;

  @Field(() => Boolean, { nullable: true })
  organization: boolean;

  @Field(() => String, { nullable: true })
  organizationName?: string;

  @Field(() => Float, { nullable: true })
  hourlyRate: number;

  @Field(() => Int, { nullable: true })
  code: number;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  payee: string;
}

/**
 * Type definition for input when creating user for both Typescript & GraphQL.
 */
@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  _id: String;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  cellphone?: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => Boolean, { nullable: true })
  organization?: boolean;

  @Field(() => String, { nullable: true })
  organizationName?: string;

  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @Field(() => Float, { nullable: true })
  @Min(0)
  hourlyRate: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  code: number;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  payee: string;
}

/**
 * Type definition for login input for both Typescript & GraphQL
 */
@InputType()
export class LoginUserInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

/**
 * Type definition for getting User's input for both Typescript & GraphQL
 */
@InputType()
export class GetUserInput {
  @Field(() => ID)
  _id: string;
}

/**
 * Type definition for requesting a reset password's input for both Typescript & GraphQL
 */
@InputType()
export class RequestResetPasswordInput {
  @Field(() => String)
  email: string;
}

/**
 * Type definition for resetting password's input for both Typescript & GraphQL
 */
@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  token: string;

  @MinLength(6, {
    message: 'Minimum password length must be 6 or more characters long',
  })
  @MaxLength(50, {
    message: 'Mmaximum password length must be 50 or less characters long',
  })
  @Field(() => String)
  password: string;
}
