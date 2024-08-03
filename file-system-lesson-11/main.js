const fs = require('fs');

const PATH = './example.txt';

const readStream = fs.createReadStream(PATH);

function readFileSync() {
  try {
    const content = fs.readFileSync(PATH, 'utf8');
    // logs: Hello World!
    console.log(content);
  }
  catch (error) {
    // Error: ENOENT: no such file or directory, open './example1.txt'
    console.log(error);
  }
}

readFileSync();

function getFolderFiles() {
  // Logs: Files:  [ 'example.txt', 'main.js' ]
  try {
    const files = fs.readdirSync('./', 'utf8');
    console.log('Files: ', files);
  }
  catch (error) {
    console.log('Error: ', error);
  }
}

getFolderFiles();

function createReadStream() {
  readStream
    .on('data', (data) => {
      // Creates a buffer
      // logs: data <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>
      console.log('data', data);
      // logs: data Hello World!
      console.log('data', data.toString());
    })
    .on('error', (error) => {
      // Logs an error
      console.log('error', error);
    });
}

createReadStream();

function createAndUpdateFile() {
  // Createa a new file "example1.txt" with a new data
  try {
    fs.writeFileSync('./example1.txt', 'New Hello World!', 'utf8');
  }
  catch (error) {
    console.log('Error:', error);
  }

  // Updates already existing file
  try {
    fs.appendFileSync('./example.txt', '\n Some new Data', 'utf8');
  }
  catch (error) {
    console.log('Error:', error);
  }
}

createAndUpdateFile();

// Create a new directory
// fs.mkdirSync('./docs/files', {
//   recursive: true,
// });
// console.log('Directory was created!');

// Delete a file
// fs.unlinkSync('./example1.txt');
// console.log('Deleted');

// Logs: False, as "files" directory doesn't exists
// try {
//   const isFileExists = fs.existsSync('./files');
//   console.log('File exists!', isFileExists);
// } catch (error) {
//   throw new Error(error);
// }