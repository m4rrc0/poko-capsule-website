import { fields, singleton } from '@keystatic/core';
import { PUBLIC_WORKING_DIR } from '../variables.js';
import { langCodeValidation, langCodeDescription } from './languages.js';

export const globalSettings = singleton({
  label: 'Global Settings',
  path: `${PUBLIC_WORKING_DIR}/_data/globalSettings`,
  format: { data: 'yaml' },
  entryLayout: 'form',
  schema: {
    siteName: fields.text({
      label: 'Site Name',
      validation: {
        isRequired: true,
      },
      multiline: false
    }),
    htmlHead: fields.text({
      label: 'HTML Head',
      description: 'Some HTML to be injected in the <head> of every page',
      multiline: true
    }),
    lang: fields.text({
      label: 'Default language code',
      description: langCodeDescription,
      validation: langCodeValidation,
      defaultValue: 'en',
    }),
    contentTypes: fields.multiselect({
      label: 'Content Types',
      description: 'Select the content types you want to add to your website.',
      options: [
        { label: 'Articles', value: 'articles' },
      ],
      defaultValue: [],
    }),
  }
})