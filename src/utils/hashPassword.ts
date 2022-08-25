import { compare, hash } from "bcrypt";

export const hashPassword = (password: string) => {
  return hash(password, 12);
};

export const verifyPassword = (
  password: string,
  storedPassword: string
): Promise<boolean> => {
  return compare(password, storedPassword);
};
