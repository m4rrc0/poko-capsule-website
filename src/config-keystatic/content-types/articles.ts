import { fields, collection } from '@keystatic/core';
// export const markdocConfig = fields.markdoc.createMarkdocConfig({});
import { PUBLIC_WORKING_DIR } from '../variables.js';

import { imageDirs } from '../common.js';

export const articles = collection({
  label: 'Articles',
  slugField: 'title',
  path: `${PUBLIC_WORKING_DIR}/articles/*`,
  entryLayout: 'content',
  format: { contentField: 'prose' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    prose: fields.markdoc({
      label: 'Prose Content',
      options: {
        image: {
          ...imageDirs('articles'),
        },
      },
    }),
  },
})