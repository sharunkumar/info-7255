import amqplib from 'amqplib';

export async function getRabbitMQConnection() {
	let connection: amqplib.Connection | null = null;

	while (!connection) {
		try {
			connection = await amqplib.connect('amqp://localhost');
		} catch (e) {
			console.log('Failed to connect to RabbitMQ, retrying...');
			await Bun.sleep(500);
		}
	}

	console.log('Connected to RabbitMQ');

	return connection;
}
