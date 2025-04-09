import { glob } from 'glob'
import { logger, printDiffTree, loadFiles } from './utils.js'

export default async function(eleventyConfig, pluginOptions) {
    eleventyConfig.versionCheck(">=3.0.0-alpha.1");

    // Get log level from plugin options, eleventy config, or default to 'info'
    // Valid levels: 'debug', 'info', 'warn', 'error', 'silent'
    const logLevel = pluginOptions?.logLevel || 'info';
    
    if (logLevel !== 'silent') {
        logger.log(logLevel === 'debug' ? 'debug' : 'info', `---------- Populate Input Directory : Start ----------`);
        logger.log(logLevel === 'debug' ? 'debug' : 'info', `Populating input directory with logLevel: ${logLevel} (possible options: debug, info, warn, error, silent)`);
    }
    const inputDir = eleventyConfig.dir.input;
    const sources = Array.isArray(pluginOptions?.sources) ? pluginOptions.sources : [pluginOptions?.sources];

    let occupiedPaths = []
    const pathSourceMap = {}; // Track sources for each path
    const skippedPathsMap = {}; // Track paths that were skipped (already existed)
    // TODO: check the nodir option is working as expected
    const actualContentFilePaths = await glob(`${inputDir}/**/*`, {
        nodir: true
    })
    occupiedPaths.push(...actualContentFilePaths.map(p => p.replace(`${inputDir}/`, '')))

    if (logLevel === 'debug') {
        logger.debug(`Number of paths in input dir: ${actualContentFilePaths.length}`);
    }
    await Promise.all(sources.map(async (source) => {
        let srcDir = ''
        let outSubDir = ''
        if (typeof source === 'string') {
            srcDir = source
        }
        if (typeof source === 'object' && source.in) {
            srcDir = source.in
            outSubDir = source.out || ''
        }
 
        if (!srcDir) {
            logger.error(`Invalid source configuration: ${JSON.stringify(source)}`)
            return // Skip this iteration
        }

        const sourceFiles = await loadFiles(`${srcDir}/**/*`)
        for (const file of sourceFiles) {
            const transposedFilePath = (outSubDir ? `${outSubDir}/` : '') + file.path.replace(`${srcDir}/`, '')
            if (!occupiedPaths.includes(transposedFilePath)) {
                eleventyConfig.addTemplate(transposedFilePath, file.content);
                // Log based on the specified log level
                if (logLevel !== 'silent') {
                    if (logLevel === 'debug') {
                        logger.debug(`Virtual Template added: '${transposedFilePath}' from source: '${file.path}'`);
                    } else if (logLevel === 'info') {
                        logger.info(`Virtual Template added: '${transposedFilePath}' (from '${file.path}')`);
                    }
                }
                occupiedPaths.push(transposedFilePath)
                // Track the source of this path for the diff view
                pathSourceMap[transposedFilePath] = file.path;
            } else {
                // Track paths that were skipped because they already existed
                skippedPathsMap[transposedFilePath] = file.path;
                if (logLevel === 'debug') {
                    logger.debug(`Skipped existing path: '${transposedFilePath}' (would be from '${file.path}')`);
                }
                // Important: If a path is both added and skipped (from different sources),
                // make sure we still have it in the skippedPathsMap
            }
        }
    }))
    
    // Summary logging at the end based on log level
    if (logLevel === 'debug') {
        logger.debug(`Sources processed: ${sources.length}`);
        logger.debug(`Total paths added from sources: ${occupiedPaths.length - actualContentFilePaths.length}`);
    } else if (logLevel === 'info') {
        logger.info(`Completed processing ${occupiedPaths.length - actualContentFilePaths.length} templates from ${sources.length} sources`);
    } else if (logLevel === 'warn' || logLevel === 'error') {
        // Only log if there were any issues
        if (sources.some(s => !s || (typeof s === 'object' && !s.in))) {
            logger.warn(`Completed with some configuration issues. Check error logs for details.`);
        }
    }
    // Print tree-like structure of paths if in debug mode
    if (logLevel === 'debug') {
        // Create a combined visualization that includes all paths
        const allPathsForVisualization = [...occupiedPaths];
        
        // Make sure skipped paths are included in the visualization
        Object.keys(skippedPathsMap).forEach(skippedPath => {
            if (!allPathsForVisualization.includes(skippedPath)) {
                allPathsForVisualization.push(skippedPath);
            }
        });
        
        logger.debug(`Path structure:
- Gray: existing files
- Yellow with red source: original files that would also be added from other sources
- Blue with blue source: added files
- Yellow with red source: skipped files (already existed)
- Blue with blue source and red source: files added from one source and skipped from another
${printDiffTree(allPathsForVisualization, actualContentFilePaths, pathSourceMap, skippedPathsMap, inputDir)}`);
    }
    
    if (logLevel !== 'silent') {
        logger.log(logLevel === 'debug' ? 'debug' : 'info', `---------- Populate Input Directory : End ------------`);
    }
}