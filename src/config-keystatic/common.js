import { PUBLIC_WORKING_DIR, globalSettings } from './variables.js';

export const collections = ['pages', ...(globalSettings?.collections || [])];

export const imageDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_images/${dir}`,
    publicPath: `/_images/${dir}/`,
})

export const fileDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_files/${dir}`,
    publicPath: `/assets/files/${dir}/`,
})
