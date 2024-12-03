import { Client } from '@elastic/elasticsearch';
import type { MappingTypeMapping } from '@elastic/elasticsearch/api/types';

export const index = 'plan';

const mappings: MappingTypeMapping = {
	properties: {
		planType: { type: 'keyword' },
		creationDate: {
			type: 'date',
			format: 'dd-MM-yyyy',
		},
		plan_join: {
			type: 'join',
			relations: {
				plan: ['planCostShares', 'linkedPlanServices'],
				linkedPlanServices: ['linkedService', 'planserviceCostShares'],
			},
		},
		planCostShares: {
			type: 'nested',
			properties: {
				deductible: { type: 'integer' },
				_org: { type: 'keyword' },
				copay: { type: 'integer' },
				objectId: { type: 'keyword' },
				objectType: { type: 'keyword' },
			},
		},
		linkedPlanServices: {
			type: 'nested',
			properties: {
				linkedService: {
					type: 'nested',
					properties: {
						_org: { type: 'keyword' },
						objectId: { type: 'keyword' },
						objectType: { type: 'keyword' },
						name: { type: 'text' },
					},
				},
				planserviceCostShares: {
					type: 'nested',
					properties: {
						deductible: { type: 'integer' },
						_org: { type: 'keyword' },
						copay: { type: 'integer' },
						objectId: { type: 'keyword' },
						objectType: { type: 'keyword' },
					},
				},
				_org: { type: 'keyword' },
				objectId: { type: 'keyword' },
				objectType: { type: 'keyword' },
			},
		},
	},
};

export async function getElasticsearchClient() {
	try {
		const client = new Client({
			node: 'http://localhost:9200',
			auth: {
				apiKey: 'cUk1aWlwTUJPU05UYzVGRUtqNW86VHU5aURuelBSOGV4MUJfa05VOEV0UQ==',
			},
		});

		// Test the connection
		await client.ping();
		// console.log('Elasticsearch cluster is running');

		// // Check if index exists
		const indexExists = await client.indices.exists({ index });

		if (!indexExists.body) {
			await client.indices.create({
				index,
				body: {
					mappings,
				},
			});
			console.log(`Index created: ${index}`);
		}

		return client;
	} catch (error) {
		console.error('Error connecting to Elasticsearch:');
		throw error;
	}
}
