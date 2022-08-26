import { v4 as uuid } from "uuid";

export const generateToken = async (obj): Promise<string> => {
  const token = uuid();

  obj.accessToken = token;
  await obj.save();
  return token;
};
