import { sha1 } from 'hono/etag';

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
	const hash = await sha1(new TextEncoder().encode(String(JSON.stringify(data))));
	return weak ? `W/"${hash}"` : `"${hash}"`;
}
