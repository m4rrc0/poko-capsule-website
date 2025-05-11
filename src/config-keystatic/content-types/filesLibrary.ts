import { fields, collection } from '@keystatic/core';
import { PUBLIC_CONTENT_DIR, FILES_LIBRARY_OUTPUT_DIR } from '../variables.js';
// import { filesDir } from '../common.js';

let filename = '';
let extension = '';

export const filesLibrary = collection({
  label: 'Files Library',
  slugField: 'filename',
  path: `${PUBLIC_CONTENT_DIR}/_files/library/*/`,
  entryLayout: 'form', // or 'content'
  schema: {
    file: fields.file({
      label: 'File',
      // description: 'File to be uploaded',
      // ...fileDirs('uploads'),
      // publicPath: fileDirs('uploads').publicPath,
      publicPath: `/${FILES_LIBRARY_OUTPUT_DIR}/`,
      transformFilename: (originalFilename: string) => {
        const lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          filename = originalFilename.substring(0, lastDotIndex);
          extension = originalFilename.substring(lastDotIndex + 1);
        } else {
          filename = originalFilename;
          extension = '';
        }
        return originalFilename
      }
    }),
    filename: fields.slug({
      name: {
        label: 'Label',
      },
      slug: {
        label: 'File Name',
        description: `URL-friendly file name (may contain '-', '_', or '.').`,
        generate: (name) => {
          const fullName = filename ? `${filename}.${extension}` : '';
          // 1. Compare (1) filename + extension with (2) name. If the (2) matches the beginning of (or the full) (1) return (1)
          if (fullName.startsWith(name)) {
            return fullName;
          }
          // 2. If not, return (1)-(2) (with extension at the end)
          return `${filename}-${name}.${extension}`;
        },
        validation: {
          length: {
            min: 1,
          },
          pattern: {
            // REGEX:
            //   must contain only letters, numbers, dashes, and underscores
            //   and at least one character
            regex: /^[a-zA-Z0-9_\-.]+$/,
            message: 'File name must contain only letters, numbers, dashes, underscores or dots, and at least one character'
          },
        },
      }
    })
  }
});
