import type { RabbitMQConnection } from './get-rabbitmq-connection';

export type Payload = {
  operation: 'create' | 'update' | 'delete';
  data: unknown;
};

export function sendToQueue(connecion: RabbitMQConnection, payload: Payload) {
  const { channel, exchange, routingKey } = connecion;
  const message = JSON.stringify(payload.data);
  channel.publish(exchange, routingKey, Buffer.from(message));
}
