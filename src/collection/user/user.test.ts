import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import axios from "axios";
import {
  removeAllCollections,
  startTestEnvironment,
} from "../../util/jest-helper";

dotenv.config();

jest.setTimeout(100000);

describe("User", () => {
  beforeAll(async () => {
    await startTestEnvironment();
  });

  afterAll(async () => {
    await removeAllCollections();
  });
  describe("Create User", () => {
    it("Create Dummy User", async () => {
      const CREATE_USER = `
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            email
            _id
            firstName
            lastName
            role
          }
        }
      `;

      const newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: "pasdss",
      };

      const createUserResult = await axios.post(
        `http://localhost:${process.env.PORT_TESTING}/graphql`,
        {
          query: CREATE_USER,
          variables: {
            input: newUser,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const createdUser = createUserResult.data.data.createUser;

      expect(createdUser.firstName).toBe(newUser.firstName);
      expect(createdUser.lastName).toBe(newUser.lastName);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.role).toBe("Customer");
    });
  });
});
