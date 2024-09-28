import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { User } from './user';

const PORT: number = 3000;

/**
 * Asynchronously retrieves users from a JSON file.
 *
 * @async
 * @function getUsers
 * @returns {Promise<Buffer>} A promise that resolves to the contents of the users JSON file as a Buffer.
 *
 * @throws {Error} Will throw an error if the file cannot be read.
 */
async function getUsers(): Promise<Buffer> {
  return readFile(path.resolve(path.join('hw-lesson-21', 'users.json')));
}

/**
 * Asynchronously updates the users JSON file with the provided user data.
 *
 * @async
 * @function updateUser
 * @param {Array<User>} users - An array of user objects to be written to the JSON file.
 * @returns {Promise<void>} A promise that resolves when the users have been successfully written to the file.
 *
 * @throws {Error} Will throw an error if the file cannot be written.
 */
async function updateUser(users: Array<User>): Promise<void> {
  return writeFile(path.resolve(path.join('hw-lesson-21', 'users.json')), JSON.stringify(users, null, 2));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Handle GET request to fetch users
    if (req.method === REQUEST_METHODS.GET && req.url === '/api/users') {
      const data: string = (await getUsers()).toString('utf8');
      const users: Array<User> = JSON.parse(data);

      res.statusCode = 200;

      res.end(JSON.stringify(users));
    }

    // Handle POST request to update a user
    if (req.method === REQUEST_METHODS.POST && req.url?.includes('/api/users/')) {
      const paramName: string = req.url?.split('/')[3];
      const data: string = (await getUsers()).toString('utf8');

      let body: string = '';

      req.on('data', (chunk): void => {
        body += chunk.toString();
      });

      req.on('end', async (): Promise<unknown> => {
        const users: Array<User> = JSON.parse(data);
        const userIndex: number = users.findIndex((user: User) => user.name === paramName);

        // Parse the incoming body
        let parsedBody: { name?: string; surname?: string; age?: number; address?: string };
        try {
          parsedBody = JSON.parse(body);
        } catch (error) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: 'Invalid JSON format in request body' }));
        }

        const { name, surname, age, address } = parsedBody;

        // Check for missing required fields
        if (!name || !surname || !age || !address) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: 'Missing required fields: name, surname, age, and address' }));
        }

        if (userIndex !== -1) {
          users[userIndex] = { name, surname, age, address };

          await updateUser(users);

          res.statusCode = 200;
          res.end(JSON.stringify({
            message: 'User was updated successfully!',
            updatedUser: users[userIndex],
            users,
          }));
        } else {
          res.statusCode = 404;
          res.end('User not found!');
        }
      });
    }
  } catch (error: unknown) {
    // Internal Server Error
    res.statusCode = 500;

    res.end(JSON.stringify({ message: 'Internal Server Error', error }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log('Server is listening on port:', PORT);
});

enum REQUEST_METHODS {
  GET = 'GET',
  POST = 'POST',
}
