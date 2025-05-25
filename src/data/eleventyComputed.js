import { PUBLIC_USER_DIR } from '../../config.env.js';
// Was usefull when parents were declared in references
// import temp from './temp.js';
import mapInputPathToUrl from '../utils/mapInputPathToUrl.js';

// const autoTagNameDico = {
//     pages: 'page',
//     articles: 'article',
//     people: 'person',
//     organizations: 'organization'
// }

export default {
    // ...temp,
    lang: (data) => data.lang || data.globalSettings?.lang || 'en',
    h1Content: data => {
        const {rawInput} = data.page
        
        if (!rawInput) return '';
        
        // Try to match h1 tag content - works for HTML and some template formats
        const h1Match = rawInput.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (h1Match && h1Match[1]) return h1Match[1].trim();
        
        // Try to match markdown # heading
        const mdMatch = rawInput.match(/^\s*#\s+(.+?)\s*$/m);
        if (mdMatch && mdMatch[1]) return mdMatch[1].trim();
        
        return '';
    },
    title: (data) => data.title || data.name || data.h1Content,
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
            title: data.eleventyNavigation?.title || data.title,
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
            title: [(data.metadata?.title || data.title), siteName].filter(Boolean).join(' | '),
            description: data.metadata?.description ?? '',
            image: data.metadata?.image ?? '',
        }
    },
    date: (data) => data.page?.date,
    url: (data) => data.page?.url,
};
