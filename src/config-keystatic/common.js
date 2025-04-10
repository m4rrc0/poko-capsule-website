import { PUBLIC_WORKING_DIR } from './variables.js';

export const imageDirs = (dir) => ({
    directory: `${PUBLIC_WORKING_DIR}/_images/${dir}`,
    publicPath: `/_images/${dir}/`,
})