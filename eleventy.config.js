import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output";

// IMPORT CONFIG
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
    input: "content",
    // includes: "../_includes",
    includes: "",
    // data: "_data", // Directory for global data files. Default: "_data"
    // output: "dist",
    output: "public",
  },
  templateFormats: ["md", "njk", "html", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};

export default async function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/");
  eleventyConfig.addWatchTarget("./src/config-11ty/", { resetConfig: true,  }); // NOTE: watching works but changes does not properly rerender...

  eleventyConfig.addPlugin(directoryOutputPlugin);

  // --------------------- Filters
  eleventyConfig.addFilter("toIsoString", toISOString);
  eleventyConfig.addFilter("formatDate", formatDate);
  eleventyConfig.addFilter("dateToString", dateToSlug);
  eleventyConfig.addFilter("slugifyPath", (input) =>
    slugifyPath(input, eleventyConfig),
  );
}

// const env = require("./src/env");
// import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output";
// const pluginRSS = require("@11ty/eleventy-plugin-rss");
// const pluginWebc = require("@11ty/eleventy-plugin-webc");

// const postcss = require("postcss");
// const atImport = require("postcss-import");
// const htmlmin = require("html-minifier");

// export default function (eleventyConfig) {
// 	const templateFormats = ["html", "njk", "md", "11ty.js"];
// 	const markdownTemplateEngine = "njk";
// 	const htmlTemplateEngine = "njk";
// 	const dir = {
// 		input: "seed/templates",
// 		includes: "../includes",
// 		// includes: "../components",
// 		// layouts: "../layouts",
// 		data: "../data",
// 		output: "dist",
// 	};

// 	eleventyConfig.setUseGitIgnore(false);
// 	// eleventyConfig.addWatchTarget("./src");
// 	eleventyConfig.setWatchThrottleWaitTime(100);

// 	eleventyConfig.setQuietMode(true);
// 	eleventyConfig.addPlugin(directoryOutputPlugin);

// 	// eleventyConfig.setFrontMatterParsingOptions({
// 	// 	language: "json", // default is "yaml"
// 	// });

// 	return {
// 		templateFormats,
// 		markdownTemplateEngine,
// 		htmlTemplateEngine,
// 		dir,
// 	};
// }
//
