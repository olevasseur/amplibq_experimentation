const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('queue2');

  channel.consume('queue2', (msg) => {
    if (msg !== null) {
      const message = msg.content.toString();
      console.log(`Server 2 received: ${message}`);
      // Process message and send final message to parent process
      process.send('finalMessage');
      channel.ack(msg);
    }
  });
})();