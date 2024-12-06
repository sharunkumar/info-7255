export async function hash(password: string) {
  return await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 4,
  });
}

export async function verify(user_password: string, db_password: string) {
  return await Bun.password.verify(user_password, db_password);
}

export async function etag_internal(data: unknown, weak: boolean) {
  const hasher = new Bun.CryptoHasher('sha1');
  hasher.update(JSON.stringify(data));
  const hash = hasher.digest('hex');
  return weak ? `W/"${hash}"` : `"${hash}"`;
}
