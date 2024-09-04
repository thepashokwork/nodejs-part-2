import fs, { ReadStream, WriteStream } from 'node:fs';
import { Transform, pipeline } from 'node:stream';
import path from 'node:path';

const readStream: ReadStream = fs.createReadStream(path.resolve('docs/text.txt'), 'utf8');
const writeStream: WriteStream = fs.createWriteStream(path.resolve('docs/example-file.txt'));

// Read Stream
readStream
  .on('data', (data: string | Buffer): void => {
    console.log('data: ', data);
  })
  .on('end', (): void => {
    console.log('File reading completed.');
  })
  .on('error', (error: Error): void => {
    console.error('An error happened: ', error);
  });

// Write Stream
writeStream.write('Hello, world!\n');
writeStream.write('This is a new line.\n');
writeStream.write('Another line was added.\n');

writeStream
  .on('error', (error: Error): void => {
    console.error('Error writing file:', error)
  });


// Readable and Writable Streams
readStream.pipe(writeStream);

readStream.on('error', (error: Error): void => {
  console.error('Error reading file:', error);
});

writeStream.on('error', (error: Error): void => {
  console.error('Error writing file:', error);
});

writeStream.on('finish', (): void => {
  console.log('File copied successfully.');
});

// Transform stream that converts text to uppercase
const uppercaseTransform: Transform = new Transform({
  transform(chunk, encoding, callback): void {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Use pipeline to handle the streams
pipeline(
  readStream,
  uppercaseTransform,
  writeStream,
  (error): void => {
    if (error) {
      console.error('Pipeline failed: ', error);
    } else {
      console.log('Transform stream completed.');
    }
  }
);

// Finalize the writing process
// writeStream.end((): void => {
//   console.log('Write stream completed.');
// });
