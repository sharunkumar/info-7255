import type { ZodSchema } from 'zod';
import zu from 'zod_utilz';
import type { RedisClient } from './get-redis-client';

export async function getRedisValue<T>(
	client: RedisClient,
	key: string,
	schema: ZodSchema<T>,
) {
	const value = await client.get(key);
	return zu.SPR(
		schema.safeParse(zu.SPR(zu.stringToJSON().safeParse(value)).data),
	).data;
}
