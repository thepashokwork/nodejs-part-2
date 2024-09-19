import cluster, { Worker } from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import express, { Express } from 'express';

const cpus: number = os.cpus().length;
console.log('Number of cpus:', cpus); // Number of cpus: 10

const PORT: number = 3000;

const app: Express = express();

console.log(cluster.isMaster); // true
console.log(cluster.isWorker); // false

app.use((req, res, next) => {
  if (cluster.isMaster) {
    console.log(`Worker ${cluster?.worker?.id} handle request`);
  }

  next();
});

app.get('/', (req, res) => res.send('Cluster mode.'));

if (cluster.isMaster) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.log(
      `Worker ${worker.id} finished. Exit code: ${code}`
    );

    app.listen(PORT, () => {
      console.log(`Worker ${cluster?.worker?.id} launched`);
    });
  });
} else {
  app.listen(PORT, (): void => {
    console.log(`App is listening on ${PORT}`);
  });
}

cluster.on('fork', worker => {
  console.log('New cluster was created', cluster?.worker?.id || worker.id);
  /**
   * New cluster was created 1
   * New cluster was created 2
   * New cluster was created 3
   * New cluster was created 4
   * New cluster was created 5
   * New cluster was created 6
   * New cluster was created 7
   * New cluster was created 8
   * New cluster was created 9
   * New cluster was created 10
   * New cluster was created 11
   */
});

cluster.on('message', (message: string): void => {
  console.log(message);
});

if (cluster.isMaster) {
  const childProcess = cluster.fork();
  childProcess.send({ message: 'New child process was created' });
}

cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
  console.log(`Worker ${ worker.id } terminated with code: ${ code }`);
});
