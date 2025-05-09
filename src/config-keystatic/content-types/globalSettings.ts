import { fields, singleton } from '@keystatic/core';
import { PUBLIC_CONTENT_DIR } from '../variables.js';
import { langCodeValidation, langCodeDescription } from './languages.js';

export const globalSettings = singleton({
  label: 'Global Settings',
  path: `${PUBLIC_CONTENT_DIR}/_data/globalSettings`,
  // path: `#workingDir/_data/globalSettings`,
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
    lang: fields.text({
      label: 'Default language code',
      description: langCodeDescription,
      validation: langCodeValidation,
      defaultValue: 'en',
    }),
    collections: fields.multiselect({
      label: 'Collections',
      description: 'Select the collections you want to add to your website.',
      options: [
        // List of possible canonical collections. Based on schema.org Entities
        { label: 'Articles', value: 'articles' },
        { label: 'Organizations', value: 'organizations' },
        { label: 'People', value: 'people' },
        { label: 'Events', value: 'events' },
        { label: 'Products', value: 'products' },
        { label: 'Services', value: 'services' },
        { label: 'Creative Works', value: 'creativeWorks' },
        { label: 'Places', value: 'places' },
        { label: 'Local Businesses', value: 'localBusinesses' },
      ],
      defaultValue: [],
    }),
    htmlHead: fields.text({
      label: 'HTML Head',
      description: 'Some HTML to be injected in the <head> of every page',
      multiline: true
    }),
    cssHead: fields.text({
      label: 'CSS Head',
      description: 'Some CSS to be injected in the <head> of every page',
      multiline: true
    })
  }
})