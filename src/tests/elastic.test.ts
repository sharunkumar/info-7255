import { afterAll, describe, expect, it } from 'bun:test';
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
  it('should ensure that index exists', async () => {
    const client = await getElasticsearchClient();
    const response = await client.indices.exists({ index });
    expect(response.body).toBeTruthy();
  });
  it('should create the index if it does not exist', async () => {
    const client1 = await getElasticsearchClient();
    await client1.indices.delete({ index });
    const client2 = await getElasticsearchClient();
    const response = await client2.indices.exists({ index });
    expect(response.body).toBeTruthy();
  });
});

afterAll(async () => {
  const client = await getElasticsearchClient();
  await client.indices.delete({ index });
});
