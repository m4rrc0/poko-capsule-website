import { OUTPUT_DIR, CACHE_DIR } from '../config.env.js';
import fs from 'fs';
import path from 'path';

/**
 * Script to cache the build output directory
 * Copies the OUTPUT_DIR to CACHE_DIR/OUTPUT_DIR
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
const cacheDistDirectory = () => {
  const outputDirPath = path.resolve(process.cwd(), OUTPUT_DIR);
  const cacheDirPath = path.resolve(process.cwd(), CACHE_DIR);
  const cacheOutputDirPath = path.join(cacheDirPath, OUTPUT_DIR);
  
  console.log(`Caching ${OUTPUT_DIR} to ${path.join(CACHE_DIR, OUTPUT_DIR)}`);
  
  // Check if OUTPUT_DIR exists and is not empty
  if (!fs.existsSync(outputDirPath)) {
    console.error(`Error: ${OUTPUT_DIR} directory does not exist`);
    process.exit(1);
  }
  
  if (isDirectoryEmpty(outputDirPath)) {
    console.error(`Error: ${OUTPUT_DIR} directory is empty, nothing to cache`);
    process.exit(1);
  }
  
  // Ensure CACHE_DIR exists
  ensureDirectoryExists(cacheDirPath);
  
  // Remove existing cached output directory if it exists
  if (fs.existsSync(cacheOutputDirPath)) {
    console.log(`Removing existing cached output directory: ${cacheOutputDirPath}`);
    fs.rmSync(cacheOutputDirPath, { recursive: true, force: true });
  }
  
  // Copy OUTPUT_DIR to CACHE_DIR/OUTPUT_DIR
  try {
    copyDirectory(outputDirPath, cacheOutputDirPath);
    console.log(`Successfully cached ${OUTPUT_DIR} to ${path.join(CACHE_DIR, OUTPUT_DIR)}`);
  } catch (error) {
    console.error(`Error caching ${OUTPUT_DIR}:`, error);
    process.exit(1);
  }
};

// Execute the main function
cacheDistDirectory();
