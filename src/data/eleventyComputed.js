export default {
	permalink: (data) => {
        const filePathStem = data.page.filePathStem
        const filePathStemNoIndex = filePathStem.replace(/\/index\/index/, '')

        if (filePathStem.startsWith('/_')) {
            return false;
        }

        if (/\/index\/index/.test(filePathStem)) {
            return `${filePathStemNoIndex}index.${data.page.outputFileExtension}`
        }

        // return `${filePathStem}index.${data.page.outputFileExtension}`
        return data.page.permalink;
    }
};