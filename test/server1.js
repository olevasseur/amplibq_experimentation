const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('queue1');

  channel.consume('queue1', (msg) => {
    if (msg !== null) {
      const message = msg.content.toString();
      console.log(`Server 1 received: ${message}`);
      // Process message and send to queue2
      channel.sendToQueue('queue2', Buffer.from('processedMessage'));
      channel.ack(msg);
    }
  });
})();