import { fields, collection } from '@keystatic/core';
import { PUBLIC_CONTENT_DIR } from '../variables.js';
import { imageDirs } from '../common.js';
import { prose } from '../prose.js';

export const pages = collection({
  label: 'Pages',
  slugField: 'name',
  path: `${PUBLIC_CONTENT_DIR}/pages/**`,
  entryLayout: 'form', // or 'content'
  format: { contentField: 'prose' },
  columns: ['name'],
  schema: {
    name: fields.slug({
      name: {
        label: 'Page Name',
        validation: {
          isRequired: true,
        }
      },
      slug: {
        label: 'URL',
        description: 'URL-friendly slug or path (may contain "/" and "-"). NOTE: The homepage must be called "index".',
        validation: {
          length: {
            min: 1,
          },
          pattern: {
            // REGEX:
            //   must contain only letters, numbers, dashes, and forward slashes
            //   and at least one letter or number
            //   and cannot start or finish with a slash
            regex: /^(?![\s-\/]*$)(?!\/)[a-z0-9-\/]*[a-z0-9-]$/,
            // regex: /^(?![\s-\/]*$)[a-z0-9-\/]+$/,
            message: 'URL must contain only letters, numbers, dashes, and forward slashes (not starting or ending with a slash or dash), and at least one letter or number'
          },
        },
      }
    }),
    prose: prose({ image: imageDirs('pages') }),
    eleventyNavigation: fields.object({
      add: fields.checkbox({ label: 'Add to main navigation', defaultValue: false }),
      title: fields.text({ label: 'Title', description: 'Default: Page Name' }),
      parent: fields.relationship({ label: 'Parent Page', collection: 'pages', description: 'Empty means top level nav' }),
      order: fields.number({ label: 'Order', description: 'Default: 0', defaultValue: 0 }),
    }, {
      label: 'Main Navigation',
      // description: 'Add this page to your main nav',
      layout: [3, 3, 3, 3],
    }),
    metadata: fields.object({
      title: fields.text({ label: 'Title', multiline: false, description: 'Default: Page Name' }),
      description: fields.text({ label: 'Description', multiline: true }),
      image: fields.image({
        label: 'Image',
        description: 'The default image used for sharing preview',
        ...imageDirs('pages'),
      }),
    },
    {
      label: 'Metadata',
      // description: 'The metadata of the page',
      // layout: [6, 6, 12],
    }),
  }
});

// const archiveFields = {
//     parentSlug: fields.relationship({ label: 'Parent Page', collection: 'pages' }),
//     parentSlug: fields.ignored(),
//     order: fields.number({ label: 'Page Order', description: 'For navigation or sorting links', defaultValue: 0 }),
//     nav: fields.conditional(
//       fields.checkbox({ label: 'Add to main navigation', defaultValue: false }),
//       {
//         true: fields.conditional(
//           fields.checkbox({ label: 'Customize navigation', defaultValue: false }),
//           {
//             true: fields.object({
//               // key: fields.text({ label: 'Key', description: 'The key of the navigation item [Default: Page Slug]' }),
//               title: fields.text({ label: 'Nav Title', description: 'Default: Page Name' }),
//               parent: fields.relationship({ label: 'Nav Parent', collection: 'pages', description: 'Default: Parent Page' }),
//               order: fields.number({ label: 'Nav Order', description: 'Default: Page Order', defaultValue: 0 }),
//             }),
//             false: fields.empty(),
//           }
//         ),
//         false: fields.empty(),
//       }
//     ),
// }

// const homepage = singleton({
//   label: 'Home Page',
//   path: `${PUBLIC_CONTENT_DIR}/index`,
//   format: { contentField: 'prose' },
//   schema: {
//     name: fields.text({
//       label: 'Page Name',
//       description: 'The name of the page',
//       validation: {
//         isRequired: true,
//       },
//       multiline: false
//     }),
//     ...proseSchema
//   }
// })