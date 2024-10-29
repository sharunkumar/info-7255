import { testClient } from 'hono/testing';
import { v1 } from '../routes/v1';
import { describe, it, expect } from 'bun:test';

const v1TestClient = testClient(v1);
describe('v1', () => {
	it('should return 200', async () => {
		const response = await v1TestClient.plan.$get();
		expect(response.status).toEqual(200);
	});
});
