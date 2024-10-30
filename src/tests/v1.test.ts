import { testClient } from 'hono/testing';
import { v1 } from '../routes/v1';
import { describe, it, expect } from 'bun:test';
import { getCreatePlanPayload } from './_store';
import nullthrows from 'nullthrows';

const v1TestClient = testClient(v1);

describe('v1', () => {
	it('plan get: If-None-Match', async () => {
		const payload = getCreatePlanPayload();
		const response = await v1TestClient.plan.$post({ json: payload });
		expect(response.status).toEqual(201);
		const etag = response.headers.get('ETag');
		expect(etag).toBeTruthy();

		const getResponse = await v1TestClient.plan[':id'].$get(
			{ param: { id: payload.objectId } },
			{ headers: { 'If-None-Match': nullthrows(etag) } },
		);
		expect(getResponse.status).toEqual(304);
	});
});
