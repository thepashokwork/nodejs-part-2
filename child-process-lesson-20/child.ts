process.on('message', (message) => {
  console.log(`Message from parent process: ${message}`);
  // @ts-ignore
  process.send('Hello from child process!');
});
