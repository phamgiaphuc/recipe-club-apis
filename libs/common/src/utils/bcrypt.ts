import * as bcrypt from "bcrypt";

export const hashData = (data: string, salt_round?: number): string => {
  const salt = bcrypt.genSaltSync(salt_round || 10);
  return bcrypt.hashSync(data, salt);
};

export const comapareData = (data: string, hash: string): boolean => {
  return bcrypt.compareSync(data, hash);
};
