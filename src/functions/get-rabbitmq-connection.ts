import amqplib from 'amqplib';

export type RabbitMQConnection = {
  connection: amqplib.Connection;
  channel: amqplib.Channel;
  queue: string;
  exchange: string;
  routingKey: string;
};

const queue = 'myQueue';
const exchange = 'myExchange';
const routingKey = 'my.routingKey';

export async function getRabbitMQConnection(): Promise<RabbitMQConnection> {
  let connection: amqplib.Connection | null = null;

  while (!connection) {
    try {
      connection = await amqplib.connect('amqp://localhost');
    } catch (e) {
      console.log('Failed to connect to RabbitMQ, retrying...');
      await Bun.sleep(500);
    }
  }

  console.log('Connected to RabbitMQ. http://localhost:15672');

  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'direct', { durable: true });

  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, routingKey);

  return { connection, channel, queue, exchange, routingKey };
}
