import { createClient } from 'redis';

export async function getRedisClient() {
	console.info('Connecting to Redis...');
	const client = await createClient({ url: process.env.REDIS_URL })
		.on('error', (err) => console.log('Redis Client Error', err))
		.connect();
	console.info('Connected to Redis');
	return client;
}

export type RedisClient = Awaited<ReturnType<typeof getRedisClient>>;
