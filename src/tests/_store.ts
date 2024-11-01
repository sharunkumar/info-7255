import { PatchPlanSchema, type PatchPlan, type Plan } from '../schema/schema';
import { default as createPlanPayloadForPatch } from '../schema/samples/plan.patch.1.create.sample.json';
import { default as patchPlanPayload } from '../schema/samples/plan.patch.2.sample.json';
import { default as finalPatchedPlanResponse } from '../schema/samples/plan.patch.3.get.sample.json';

export const getCreatePlanPayload = (): Plan => ({
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
	objectId: crypto.randomUUID(),
	objectType: 'plan',
	planType: 'inNetwork',
	creationDate: '12-12-2017',
});

export const getPatchPlanPayload = (createPayload: Plan): PatchPlan => {
	return {
		...PatchPlanSchema.parse(patchPlanPayload),
		objectId: createPayload.objectId,
	};
};

export {
	createPlanPayloadForPatch,
	patchPlanPayload,
	finalPatchedPlanResponse,
};
