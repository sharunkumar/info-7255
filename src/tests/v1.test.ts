import { testClient } from 'hono/testing';
import { v1 } from '../routes/v1';
import { describe, it, expect, afterAll } from 'bun:test';
import {
	getCreatePlanPayload,
	createPlanPayloadForPatch,
	patchPlanPayload,
	finalPatchedPlanResponse,
} from './_store';
import nullthrows from 'nullthrows';
import { getRedisClient } from '../functions/get-redis-client';
import { etag_internal } from '../functions/crypto';
import { PlanSchema, PatchPlanSchema } from '../schema/schema';

const v1TestClient = testClient(v1);

afterAll(async () => {
	(await getRedisClient()).flushAll();
});

describe('v1', () => {
	it('etag parity', async () => {
		const payload = getCreatePlanPayload();
		const response = await v1TestClient.plan.$post({ json: payload });
		expect(response.status).toEqual(201);
		const etag = nullthrows(response.headers.get('ETag'));
		expect(etag).toBeTruthy();
		const json = await response.json();
		const internalHash = await etag_internal(json, true);
		expect(internalHash).toEqual(etag);
	});

	it('plan create: etag should match get etag', async () => {
		const payload = getCreatePlanPayload();
		const response = await v1TestClient.plan.$post({ json: payload });
		expect(response.status).toEqual(201);

		const etag = nullthrows(response.headers.get('ETag'));
		expect(etag).toBeTruthy();

		const getResponse = await v1TestClient.plan[':id'].$get({
			param: { id: payload.objectId },
		});
		expect(getResponse.status).toEqual(200);
		const getEtag = nullthrows(getResponse.headers.get('ETag'));
		expect(getEtag).toBeTruthy();
		expect(getEtag).toEqual(etag);
	});

	it('plan get: If-None-Match', async () => {
		const payload = getCreatePlanPayload();
		const response = await v1TestClient.plan.$post({ json: payload });
		expect(response.status).toEqual(201);
		const etag = nullthrows(response.headers.get('ETag'));
		expect(etag).toBeTruthy();

		const getResponse = await v1TestClient.plan[':id'].$get(
			{ param: { id: payload.objectId } },
			{ headers: { 'If-None-Match': etag } },
		);
		expect(getResponse.status).toEqual(304);
	});

	it('plan patch: ETag Required', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await v1TestClient.plan.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const patchResponse = await v1TestClient.plan[':id'].$patch({
			param: { id: payload.objectId },
			json: PatchPlanSchema.parse(patchPlanPayload),
		});
		expect(patchResponse.status).toEqual(412);
	});

	it('plan patch: Invalid ETag', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await v1TestClient.plan.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const patchResponseInvalidEtag = await v1TestClient.plan[':id'].$patch(
			{
				param: { id: payload.objectId },
				json: PatchPlanSchema.parse(patchPlanPayload),
			},
			{ headers: { 'If-Match': 'invalid' } },
		);
		expect(patchResponseInvalidEtag.status).toEqual(412);
	});

	it('plan patch: If-Match', async () => {
		const payload = PlanSchema.parse(createPlanPayloadForPatch);
		const createResponse = await v1TestClient.plan.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const etag = nullthrows(createResponse.headers.get('ETag'));
		expect(etag).toBeTruthy();

		const patchResponse = await v1TestClient.plan[':id'].$patch(
			{
				param: { id: payload.objectId },
				json: PatchPlanSchema.parse(patchPlanPayload),
			},
			{ headers: { 'If-Match': etag } },
		);
		expect(patchResponse.status).toEqual(200);

		const { success, data, error } = PlanSchema.safeParse(
			await patchResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data).toEqual(PlanSchema.parse(finalPatchedPlanResponse));

		const deleteResponse = await v1TestClient.plan[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse.status).toEqual(204);

		const patchNotFoundResponse = await v1TestClient.plan[':id'].$patch(
			{
				param: { id: payload.objectId },
				json: PatchPlanSchema.parse(patchPlanPayload),
			},
			{ headers: { 'If-Match': etag } },
		);
		expect(patchNotFoundResponse.status).toEqual(404);
	});

	it('plan patch: If-Match with GET etag', async () => {
		const payload = getCreatePlanPayload();
		const response = await v1TestClient.plan.$post({ json: payload });
		expect(response.status).toEqual(201);
		const getResponse = await v1TestClient.plan[':id'].$get({
			param: { id: payload.objectId },
		});
		expect(getResponse.status).toEqual(200);
		const getEtag = nullthrows(getResponse.headers.get('ETag'));
		expect(getEtag).toBeTruthy();

		const patchResponse = await v1TestClient.plan[':id'].$patch(
			{
				param: { id: payload.objectId },
				json: PatchPlanSchema.parse(patchPlanPayload),
			},
			{ headers: { 'If-Match': getEtag } },
		);
		expect(patchResponse.status).toEqual(200);
	});
});
