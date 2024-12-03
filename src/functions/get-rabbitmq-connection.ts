import amqplib from 'amqplib';

type RabbitMQConnection = {
	connection: amqplib.Connection;
	queue: string;
	exchange: string;
	routingKey: string;
};

export async function getRabbitMQConnection(): Promise<RabbitMQConnection> {
	const queue = 'myQueue';
	const exchange = 'myExchange';
	const routingKey = 'my.routingKey';

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

	return { connection, queue, exchange, routingKey };
}
