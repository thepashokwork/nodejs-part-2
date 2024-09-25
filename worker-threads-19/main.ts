import { Worker, isMainThread } from 'node:worker_threads';
import path from 'node:path';

isMainThread
  ? console.log('-> main.ts: This is the main thread') // -> main.ts: This is the main thread
  : console.log('-> main.ts: This is a worker thread');

/**
 * Gets sum of two numbers
 *
 * @param { WorkerData } workerData
 * @returns { Promise<void> }
 */
function main(workerData: WorkerData): Promise<void> {
  return new Promise((resolve, reject): void => {
    const worker = new Worker(path.resolve('worker-threads-19/worker.ts'), { workerData });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code: number): void => {
      if (code !== 0) {
        reject(new Error(`-> Worker stopped with exit code ${ code }`));
      }
    });
  });
}

main({ a: 5, b: 10 })
  .then((sum) => console.log(`-> Result: ${ sum }`)) // Result: 15
  .catch((error: Error) => console.log(error));

export interface WorkerData {
  a: number;
  b: number;
}
