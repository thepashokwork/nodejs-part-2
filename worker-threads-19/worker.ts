import { isMainThread, parentPort, workerData } from 'node:worker_threads';

import { WorkerData } from './main';

isMainThread
  ? console.log('-> worker.ts: This is the main thread')
  : console.log('-> worker.ts: This is a worker thread'); // -> worker.ts: This is a worker thread

console.log('-> worker.ts - worker data: ', workerData); // -> worker.ts - worker data:  { a: 5, b: 10 }

const { a, b }: WorkerData = workerData;

parentPort?.postMessage(a + b);
