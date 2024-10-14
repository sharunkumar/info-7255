import { googleAuth } from '@hono/oauth-providers/google';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import nullthrows from 'nullthrows';
import { getRedisClient } from './functions/get-redis-client';
import { plan } from './routes/plan/plan';

const app = new OpenAPIHono();
const redisClient = await getRedisClient();
const GOOGLE_CALLBACK_URL = '/v1/google';
const redirect_uri = `http://localhost:3000${GOOGLE_CALLBACK_URL}`;

app.use(logger());

app.use(
	GOOGLE_CALLBACK_URL,
	googleAuth({
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		scope: ['openid', 'email', 'profile'],
		redirect_uri,
	}),
);

app.get(GOOGLE_CALLBACK_URL, async (c) => {
	// const session = readSession
	const token = nullthrows(c.get('token'), 'No Token');
	const grantedScopes = nullthrows(
		c.get('granted-scopes'),
		'No Granted Scopes',
	);
	const user = nullthrows(c.get('user-google'), 'No User');
	const response = { token, grantedScopes, user };
	return c.json(response);
});

app.use(etag({ weak: true }));

app.route('/v1/plan', plan(redisClient));

app.get('/ui', swaggerUI({ url: 'swagger.json' }));

app.doc('swagger.json', {
	info: { title: 'INFO7255', version: 'v1' },
	openapi: '3.1.0',
});

export default app;
