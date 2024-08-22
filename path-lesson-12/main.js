import path from 'node:path';

// Output: For macOS: package.json
console.log(path.basename('../package.json'));

// Output: package
console.log(path.basename('../package.json', '.json'));

// Output: package.json
console.log(path.win32.basename('../package.json'));

// Output: index.html
console.log(path.posix.basename('/templates/header/index.html'));

// Output: .ts
console.log(path.extname('test-file.directive.ts'));

// Output: false
console.log(path.isAbsolute('../package.json'));

// Output: ../path-lesson-12/main.js
console.log(path.join('../', 'path-lesson-12', 'main.js'));

/*
  Output:

  {
    root: '',
    dir: '../path-lesson-12',
    base: 'main.js',
    ext: '.js',
    name: 'main'
  }
 */
console.log(path.parse('../path-lesson-12/main.js'));