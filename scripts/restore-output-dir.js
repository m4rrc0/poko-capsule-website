import { OUTPUT_DIR, CACHE_DIR } from '../config.env.js';
import fs from 'fs';
import path from 'path';

/**
 * Script to restore the cached build output directory
 * Copies CACHE_DIR/OUTPUT_DIR to OUTPUT_DIR only if OUTPUT_DIR doesn't exist
 */

// Ensure the directory exists
const ensureDirectoryExists = directory => {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Check if directory is empty
const isDirectoryEmpty = directory => {
  if (!fs.existsSync(directory)) {
    return true;
  }
  
  const files = fs.readdirSync(directory);
  return files.length === 0;
};

// Copy directory recursively
const copyDirectory = (source, destination) => {
  // Create destination directory if it doesn't exist
  ensureDirectoryExists(destination);
  
  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  // Copy each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
};

// Main function
const restoreOutputDirectory = () => {
  const outputDirPath = path.resolve(process.cwd(), OUTPUT_DIR);
  const cacheDirPath = path.resolve(process.cwd(), CACHE_DIR);
  const cacheOutputDirPath = path.join(cacheDirPath, OUTPUT_DIR);
  
  // Check if OUTPUT_DIR already exists
  if (fs.existsSync(outputDirPath) && !isDirectoryEmpty(outputDirPath)) {
    console.log(`${OUTPUT_DIR} already exists and is not empty. No restoration needed.`);
    return;
  }
  
  // Check if cached output directory exists
  if (!fs.existsSync(cacheOutputDirPath)) {
    console.error(`Error: Cached ${OUTPUT_DIR} directory does not exist in ${CACHE_DIR}`);
    process.exit(1);
  }
  
  if (isDirectoryEmpty(cacheOutputDirPath)) {
    console.error(`Error: Cached ${OUTPUT_DIR} directory is empty, nothing to restore`);
    process.exit(1);
  }
  
  console.log(`Restoring ${OUTPUT_DIR} from ${path.join(CACHE_DIR, OUTPUT_DIR)}`);
  
  // Remove existing output directory if it exists but is empty
  if (fs.existsSync(outputDirPath) && isDirectoryEmpty(outputDirPath)) {
    console.log(`Removing existing empty ${OUTPUT_DIR} directory`);
    fs.rmSync(outputDirPath, { recursive: true, force: true });
  }
  
  // Copy CACHE_DIR/OUTPUT_DIR to OUTPUT_DIR
  try {
    copyDirectory(cacheOutputDirPath, outputDirPath);
    console.log(`Successfully restored ${OUTPUT_DIR} from cache`);
  } catch (error) {
    console.error(`Error restoring ${OUTPUT_DIR}:`, error);
    process.exit(1);
  }
};

// Execute the main function
restoreOutputDirectory();
