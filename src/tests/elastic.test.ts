import { describe, expect, it } from 'bun:test';
import { getElasticsearchClient } from '../functions/get-elasticsearch-client';

describe('Elasticsearch', () => {
	it('should connect to Elasticsearch', async () => {
		const client = await getElasticsearchClient();
		expect(client).toBeDefined();
	});
});
