import { Hono } from 'hono';
import { plan } from './plan/plan';
import { getRedisClient } from '../functions/get-redis-client';
import { etag } from 'hono/etag';
import { getRabbitMQConnection } from '../functions/get-rabbitmq-connection';
import { getElasticsearchClient } from '../functions/get-elasticsearch-client';

const redisClient = await getRedisClient();
const elasticClient = await getElasticsearchClient();
const rabbitMQConnection = getRabbitMQConnection();

export const v1 = new Hono().use(etag({ weak: true })).route('/plan', plan(redisClient));
