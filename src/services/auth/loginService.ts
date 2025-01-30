import { AuthenticationError, NotFoundError } from "../../errors";

// import { omit } from "lodash";

import config from "../../config";
import { omit } from "lodash";
import { generateJWTToken } from "../../utils";
import { User } from "../../database/models/User";

export const loginService = async (email: string, password: string) => {
  const user = await validatePassword({ email, password });
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = await generateJWTToken(
    payload,
    config.jwt.secret,
    config.jwt.expiresIn
  );

  return {
    accessToken: token,
  };
};

const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isValid = await User.verifyPassword(user, password);

  if (!isValid) {
    throw new AuthenticationError("Invalid credential");
  }

  return user;
};

export default loginService;
