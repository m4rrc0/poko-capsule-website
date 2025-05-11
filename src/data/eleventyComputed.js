import { PUBLIC_USER_DIR } from '../../config.env.js';
// Was usefull when parents were declared in references
// import temp from './temp.js';
import mapInputPathToUrl from '../utils/mapInputPathToUrl.js';

// function mapInputPathToUrl(filePathStem) {
//     return filePathStem
//         .replace(/^\/pages/, '')
//         .replace(new RegExp(`^\/${PUBLIC_USER_DIR}`), '')
//         .replace(/\/index$/, '') + '/index'
// }

export default {
    // ...temp,
    lang: (data) => data.lang || data.globalSettings?.lang || 'en',
    permalink: (data) => {
        // console.log({tags: data.tags})
        if (typeof data.permalink === 'boolean' && !data.permalink) {
            return false;
        }
        if (typeof data.permalink === 'string' && data.permalink !== '') {
            // NOTE: Can come from a directory data file with embedded permalink
            return data.permalink;
        }

        // const filePathStem = data.page.filePathStem
        //     .replace(/^\/pages/, '')
        //     .replace(new RegExp(`^\/${PUBLIC_USER_DIR}`), '')
        //     .replace(/\/index$/, '') + '/index'

        const url = mapInputPathToUrl(data.page.filePathStem);
        const permalink = url.permalink;

        if (permalink.startsWith('/_')) {
            return false;
        }

        // TODO: understand why permalinks fail when I reference this
        // const parentsPath = (data.parentSlugs || []).join('/');
        // return `${data.parentSlug ? `${data.parentSlug}/` : ''}${filePathStem}.${data.page.outputFileExtension}`

        return `${permalink}.${data.page.outputFileExtension}`
    },
    eleventyNavigation: (data) => {
        if (!data.eleventyNavigation?.add) {
            return false;
        }
        return {
            key: data.page.fileSlug,
            title: data.eleventyNavigation?.title || data.name,
            parent: data.eleventyNavigation?.parent,
            order: data.eleventyNavigation?.order,
        }
    },
    // eleventyNavigation: {
    //     // add: (data) => data.eleventyNavigation?.add || false,
    //     key: (data) => data.page.fileSlug,
    //     title: (data) => data.eleventyNavigation?.title || data.name || "test",
    // },
    // eleventyNavigation: (data) => data.eleventyNavigation?.add ? data.eleventyNavigation : undefined,
    metadata: (data) => {
        const siteName = data.globalSettings?.siteName || '';
        return {
            title: (data.metadata?.title || data.name || data.title) + (siteName ? ` | ${siteName}` : ''),
            description: data.metadata?.description ?? '',
            image: data.metadata?.image ?? '',
        }
    },
};
