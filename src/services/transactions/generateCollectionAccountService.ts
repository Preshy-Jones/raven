import { User } from "../../database/models/User";
import { VirtualAccount } from "../../database/models/VirtualAccount";
import { NotFoundError, ServiceError } from "../../errors";
import { RavenBankService } from "../../lib/raven";

const generateCollectionAccount = async (userId: number, amount) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Generate collection account
  const ravenBank = new RavenBankService();

  let collectionAccount;

  try {
    const response = await ravenBank.generateCollectionAccount(
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
      amount
    );
    await VirtualAccount.createForUser(userId, {
      accountNumber: response.data.account_number,
      accountName: `${user.firstName} ${user.lastName}`,
      bankName: response.data.bank,
      amount,
    });

    collectionAccount = response.data;
  } catch (error) {
    throw new ServiceError("Error generating collection account");
  }

  return collectionAccount;
};

export default generateCollectionAccount;
