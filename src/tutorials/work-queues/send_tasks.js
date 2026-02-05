const amqp = require('amqplib');

// Parse command-line arguments
const numTasks = parseInt(process.argv[2]) || 10;
const difficulty = process.argv[3] || 'mixed';

// Validate difficulty
const validDifficulties = ['easy', 'medium', 'hard', 'mixed'];
if (!validDifficulties.includes(difficulty)) {
  console.error(`Invalid difficulty: ${difficulty}`);
  console.error(`Valid options: ${validDifficulties.join(', ')}`);
  process.exit(1);
}

/**
 * Generate a task message with dots based on difficulty level
 * Dots determine processing time in seconds (1 dot = 1 second)
 */
function generateTaskMessage(taskNum, difficulty) {
  const dotCounts = {
    easy: () => Math.floor(Math.random() * 2) + 1,    // 1-2 dots
    medium: () => Math.floor(Math.random() * 3) + 2,  // 2-4 dots
    hard: () => Math.floor(Math.random() * 5) + 4,    // 4-8 dots
    mixed: () => Math.floor(Math.random() * 8) + 1    // 1-8 dots
  };

  const dots = '.'.repeat(dotCounts[difficulty]());
  return `Task ${taskNum}${dots}`;
}

async function sendTasks() {
  console.log(`\n [*] Preparing to send ${numTasks} tasks (difficulty: ${difficulty})`);

  let connection;

  try {
    // Connect to RabbitMQ
    console.log(' [*] Connecting to RabbitMQ...');
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'task_queue';

    // Assert queue (durable, persistent messages)
    await channel.assertQueue(queue, { durable: true });

    console.log(' [*] Sending tasks concurrently...\n');

    // Generate all task messages
    const tasks = Array.from({ length: numTasks }, (_, i) =>
      generateTaskMessage(i + 1, difficulty)
    );

    const startTime = Date.now();

    // Send all tasks concurrently using Promise.all()
    await Promise.all(
      tasks.map(msg => {
        const sent = channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
        if (sent) {
          console.log(` [x] Sent: ${msg}`);
        }
        return Promise.resolve(sent);
      })
    );

    const duration = Date.now() - startTime;

    // Close connection
    await channel.close();
    await connection.close();

    // Display summary statistics
    console.log(`\n [✓] Successfully sent ${numTasks} tasks to ${queue}`);
    console.log(` [i] Duration: ${duration}ms`);
    console.log(` [i] Average: ${(duration / numTasks).toFixed(2)}ms per task\n`);

  } catch (error) {
    console.error('\n [✗] Error:', error.message);
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        // Ignore close errors
      }
    }
    process.exit(1);
  }
}

// Execute
sendTasks().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
