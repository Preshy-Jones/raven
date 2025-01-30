import { omit } from "lodash";
import { ConflictError } from "../../errors";
import { User } from "../../database/models/User";
import { RavenBankService } from "../../lib/raven";
import { SignUpInput } from "../../validation/user.schema";
import { Knex } from "knex";
import { Wallet } from "../../database/models/Wallet";

const SignUpService = async (
  input: SignUpInput["body"],
  trx?: Knex.Transaction
) => {
  const { email, password, firstName, lastName } = input;
  const userExists = await User.findByEmail(input.email);
  // return userExists;
  if (userExists) {
    throw new ConflictError("Email is already registered");
  }

  const user = await User.create(
    {
      email: input.email!,
      password: input.password!,
      firstName: input.firstName!,
      lastName: input.lastName!,
      phoneNumber: input.phoneNumber!,
    },
    trx
  );

  await Wallet.createForUser(user.id!, trx);
  // const ravenBank = new RavenBankService();
  // const collectionAccount = await ravenBank.generateCollectionAccount(
  //   user.id!.toString(),
  //   email,
  //   firstName,
  //   lastName
  // );
  // await User.updateRavenAccount(user.id!, collectionAccount.accountNumber, trx);

  return user;
};

export default SignUpService;
