import { mkdir } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { dirname, resolve, join, relative, basename, extname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import yaml from 'js-yaml';

// NOTE: Instead of this, I may use a 11ty.js template and EleventyFetch streaming... Any upside?

/**
 * 11ty plugin to copy files defined in keystatic yaml files to the output directory
 * @param {Object} eleventyConfig - The 11ty config object
 * @param {Object} pluginOptions - Plugin options
 * @param {string} [pluginOptions.inputGlob='_files/**\/index.yaml'] - Input glob pattern for YAML files (relative to input)
 * @param {string} [pluginOptions.outputDir='assets/files'] - Output directory for files (relative to output) 
 */
export default async function(eleventyConfig, pluginOptions = {}) {
  // Set defaults for plugin options
  const options = {
    inputGlob: '_files/**/index.yaml',
    outputDir: 'assets/files',
    ...pluginOptions
  };
  
  const inputDir = eleventyConfig.dir.input;
  const outputDir = eleventyConfig.dir.output;
  const outputFilesDir = join(outputDir, options.outputDir);
  
  // Create the output directory structure if it doesn't exist
  await mkdir(outputFilesDir, { recursive: true });
  
  // Define the pattern for yaml files
  const yamlPattern = join(inputDir, options.inputGlob);
  
  // Process each yaml file
  const yamlFiles = await glob(yamlPattern);
  
  for (const yamlFile of yamlFiles) {
    // Read and parse the yaml file
    const yamlContent = await readFile(yamlFile, 'utf-8');
    const yamlData = yaml.load(yamlContent);
    
    // Extract file information
    const { file, filename } = yamlData;
    if (!file || !filename) {
      console.warn(`Missing required file information in ${yamlFile}`);
      continue;
    }
    
    // Get absolute paths
    const sourceDir = dirname(yamlFile);
    const sourceFile = resolve(sourceDir, file);
    const extension = extname(file);
    
    // Check if filename already has the extension to prevent duplicates
    const destFilename = filename.toLowerCase().endsWith(extension.toLowerCase()) 
      ? filename 
      : `${filename}${extension}`;
      
    const destFile = join(outputFilesDir, destFilename);
    
    // Copy the file using streams
    try {
      await pipeline(
        createReadStream(sourceFile),
        createWriteStream(destFile)
      );
      
      console.log(`Copied: ${relative(process.cwd(), sourceFile)} → ${relative(process.cwd(), destFile)}`);
    } catch (err) {
      console.error(`Failed to copy file: ${relative(process.cwd(), sourceFile)}`);
      console.error(err);
    }
  }
  
  // Log completion
  console.log(`Finished processing ${yamlFiles.length} keystatic public file uploads`);
}
