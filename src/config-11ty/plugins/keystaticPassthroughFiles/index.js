import { PUBLIC_WORKING_DIR, FILES_OUTPUT_DIR } from '../../../../config.env.js';
import { extname } from 'node:path';

export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy(
    { [`${PUBLIC_WORKING_DIR}/_files`]: FILES_OUTPUT_DIR },
    {
      // debug: true,
      filter: [
        '**/*.*', // WARNING: We won't preserve files without an extension
        '!library/**', // NOTE: Needed because folder names in library might have a '.' so we exclude them explicitely
        'library/**/file.*', // ... and only keep the 'file.ext' file
      ],
      rename: function(filePath) {
        // Only modify the file name when in the 'library' sub-folder
        if (!filePath.startsWith('library/')) {
          return filePath;
        }
        // Skip modification if the file is not called 'file.ext'
        if (!/\/file\./.test(filePath)) {
          return filePath;
        }
        const extension = extname(filePath);
        const regex = new RegExp(`(${extension})?\/file${extension}$`);
        const destFilePath = filePath.replace(regex, extension);
        return destFilePath;
      },
    }
  );
}
