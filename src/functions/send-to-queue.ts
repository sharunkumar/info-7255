import type { Payload } from '../schema/schema';
import type { RabbitMQConnection } from './get-rabbitmq-connection';

export function sendToQueue(connecion: RabbitMQConnection, payload: Payload) {
  const { channel, exchange, routingKey } = connecion;
  const message = JSON.stringify(payload);
  channel.publish(exchange, routingKey, Buffer.from(message));
}
