import { JwtPayload } from "../strategies/json-auth-strategy";
import { sign } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../../../db-config";

export const createToken = async (user: JwtPayload) => {
  const payload: JwtPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  };

  return {
    accessToken: sign(payload, SECRET_JWT_KEY)
  };
};
