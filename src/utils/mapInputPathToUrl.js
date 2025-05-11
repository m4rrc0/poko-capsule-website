import { PUBLIC_USER_DIR } from '../../config.env.js';

const dirsToStrip = ['pages', PUBLIC_USER_DIR];
const stripRegex = new RegExp(`${dirsToStrip.join('|')}`);

export default function mapInputPathToUrl(filePathStem) {
    const unWrapped = filePathStem
        .replace(/^\/+/, '') // remove leading slashes (even multiple)
        .replace(/\/+$/, '') // remove trailing slash
        .replace(/\/index$/, ''); // remove trailing '/index'
    
    const formatted = unWrapped
        .replace(stripRegex, '') // remove leading unwanted dir names (like 'pages')
    
    const url = {}
    url.href = `/${formatted}/`.replace(/\/+/g, '/'); // remove multiple slashes
    url.pathname = `/${formatted}`.replace(/\/+/g, '/'); // remove multiple slashes
    url.permalink = url.href + 'index'

    return url
}