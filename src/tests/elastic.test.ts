import { describe, expect, it } from 'bun:test';
import { getElasticsearchClient, index } from '../functions/get-elasticsearch-client';
import { getCreatePlanPayload } from './_store';

describe('Elasticsearch', () => {
	it('should connect to Elasticsearch', async () => {
		const client = await getElasticsearchClient();
		expect(client).toBeDefined();
	});
	it('should index sample plan', async () => {
		const client = await getElasticsearchClient();
		const body = getCreatePlanPayload();

		const response = await client.index({ index, body });
		expect(response.body.result).toBe('created');
	});
});
