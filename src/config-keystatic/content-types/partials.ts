import { fields, collection } from '@keystatic/core';
import { PUBLIC_CONTENT_DIR, PUBLIC_PARTIALS_DIR } from '../variables.js';
import { imageDirs } from '../common.js';
import { prose } from '../prose.js';

export const partials = collection({
  label: 'Partials',
  slugField: 'name',
  path: `${PUBLIC_CONTENT_DIR}/${PUBLIC_PARTIALS_DIR}/**`,
  entryLayout: 'content', // or 'form'
  format: { contentField: 'prose' },
  columns: ['name'],
  schema: {
    name: fields.slug({
      name: {
        label: 'Partial name',
        validation: {
          isRequired: true,
        }
      },
      slug: {
        label: 'Partial file name',
        description: 'filename-friendly slug or path (may contain "/", "-", "_").',
        validation: {
          length: {
            min: 1,
          },
          pattern: {
            // REGEX:
            //   must contain only letters, numbers, dashes, underscores, and forward slashes
            //   and at least one letter or number
            //   and cannot start or finish with a slash
            regex: /^(?![\s-\/]*$)(?!\/)[a-z0-9-_/]*[a-z0-9-_/]$/,
            // regex: /^(?![\s-\/]*$)[a-z0-9-\/]+$/,
            message: 'URL must contain only letters, numbers, dashes, underscores, and forward slashes (not starting or ending with a slash or dash), and at least one letter or number'
          },
        },
      }
    }),
    prose: prose({ image: imageDirs('pages') }),
  }
});
