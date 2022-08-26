import { sign } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../../../db-config";

export const token = (currentTokenId: string, id: string, email: string) => {
  const payload: { id: string; email: string; userId: string } = {
    id: currentTokenId,
    userId: id,
    email
  };
  const accessToken = sign(payload, SECRET_JWT_KEY);

  return {
    accessToken
  };
};
