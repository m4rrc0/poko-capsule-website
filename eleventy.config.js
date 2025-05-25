// Plugins
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output";
import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginMarkdoc from "@m4rrc0/eleventy-plugin-markdoc";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { imageTransformOptions } from './src/config-11ty/plugins/imageTransform.js';
import populateInputDir from './src/config-11ty/plugins/populateInputDir/index.js';
import yamlData from './src/config-11ty/plugins/yamlData/index.js';
import autoCollections from './src/config-11ty/plugins/auto-collections/index.js';
import keystaticPassthroughFiles from './src/config-11ty/plugins/keystaticPassthroughFiles/index.js';
// Local helper packages
import {
  PUBLIC_WORKING_DIR,
  PUBLIC_WORKING_DIR_ABSOLUTE,
  PUBLIC_CONTENT_DIR,
  PUBLIC_PARTIALS_DIR,
  PUBLIC_LAYOUTS_DIR,
  OUTPUT_DIR,
  FILES_OUTPUT_DIR,
  GLOBAL_PARTIALS_PREFIX } from './config.env.js'
import * as markdocTags from './src/config-markdoc/tags/index.js';
import * as markdocNodes from './src/config-markdoc/nodes/index.js';
import eleventyComputed from './src/data/eleventyComputed.js';
import Markdoc from '@markdoc/markdoc';

// Eleventy Config
import {
  toISOString,
  formatDate,
  dateToSlug,
  slugifyPath,
  filterCollection,
  join,
  first,
  last,
  randomFilter,
} from "./src/config-11ty/filters/index.js";

// TODOS:
// - Look at persisting images in cache between builds: https://github.com/11ty/eleventy-img/issues/285

/**
 * @typedef { import("@11ty/eleventy").UserConfig } UserConfig
 */
export const config = {
  dir: {
    // input: "src/templates",
    input: PUBLIC_WORKING_DIR, // this is probably '_content'
    // input: PUBLIC_WORKING_DIR_ABSOLUTE,
    includes: PUBLIC_PARTIALS_DIR, // this is probably '_partials'
    layouts: PUBLIC_LAYOUTS_DIR, // this is probably '_layouts'
    // data: "../src/data", // Directory for global data files. Default: "_data"
    // data: "/src/data", // Directory for global data files. Default: "_data"
    // output: "public",
    output: OUTPUT_DIR,
  },
  templateFormats: ["md", "njk", "html", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // htmlTemplateEngine: "mdoc",
};

export default async function (eleventyConfig) {
  // --------------------- Base Config
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addWatchTarget("./src/config-11ty/**/*", { resetConfig: true });
  eleventyConfig.addWatchTarget("./src/config-markdoc/**/*", { resetConfig: true }); // NOTE: watching works but changes does not properly rerender...
  // eleventyConfig.setUseGitIgnore(false);

  // --------------------- Plugins Early
  // eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, {
		selector: "h1,h2,h3,h4,h5,h6,.id-attr", // default: "h1,h2,h3,h4,h5,h6"
	});
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, imageTransformOptions);
  eleventyConfig.addPlugin(yamlData);
  eleventyConfig.addPlugin(autoCollections);
  // TODO: reinstate this if 11ty Transform proves to be stable
	// eleventyConfig.addPlugin(pluginWebc, {
  //   components: "src/components/**/*.webc",
  //   useTransform: true,
  // });
  // Populate Default Content
  await eleventyConfig.addPlugin(populateInputDir, {
    // logLevel: 'debug',
    sources: ['src/content']
  });

  // Copy files
  // Retrieve public files from the _files directory
  eleventyConfig.addPlugin(keystaticPassthroughFiles)

  // --------------------- Layouts
  eleventyConfig.addLayoutAlias("base", "base.html");

  // --------------------- Global Data
  eleventyConfig.addGlobalData("layout", "base");
  // eleventyConfig.addGlobalData("globalSettings", globalSettings);
  // Computed Data
  eleventyConfig.addGlobalData("eleventyComputed", eleventyComputed);

  // --------------------- Filters
  // Slug
  eleventyConfig.addFilter("slugifyPath", (input) =>
    slugifyPath(input, eleventyConfig),
  );
  // Date
  eleventyConfig.addFilter("toIsoString", toISOString);
  eleventyConfig.addFilter("formatDate", formatDate);
  eleventyConfig.addFilter("dateToSlug", dateToSlug);
  // Array
  eleventyConfig.addFilter("filterCollection", filterCollection);
  eleventyConfig.addFilter("join", join);
  eleventyConfig.addFilter("first", first);
  eleventyConfig.addFilter("last", last);
  eleventyConfig.addFilter("randomFilter", randomFilter);

  // --------------------- Shortcodes
  // eleventyConfig.addPairedShortcode("calloutShortcode", calloutShortcode);

  // --------------------- Plugins Late
  await eleventyConfig.addPlugin(pluginMarkdoc, {
    deferTags: ['ReferencesManual', 'For'],
    usePartials: [
      {
        cwd: "src/config-markdoc/partials",
        patterns: ["**/*.mdoc"],
        ...(GLOBAL_PARTIALS_PREFIX && { pathPrefix: GLOBAL_PARTIALS_PREFIX })
        // pathPrefix: "global", // Files will appear as "global/filename.mdoc"
        // debug: true,
      },
      {
        cwd: path.join(config.dir.input, config.dir.includes),
        patterns: ["**/*.{mdoc,md,html,webc}"],
        // pathPrefix: "partials", // Files will appear as "partials/filename.mdoc"
        // debug: true,
      },
    ],
    transform: {
      tags: { ...markdocTags },
      // TODO: Try providing a custom img node for eleventy-img to avoid needing the transform?
      nodes: { ...markdocNodes },
    },
    // debug: true,
  });
}
