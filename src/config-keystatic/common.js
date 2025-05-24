import { fields } from '@keystatic/core'
import { PUBLIC_WORKING_DIR, globalSettings } from './variables.js';

export const collections = ['pages', ...(globalSettings?.collections || [])];

export const collectionSelect = fields.select({
    label: 'Collection',
    // description: 'The type of link.',
    options: collections.map(c => ({ label: c, value: c })),
    defaultValue: 'pages',
    validation: {
        isRequired: true,
    },
})

export const imageDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_images/${dir}`,
    publicPath: `/_images/${dir}/`,
})

export const fileDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_files/${dir}`,
    publicPath: `/assets/files/${dir}/`,
})
