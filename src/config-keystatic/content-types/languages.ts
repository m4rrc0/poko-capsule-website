import slugify from '@sindresorhus/slugify'
import { fields, collection } from '@keystatic/core';
// export const markdocConfig = fields.markdoc.createMarkdocConfig({});
import { PUBLIC_CONTENT_DIR } from '../variables.js';

// import { imageDirs } from '../common.js';

// REGEX:
//  Exactly 2 lowercase letters at the start
//  An optional dash with 4 letters for Chinese (Simplified): "zh-Hans" & (Traditional): "zh-Hant"
//  An optional dash with 2 uppercase letters
export const langCodeRegex = /^[a-z]{2}(-Hans|-Hant)?(-[A-Z]{2})?$/;
export const langCodeValidationMessage = 'Must have exactly 2 lowercase letters, optionally followed by a dash and 2 uppercase letters. (e.g. "en" or "en-US")'
export const langCodeValidation = {
  length: {
    min: 2,
  },
  pattern: {
    regex: langCodeRegex,
    message: langCodeValidationMessage
  },
}
export const langCodeDescription = 'A valid ISO language code, potentially followed by an ISO country code (e.g. "en" or "en-US"). For more details: https://www.w3schools.com/tags/ref_language_codes.asp'

const generateLangCode = (name: string) => {
  const slugifiedName = slugify(name);
  const parts = slugifiedName.split('-');
  if (!parts.length) {
    return '';
  }
  if (parts.length > 2) {
    const code = (parts[0] || '').slice(0, 2).toLowerCase();
    return code.length === 2 ? code : '';
  }
  return (parts[0] || '').slice(0, 2).toLowerCase() + (parts[1] ? '-' + (parts[1] || '').slice(0, 2).toUpperCase() : '');
};

export const languages = collection({
  path: `${PUBLIC_CONTENT_DIR}/_data/languages/*`,
  format: { data: 'yaml' },
  entryLayout: 'form',
  label: 'Languages',
  slugField: 'label',
  schema: {
    label: fields.slug({
      name: {
        label: 'Label',
        validation: {
          isRequired: true,
        }
      },
      slug: {
        label: 'Language Code',
        description: langCodeDescription,
        generate: generateLangCode,
        validation: langCodeValidation,
      },
    }),
    urlPattern: fields.text({
      label: 'URL Pattern',
      defaultValue: '{{lang}}/{{permalink}}'
    }),
    default: fields.checkbox({
      label: 'Default Language',
      defaultValue: false
    }),
    redirectUnprefixedUrl: fields.checkbox({
      label: 'Redirect Unprefixed URL',
      description: 'Redirect URLs without a language prefix to this language',
      defaultValue: false
    })
  },
})