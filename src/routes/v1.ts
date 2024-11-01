import { Hono } from 'hono';
import { plan } from './plan/plan';
import { getRedisClient } from '../functions/get-redis-client';
import { etag } from 'hono/etag';

const redisClient = await getRedisClient();

export const v1 = new Hono()
	.use(etag({ weak: true }))
	.route('/plan', plan(redisClient));
