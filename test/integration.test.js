const { expect } = require('chai');
const amqp = require('amqplib');
const { fork } = require('child_process');

describe('Integration Test', function() {
  this.timeout(10000); // Increase timeout for async operations

  let connection, channel;

  before(async () => {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('queue1');
    await channel.assertQueue('queue2');
  });

  after(async () => {
    await channel.close();
    await connection.close();
  });

  it('should process messages between two servers', (done) => {
    const server1 = fork('./test/server1.js');
    const server2 = fork('./test/server2.js');

    const expectedMessage = 'finalMessage';

    server2.on('message', (msg) => {
      if (msg === expectedMessage) {
        server1.kill();
        server2.kill();
        done();
      }
    });

    // Send initial message to queue1
    channel.sendToQueue('queue1', Buffer.from('initialMessage'));
  });
});