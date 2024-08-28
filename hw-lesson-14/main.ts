/**
 * Additional info:
 *
 * Methods should work with absolute paths for windows and linux systems.
 *
 * Parameter "options" - should be optional.
 *
 * options.replace - should contain path to file.
 * When this property exists - method must overwrite this file if the file
 * exists otherwise must be created a new file.
 *
 * Parameter "delete" - should be optional.
 *
 * options.delete - can be "true" or "false".
 * When this property exists and is "true" then the
 * current file which should be encoded or decoded will be
 * deleted after the process.
 */

import path from 'node:path';
import { Buffer } from 'node:buffer';
import fs, { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

import { Options } from './options.interface.js';

/**
 * Gets file paths based on the given parameters.
 *
 * @param {string} pathToFile - The initial path to the file.
 * @param {Options} [options] - Optional settings to customize path resolution.
 * @returns {Object} An object containing resolved file paths.
 * @returns {string} returns.absolutePathToFile - The absolute path of the input file.
 * @returns {string} returns.outputFilePath - The output path, potentially with a UUID added.
 */
function getFilePaths(
  pathToFile: string,
  options?: Options
): {
  absolutePathToFile: string;
  outputFilePath: string;
} {
  const absolutePathToFile: string = path.resolve(pathToFile);
  const finalPathToFile: string = options?.replace ? path.resolve(options.replace) : absolutePathToFile;
  const outputFilePath: string = options?.replace ? path.resolve(options.replace) : addUuidToFileName(finalPathToFile);

  return {
    absolutePathToFile,
    outputFilePath,
  };
}

/**
 * Checks if a file exists.
 *
 * @param {string} pathToFile - The path to the file.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file exists, false otherwise.
 */
async function isFileExists(pathToFile: string): Promise<boolean> {
  try {
    await access(pathToFile, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch {
    console.log('File does not exist.');
    return false;
  }
}

/**
 * Generates a new file name by appending a UUID before the file extension.
 * The new file name is also prefixed with the 'docs' folder.
 *
 * @param {string} pathToFile - The original file path, including the file name and extension.
 * @returns {string} - The new file path with the UUID added before the file extension and prefixed with the 'docs' folder.
 *
 * Example:
 * If the input path is 'example.txt', the function might return 'docs/example-123e4567-e89b-12d3-a456-426614174000.txt'.
 */
function addUuidToFileName(pathToFile: string): string {
  const uuid: string = uuidv4();
  const extname: string = path.extname(pathToFile);
  const basename: string = path.basename(pathToFile, extname);
  const outputName: string = `${basename}-${uuid}${extname}`;

  return path.resolve(path.join('docs', outputName));
}

/**
 * Encodes content to base64 and creates a new file with the encoded text.
 *
 * @param { string } pathToFile - Path to the file to be processed
 * @param { Options } options - Options for file processing
 * @returns { void }
 */
async function encodeToBase64(pathToFile: string, options?: Options): Promise<void> {
  const isExists: boolean = await isFileExists(pathToFile);

  if (!isExists) {
    return;
  }

  const { absolutePathToFile, outputFilePath } = getFilePaths(pathToFile, options);

  const content: Buffer = await readFile(pathToFile);

  if (!content) {
    console.log('The file is not found or the file is empty.');
    return;
  }

  const encodedContent: string = Buffer.from(content.toString()).toString('base64');

  try {
    await writeFile(outputFilePath, encodedContent);
  } catch (error: unknown) {
    throw new Error(`An error has occurred: ${ error }`);
  }

  if (options?.delete) {
    void unlink(absolutePathToFile);
  }
}

void encodeToBase64('docs/text.txt');
// void encodeToBase64('docs/text.txt', { replace: 'docs/text1.txt', delete: false });
// void encodeToBase64('docs/text.txt', { replace: 'docs/text1.txt', delete: true });

/**
 * Decodes content from base64 and creates a new file with the decoded text.
 *
 * @param { string } pathToFile - Path to the file to be processed
 * @param { Options } options - Options for file processing
 * @returns { void }
 */
async function decodeFromBase64(pathToFile: string, options?: Options): Promise<void> {
  const isExists: boolean = await isFileExists(pathToFile);

  if (!isExists) {
    return;
  }

  const { absolutePathToFile, outputFilePath } = getFilePaths(pathToFile, options);

  const content: Buffer = await readFile(pathToFile);

  if (!content) {
    console.log('The file is not found or the file is empty.');
    return;
  }

  const decodedContent: string = Buffer.from(content.toString(), 'base64').toString('utf8');

  try {
    await writeFile(outputFilePath, decodedContent);
  } catch (error: unknown) {
    throw new Error(`An error has occurred: ${ error }`);
  }

  if (options?.delete) {
    void unlink(absolutePathToFile);
  }
}

void decodeFromBase64('docs/encodedText.txt');
// void decodeFromBase64('docs/encodedText.txt', { replace: 'docs/decodedText.txt', delete: false });
// void decodeFromBase64('docs/encodedText.txt', { replace: 'docs/decodedText.txt', delete: true });
