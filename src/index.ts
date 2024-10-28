import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { getRedisClient } from './functions/get-redis-client';
import { google_token_checker } from './middleware/google-token-checker';
import { plan } from './routes/plan/plan';

const app = new OpenAPIHono();
const redisClient = await getRedisClient();

app.use(logger());

app.use(google_token_checker);

app.use(etag({ weak: true }));

app.route('/v1/plan', plan(redisClient));

app.get('/ui', swaggerUI({ url: 'swagger.json' }));

app.doc('swagger.json', {
	info: { title: 'INFO7255', version: 'v1' },
	openapi: '3.1.0',
});

export default app;
