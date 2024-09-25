import {
  exec,
  spawn,
  fork,
  ExecException,
  ChildProcessWithoutNullStreams,
  ChildProcess,
  Serializable,
} from 'node:child_process';
import path from 'node:path';

const childSpawn: ChildProcessWithoutNullStreams = spawn('ls', ['-la']);
const childFork: ChildProcess = fork(path.resolve(path.join('child-process-lesson-20', 'child.js')));

// Exec method
exec('ls', (error: ExecException | null, stdout: string, stderr: string): void => {
  if (error) {
    console.error(`Error: ${ error.message }`);
    return;
  }

  if (stderr) {
    console.error(`Stderr: ${ stderr }`);
    return;
  }

  console.log(`Result: ${ stdout }`);
});


// Spawn method
childSpawn.stdout.on('data', (data): void => {
  console.log(`Result: ${data}`);
});

childSpawn.stderr.on('data', (error: ChildProcess): void => {
  console.error(`Error: ${ error }`);
});

childSpawn.on('close', (code: number | null): void => {
  console.log(`The process has been finished with code: ${code}`);
});


// // Fork method usages
childFork.on('message', (message: Serializable): void => {
  console.log(`Message from child process: ${ message }`);
});

childFork.send('Hello from parent process!');




// Logs result:
/**
 * Result: total 120
 * drwxr-xr-x  20 Paul  staff    640 Sep 25 22:49 .
 * drwxr-xr-x  10 Paul  staff    320 Aug 25 13:58 ..
 * drwxr-xr-x  15 Paul  staff    480 Sep 25 22:47 .git
 * -rw-r--r--   1 Paul  staff   2072 Aug 20 22:16 .gitignore
 * drwxr-xr-x  10 Paul  staff    320 Sep 25 22:50 .idea
 * -rw-r--r--   1 Paul  staff   1071 Aug  3 22:21 LICENSE
 * drwxr-xr-x   3 Paul  staff     96 Aug 30 20:20 buffer-lesson-13
 * drwxr-xr-x   4 Paul  staff    128 Sep 25 22:50 child-process-lesson-20
 * drwxr-xr-x   3 Paul  staff     96 Sep 19 22:02 cluster-lesson-18
 * drwxr-xr-x   5 Paul  staff    160 Sep  3 18:01 docs
 * drwxr-xr-x   4 Paul  staff    128 Sep  9 18:57 events-lesson-16
 * drwxr-xr-x   4 Paul  staff    128 Aug 21 21:35 file-system-lesson-11
 * drwxr-xr-x   3 Paul  staff     96 Sep 12 19:39 http-lesson-17
 * drwxr-xr-x   4 Paul  staff    128 Aug 28 13:21 hw-lesson-14
 * drwxr-xr-x  87 Paul  staff   2784 Sep 12 19:41 node_modules
 * -rw-r--r--   1 Paul  staff  41094 Sep 12 19:41 package-lock.json
 * -rw-r--r--   1 Paul  staff    832 Sep 25 22:49 package.json
 * drwxr-xr-x   3 Paul  staff     96 Aug 21 21:33 path-lesson-12
 * drwxr-xr-x   3 Paul  staff     96 Sep  3 18:00 stream-lesson-15
 * -rw-r--r--   1 Paul  staff    336 Aug 25 13:53 tsconfig.json
 *
 * The process has been finished with code: 0
 * Result: LICENSE
 * buffer-lesson-13
 * child-process-lesson-20
 * cluster-lesson-18
 * docs
 * events-lesson-16
 * file-system-lesson-11
 * http-lesson-17
 * hw-lesson-14
 * node_modules
 * package-lock.json
 * package.json
 * path-lesson-12
 * stream-lesson-15
 * tsconfig.json
 *
 *
 * (node:24633) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
 * --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));'
 * (Use `node --trace-warnings ...` to show where the warning was created)
 *
 * Message from parent process: Hello from parent process!
 * Message from child process: Hello from child process!
 *
 */
