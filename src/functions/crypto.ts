export async function hash(password: string) {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });
}

export async function verify(user_password: string, db_password: string) {
  return await Bun.password.verify(user_password, db_password);
}
