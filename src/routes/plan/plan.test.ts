import { expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { getRedisClient } from '../../functions/get-redis-client';
import { GetPlanSchema, type Plan } from '../../schema/schema';
import { plan } from './plan';

const redisClient = await getRedisClient();
const planTestClient = testClient(plan(redisClient));

await redisClient.flushAll();

const createPayload: Plan = {
	planCostShares: {
		deductible: 2000,
		_org: 'example.com',
		copay: 23,
		objectId: '1234vxc2324sdf-501',
		objectType: 'membercostshare',
	},
	linkedPlanServices: [
		{
			linkedService: {
				_org: 'example.com',
				objectId: '1234520xvc30asdf-502',
				objectType: 'service',
				name: 'Yearly physical',
			},
			planserviceCostShares: {
				deductible: 10,
				_org: 'example.com',
				copay: 0,
				objectId: '1234512xvc1314asdfs-503',
				objectType: 'membercostshare',
			},
			_org: 'example.com',
			objectId: '27283xvx9asdff-504',
			objectType: 'planservice',
		},
		{
			linkedService: {
				_org: 'example.com',
				objectId: '1234520xvc30sfs-505',
				objectType: 'service',
				name: 'well baby',
			},
			planserviceCostShares: {
				deductible: 10,
				_org: 'example.com',
				copay: 175,
				objectId: '1234512xvc1314sdfsd-506',
				objectType: 'membercostshare',
			},
			_org: 'example.com',
			objectId: '27283xvx9sdf-507',
			objectType: 'planservice',
		},
	],
	_org: 'example.com',
	objectId: '12xvxc345ssdsds-508',
	objectType: 'plan',
	planType: 'inNetwork',
	creationDate: '12-12-2017',
};

it('end-to-end plan testing', async () => {
	const createResponse = await planTestClient.index.$post({
		json: createPayload,
	});
	expect(createResponse.status).toEqual(201);

	const res2 = await planTestClient[':id'].$get({
		param: {
			id: createPayload.objectId,
		},
	});
	expect(res2.status).toEqual(200);

	const { success, data, error } = GetPlanSchema.safeParse(await res2.json());
	console.error(error);
	expect(success).toBeTruthy();
	expect(data?.plan).toEqual(createPayload);
});
