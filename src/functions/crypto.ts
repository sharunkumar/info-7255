import * as bcrypt from "bcrypt";

const saltRounds = 3;

export async function hash(password: string) {
  return await bcrypt.hash(password, saltRounds);
}

export async function verify(user_password: string, db_password: string) {
  return await bcrypt.compare(user_password, db_password);
}
