import { afterAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { getRedisClient } from '../functions/get-redis-client';
import { GetPlanSchema } from '../schema/schema';
import { plan } from '../routes/plan/plan';
import {
	getCreatePlanPayload,
	patchPlanPayload,
	createPlanPayloadForPatch,
	finalPatchedPlanResponse,
} from './_store';

const redisClient = await getRedisClient();
const planTestClient = testClient(plan(redisClient));

afterAll(async () => {
	await redisClient.flushAll();
});

describe('plan', () => {
	it('create', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const { success, data, error } = GetPlanSchema.safeParse(
			await createResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data?.plan).toEqual(payload);

		const createResponse2 = await planTestClient.index.$post({ json: payload });
		expect(createResponse2.status).toEqual(409);
	});

	it('get by id', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const planById = await planTestClient[':id'].$get({
			param: { id: payload.objectId },
		});
		expect(planById.status).toEqual(200);

		const { success, data, error } = GetPlanSchema.safeParse(
			await planById.json(),
		);
		expect(success).toBeTruthy();
		expect(data?.plan).toEqual(payload);
	});

	it('delete', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const { success, data, error } = GetPlanSchema.safeParse(
			await createResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data?.plan).toEqual(payload);

		const deleteResponse = await planTestClient[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse.status).toEqual(204);
	});

	it('patch', async () => {
		const payload = createPlanPayloadForPatch;
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const patchResponse = await planTestClient[':id'].$patch({
			param: { id: payload.objectId },
			json: patchPlanPayload,
		});
		expect(patchResponse.status).toEqual(200);

		const { success, data, error } = GetPlanSchema.safeParse(
			await patchResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data?.plan).toEqual(finalPatchedPlanResponse);

		const deleteResponse = await planTestClient[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse.status).toEqual(204);
	});
});
