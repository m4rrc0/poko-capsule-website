// See Keystatic docs: https://keystatic.com/docs/
// import { config, fields, collection, singleton } from '@keystatic/core';
// import { wrapper, block, inline, mark, repeating } from '@keystatic/core/content-components'
// const PUBLIC_CONTENT_DIR = import.meta.env.PUBLIC_CONTENT_DIR || 'content';
// const PUBLIC_USER_DIR = import.meta.env.PUBLIC_USER_DIR || `_user-content`;

export const singletons = {
    // demoContent: singleton({
    //     label: 'Demo Content',
    //     path: `${PUBLIC_CONTENT_DIR}/${PUBLIC_USER_DIR}/demo`,
    //     format: { contentField: 'content' },
    //     entryLayout: 'content',
    //     schema: {
    //         content: fields.markdoc({
    //             label: 'Content'
    //         })
    //     }
    // })
}
export const collections = {}
export const navigation = {
    // 'Demo Content': ['demoContent']
}