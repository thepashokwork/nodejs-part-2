import { Buffer, Blob } from 'node:buffer';
import fs from 'node:fs';

// Create a new Buffer
const buffer = Buffer.alloc(10);

// Logs: 10
console.log(buffer.length);

const buf2 = Buffer.from([1, 2, 3]); // Logs: Buffer:  <Buffer 01 02 03>

console.log('hex: ', buf2.toString('hex')); // Logs: hex:  010203

console.log('base64: ', buf2.toString('base64')); // Logs: base64:  AQID

const uint32array = new Uint32Array(buf2); // Logs: Uint32Array(3) [ 1, 2, 3 ]

buf2.write('Hello world!');

const buf3 = Buffer.from('ABC');

//Get byte length
console.log('Byte length:', buf3.byteLength);

// Get original value from buffer
console.log(buf3.toString()); // ABC

const json = buf3.toJSON().data;

console.log('json:', json); // json: [ 65, 66, 67 ]

console.log('Is Buffer:', Buffer.isBuffer(buf3)); // Is Buffer: true

fs.readFile('../package.json', 'utf8', (err, data) => {
  const blob = new Blob([data], { type: 'application/pdf' });
  console.log(blob); // Blob { size: 278, type: 'application/pdf' }
  console.log(blob.size); // 278
});

console.log('Concat:', Buffer.concat([buffer, buf2, buf3]).toString()); // Concat: HelABC

console.log('Is Encoding:', Buffer.isEncoding('test')); // Is Encoding: false
console.log('Is Encoding:', Buffer.isEncoding('utf8')); // Is Encoding: true

