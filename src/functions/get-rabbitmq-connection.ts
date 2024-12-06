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

  // Set up exchange
  await channel.assertExchange(exchange, 'direct', { durable: true });

  // Set up queue
  await channel.assertQueue(queue, { durable: true });

  // Bind queue to exchange with routing key
  await channel.bindQueue(queue, exchange, routingKey);

  // Set up consumer to forward messages to Elasticsearch
  channel.consume(queue, async (message) => {
    if (message) {
      try {
        const body = JSON.parse(message.content.toString());
        console.log('Received message:', body);

        channel.ack(message);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(message);
      }
    }
  });

  return { connection, channel, queue, exchange, routingKey };
}
