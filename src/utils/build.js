import { glob } from 'glob'
import chalk from 'chalk';
import fs from 'fs/promises';

export const consoleInfo = (message) => {
    console.info(chalk.blue.bold('INFO:'), chalk.blue(message));
}

export const loadFiles = async (globParam) => {
  // Read all files in the content directory using glob
  const filePaths = await glob(globParam);

  // Filter out directories and only keep files
  const filePromises = filePaths.map(async (filePath) => {
    try {
      const stats = await fs.stat(filePath);
    
      if (stats.isFile()) {
        // Read the content of each file
        const content = await fs.readFile(filePath, 'utf8');
        return {
          path: filePath,
          content
        };
      }
      return null;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  });

  // Wait for all file reading promises to resolve
  const files = (await Promise.all(filePromises)).filter(Boolean);

  return files;
}

export const readFirstExistingFile = async (paths) => {
    for (const path of paths) {
      try {
        return await fs.readFile(path, 'utf8');
      } catch (e) {
        // Continue to next path
      }
    }
    return null;
};

// export const tryImport = async (paths) => {
//     for (const path of paths) {
//       try {
//         return await import(path);
//       } catch (error) {
//         // Continue to next path
//       }
//     }
//     return undefined;
// };