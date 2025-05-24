import { fields } from '@keystatic/core';
import { wrapper } from '@keystatic/core/content-components'
import * as ContentComponents from './content-components/index.js';
// TODO: investigate cusotm markdocConfig
// https://docsmill.dev/npm/@keystatic/core@0.5.47#/.fields.markdoc.createMarkdocConfig.createMarkdocConfig
// export const markdocConfig = fields.markdoc.createMarkdocConfig({});
// TODO: investigate custom inline layouts preview (columns, ...)
// https://github.com/Thinkmill/keystatic/issues/1273

export const prose = ({ image }) => fields.markdoc({
  label: 'Prose',
  options: {
    image,
    // link: false,
  },
  components: {
    ...ContentComponents,
    callout: wrapper({
      label: 'Callout',
      schema: {
        title: fields.text({
          label: 'Title',
          validation: {
            isRequired: true,
          },
        }),
        message: fields.text({
          label: 'Message',
          // validation: {
          //   isRequired: true,
          // },
        }),
      }
    })
  }
})
