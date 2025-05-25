import { fields } from '@keystatic/core'
import { PUBLIC_WORKING_DIR, globalSettings, globalPartials } from './variables.js';

export const collections = ['pages', ...(globalSettings?.collections || [])];

// Globally defined partials (looked up at build time from 'src/config-markdoc/partials)
// NOTE: No need to apply the prefix here. It is applied in the Partial Tag when discriminant == 'global'
const globalPartialSelectOptions = (globalPartials || []).map(p => ({ label: p, value: p }));

export const imageDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_images/${dir}`,
    publicPath: `/_images/${dir}/`,
})

export const fileDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_files/${dir}`,
    publicPath: `/assets/files/${dir}/`,
})

export const collectionSelect = fields.select({
    label: 'Collection',
    // description: 'The type of link.',
    options: collections.map(c => ({ label: c, value: c })),
    defaultValue: 'pages',
    validation: {
        isRequired: true,
    },
})

export const partialSelect = fields.conditional(
  // First, define a `select` field with all the available "conditions"
  fields.select({
    label: 'Partial File',
    options: [
      { label: 'Global Source', value: 'global' },
      { label: 'Personal library', value: 'personal' },
      { label: 'Custom file name', value: 'custom' },
    ],
    defaultValue: 'global',
  }),
  // Then, provide a schema for each condition
  {
    global: fields.select({
      options: globalPartialSelectOptions,
      defaultValue: globalPartialSelectOptions[0].value,
    }),
    personal: fields.relationship({
      collection: 'partials'
    }),
    custom: fields.text({}),
  }
)
