import { PUBLIC_USER_DIR } from '../../config.env.js';
// Was usefull when parents were declared in references
// import temp from './temp.js';

export default {
    // ...temp,
    permalink: (data) => {
        if (typeof data.permalink === 'boolean' && !data.permalink) {
            return false;
        }
        if (typeof data.permalink === 'string' && data.permalink !== '') {
            // TODO: I just want to detect if this happens
            console.log({permalink: data.permalink})
        }
        const filePathStem = data.page.filePathStem
            .replace(/^\/pages/, '')
            .replace(new RegExp(`^\/${PUBLIC_USER_DIR}`), '')
            .replace(/\/index$/, '') + '/index'

        if (filePathStem.startsWith('/_')) {
            return false;
        }

        // TODO: understand why permalinks fail when I reference this
        // const parentsPath = (data.parentSlugs || []).join('/');
        // return `${data.parentSlug ? `${data.parentSlug}/` : ''}${filePathStem}.${data.page.outputFileExtension}`

        return `${filePathStem}.${data.page.outputFileExtension}`
    },
    eleventyNavigation: (data) => {
        const isNavItem = data.nav?.discriminant;
        const hasCustomNavValue = data.nav?.value?.discriminant;
        const navCustomValues = data.nav?.value?.value;
        if (!isNavItem) {
            // Do not add to eleventyNavigation
            return;
        }
        if (!hasCustomNavValue) {
            // Add to eleventyNavigation with default values from page
            return {
                key: data.page.fileSlug,
                title: data.name,
                // parent: data.parentSlug, // Not used for now... ?permalink bug?
                order: data.order ?? 0,
            }
        }
        if (hasCustomNavValue) {
            // Add to eleventyNavigation with customized nav values
            return {
                key: data.page.fileSlug,
                title: navCustomValues?.title ?? data.name,
                parent: navCustomValues?.parent ?? data.parentSlug,
                order: navCustomValues?.order ?? data.order ?? 0,
            }
        }
        console.error(`Unexpected nav configuration: ${data.nav}`)
        return;
    },
    metadata: (data) => {
        const siteName = data.globalSettings?.siteName || '';
        return {
            title: (data.metadata?.title || data.name) + (siteName ? ` | ${siteName}` : ''),
            description: data.metadata?.description ?? '',
            image: data.metadata?.image ?? '',
        }
    },
};
