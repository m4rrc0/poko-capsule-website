// IMPORTS
import fs from 'fs/promises';
import yaml from 'js-yaml';
// Plugins
import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginMarkdoc from "@m4rrc0/eleventy-plugin-markdoc";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { imageTransformOptions } from './src/config-11ty/plugins/imageTransform.js';
import populateInputDir from './src/config-11ty/plugins/populateInputDir/index.js';
// Local helper packages
import { PUBLIC_CONTENT_DIR } from './config.env.js'
import { div, callout, calloutShortcode } from './src/config-markdoc/tags-examples.js';
import eleventyComputed from './src/data/eleventyComputed.js';
// import { consoleInfo, loadFiles } from './src/utils/build.js';
// Eleventy Config
import {
  toISOString,
  formatDate,
  dateToSlug,
  slugifyPath,
} from "./src/config-11ty/filters/index.js";


/**
 * @typedef { import("@11ty/eleventy").UserConfig } UserConfig
 */
export const config = {
  dir: {
    // input: "src/templates",
    input: PUBLIC_CONTENT_DIR,
    // includes: "../_includes",
    includes: "",
    // data: "../src/data", // Directory for global data files. Default: "_data"
    // data: "/src/data", // Directory for global data files. Default: "_data"
    // output: "public",
    output: "dist",
  },
  templateFormats: ["md", "njk", "html", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // htmlTemplateEngine: "mdoc",
};

export default async function (eleventyConfig) {
  // --------------------- Base Config
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addWatchTarget("./src/");
  eleventyConfig.addWatchTarget("./src/config-11ty/", { resetConfig: true,  }); // NOTE: watching works but changes does not properly rerender...
  // eleventyConfig.addWatchTarget("./src/content/", { resetConfig: true,  }); // NOTE: watching works but changes does not properly rerender...
  eleventyConfig.setUseGitIgnore(false);

  // --------------------- Read user config
  const globalSettingsYaml = await fs.readFile(`${PUBLIC_CONTENT_DIR}/_settings/global.yaml`, 'utf8');
  const globalSettings = yaml.load(globalSettingsYaml);

      // --------------------- Read user config
  // const globalSettingsYaml = await readFirstExistingFile([
  //   `${PUBLIC_CONTENT_DIR}/_settings/global.yaml`,
  //   `${PUBLIC_WORKING_DIR}/_settings/global.yaml`
  // ])
  // const globalSettingsYaml = await fs.readFile(`src/themes/${PUBLIC_WORKING_SUBDIR}/_settings/global.yaml`, 'utf8');
  // const globalSettingsYaml = await fs.readFile(`${PUBLIC_CONTENT_DIR}/_settings/global.yaml`, 'utf8');
  // const globalSettings = yaml.load(globalSettingsYaml);



  // --------------------- Populate Default Content
  eleventyConfig.addTemplate("pages/virtual.md", `# Hello Virtual`, {
    layout: "base",
    permalink: "/virtual/"
  });

  eleventyConfig.addTemplate("virtualll.11ty.js", {
    data: () => ({ var: 2 }),
    render: function(data) {
      return `this is a test ${data.var}.`;
    }
  });
  
  // --------------------- Plugins
  eleventyConfig.addPlugin(directoryOutputPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, imageTransformOptions);
	eleventyConfig.addPlugin(pluginWebc, {
    components: "src/components/**/*.webc",
    useTransform: true,
  });
  eleventyConfig.addPlugin(pluginMarkdoc, {
    transform: {
      tags: {
        div,
        callout
      }
    }
  });
  await eleventyConfig.addPlugin(populateInputDir, {
    // logLevel: 'debug',
    sources: ['src/content']
  });

  // --------------------- Layouts
  eleventyConfig.addLayoutAlias("base", "_layouts/base.html");
  
  // --------------------- Global Data
  eleventyConfig.addGlobalData("layout", "base");
  eleventyConfig.addGlobalData("globalSettings", globalSettings);
  // Computed Data
  eleventyConfig.addGlobalData("eleventyComputed", eleventyComputed);

  // --------------------- Filters
  eleventyConfig.addFilter("toIsoString", toISOString);
  eleventyConfig.addFilter("formatDate", formatDate);
  eleventyConfig.addFilter("dateToString", dateToSlug);
  eleventyConfig.addFilter("slugifyPath", (input) =>
    slugifyPath(input, eleventyConfig),
  );

  // --------------------- Shortcodes
  // eleventyConfig.addPairedShortcode("calloutShortcode", calloutShortcode);
}
