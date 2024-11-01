import { afterAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { getRedisClient } from '../functions/get-redis-client';
import { PlanSchema } from '../schema/schema';
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

		const { success, data, error } = PlanSchema.safeParse(
			await createResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data).toEqual(payload);

		const createResponse2 = await planTestClient.index.$post({ json: payload });
		expect(createResponse2.status).toEqual(409);
	});

	it('get all', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const allPlansResponse = await planTestClient.index.$get();
		expect(allPlansResponse.status).toEqual(200);
		const allPlans = await allPlansResponse.json();
		expect(allPlans.length).toBeGreaterThan(0);
	});

	it('get by id', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const planById = await planTestClient[':id'].$get({
			param: { id: payload.objectId },
		});
		expect(planById.status).toEqual(200);

		const { success, data, error } = PlanSchema.safeParse(
			await planById.json(),
		);
		expect(success).toBeTruthy();
		expect(data).toEqual(payload);
	});

	it('delete', async () => {
		const payload = getCreatePlanPayload();
		const createResponse = await planTestClient.index.$post({ json: payload });
		expect(createResponse.status).toEqual(201);

		const { success, data, error } = PlanSchema.safeParse(
			await createResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data).toEqual(payload);

		const deleteResponse = await planTestClient[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse.status).toEqual(204);

		const deleteResponse2 = await planTestClient[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse2.status).toEqual(404);
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

		const { success, data, error } = PlanSchema.safeParse(
			await patchResponse.json(),
		);
		expect(success).toBeTruthy();
		expect(data).toEqual(finalPatchedPlanResponse);

		const deleteResponse = await planTestClient[':id'].$delete({
			param: { id: payload.objectId },
		});
		expect(deleteResponse.status).toEqual(204);
	});
});
