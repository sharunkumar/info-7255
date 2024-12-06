import { getRabbitMQConnection } from '../functions/get-rabbitmq-connection';
import { PayloadSchema } from '../schema/schema';

const { channel, queue } = await getRabbitMQConnection();

channel.consume(queue, async (message) => {
  if (message) {
    try {
      const body = JSON.parse(message.content.toString());
      const { success, data } = PayloadSchema.safeParse(body);
      if (success) {
        const {
          operation,
          data: { objectId, objectType },
        } = data;
        console.log('Received message:', operation, objectId, objectType);
      } else {
        console.log('Received unknown message:', body);
      }
      channel.ack(message);
    } catch (error) {
      console.error('Error processing message:');
      console.error(error);
      channel.nack(message);
    }
  }
});
