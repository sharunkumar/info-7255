import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { google_token_checker } from './middleware/google-token-checker';
import { v1 } from './routes/v1';

const app = new OpenAPIHono();

app.use(logger());

app.use(google_token_checker);

app.route('/v1', v1);

app.get('/ui', swaggerUI({ url: 'swagger.json' }));

app.doc('swagger.json', {
	info: { title: 'INFO7255', version: 'v1' },
	openapi: '3.1.0',
});

export default app;
