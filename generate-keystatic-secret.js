import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const envFile = path.join(process.cwd(), '.env');

if (!fs.existsSync(envFile)) {
  //   create .env file
  fs.writeFileSync(envFile, '');
}

const fileContent = fs.readFileSync(envFile, 'utf8');
const newSecret = crypto.randomBytes(64).toString('hex');
// Replace secret in .env file
// const updatedContent = fileContent.replace(/^KEYSTATIC_SECRET=.*/m, `KEYSTATIC_SECRET=${newSecret}`);
// Add secret to a new line
const updatedContent = `${fileContent}\nKEYSTATIC_SECRET=${newSecret}\n`;
fs.writeFileSync(envFile, updatedContent);
console.log('New KEYSTATIC_SECRET generated and updated in .env file')
