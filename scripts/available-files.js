import { glob } from 'glob';
import { existsSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Function to format file size
const formatSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

// Log environment information
console.log('\n=== BUILD ENVIRONMENT INFORMATION ===');
console.log(`Node.js version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Script directory: ${__dirname}`);
console.log(`Root directory: ${rootDir}`);
console.log(`Environment variables:`);
// Log only relevant environment variables for debugging
const relevantEnvVars = [
  'NODE_ENV',
  'CF_PAGES',
  'CF_PAGES_BRANCH',
  'CF_PAGES_COMMIT_SHA',
  'CF_PAGES_URL',
  'NETLIFY',
  'CONTEXT',
  'VERCEL',
  'VERCEL_ENV',
  'CI',
  'PUBLIC_CONTENT_DIR'
];

for (const key of relevantEnvVars) {
  if (process.env[key]) {
    console.log(`  ${key}: ${process.env[key]}`);
  }
}

// Function to scan and log files
const scanAndLogFiles = () => {
  console.log('\n=== AVAILABLE FILES AND DIRECTORIES ===');
  
  // Get all files and directories
  const allPaths = glob.sync('**/*', { 
    cwd: rootDir,
    dot: true,  // Include dot files
    ignore: [
      'node_modules/**',  // Exclude node_modules for brevity
      '.git/**', // Exclude git
      '.bun/install/cache/**' // Exclude bun cache for brevity
    ],
    nodir: false  // Include directories
  });
  
  // Sort paths by type (directories first) and then alphabetically
  allPaths.sort((a, b) => {
    const aIsDir = existsSync(join(rootDir, a)) && statSync(join(rootDir, a)).isDirectory();
    const bIsDir = existsSync(join(rootDir, b)) && statSync(join(rootDir, b)).isDirectory();
    
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });
  
  // Count files by type
  const fileTypes = {};
  let totalFiles = 0;
  let totalDirs = 0;
  let totalSize = 0;
  
  // Log each path with its type and size
  allPaths.forEach(path => {
    const fullPath = join(rootDir, path);
    let type, size;
    
    try {
      const stats = statSync(fullPath);
      const isDir = stats.isDirectory();
      
      if (isDir) {
        type = 'dir';
        size = '-';
        totalDirs++;
      } else {
        type = 'file';
        size = formatSize(stats.size);
        totalFiles++;
        totalSize += stats.size;
        
        // Count file types
        const ext = path.split('.').pop().toLowerCase() || 'no-extension';
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      }
      
      console.log(`[${type}] ${path} ${size !== '-' ? `(${size})` : ''}`); 
    } catch (error) {
      console.error(`Error accessing ${path}: ${error.message}`);
    }
  });
  
  // Log summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total directories: ${totalDirs}`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Total size: ${formatSize(totalSize)}`);
  
  console.log('\n=== FILE TYPES ===');
  Object.entries(fileTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`${ext}: ${count} files`);
    });
  
  // Log cache directories specifically
  console.log('\n=== CACHE DIRECTORIES ===');
  const cacheDirs = [
    'dist',
    '.cache',
    '.astro',
    'node_modules/.astro',
    'node_modules/.astro/file-hashes.json',
    '.wrangler',
    '.netlify',
    '.vercel',
    'node_modules/.cache',
    '.npm',
    '.bun/install/cache/file-hashes.json',
    '.bun/file-hashes.json',
  ];
  
  cacheDirs.forEach(cacheDir => {
    const fullPath = join(rootDir, cacheDir);
    if (existsSync(fullPath)) {
      console.log(`✅ ${cacheDir} exists`);
      
      // Get files in cache directory
      try {
        const cacheFiles = glob.sync('**/*', { 
          cwd: fullPath,
          dot: true,
          nodir: true,
          maxDepth: 2 // Limit depth to avoid too much output
        });
        
        if (cacheFiles.length > 0) {
          console.log(`  Contains ${cacheFiles.length} files/directories (showing max 10):`);
          cacheFiles.slice(0, 10).forEach(file => {
            console.log(`  - ${file}`);
          });
          if (cacheFiles.length > 10) {
            console.log(`  ... and ${cacheFiles.length - 10} more`);
          }
        } else {
          console.log('  Directory is empty');
        }
      } catch (error) {
        console.error(`  Error reading cache directory: ${error.message}`);
      }
    } else {
      console.log(`❌ ${cacheDir} does not exist`);
    }
  });
};

// Run the scan
scanAndLogFiles();
