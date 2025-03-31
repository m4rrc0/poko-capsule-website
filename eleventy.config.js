import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output";
import pluginMarkdoc from "@m4rrc0/eleventy-plugin-markdoc";
import Markdoc from "@markdoc/markdoc";

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
    data: "../src/data", // Directory for global data files. Default: "_data"
    // output: "public",
    output: "dist", // TODO: should it output to public on build?
  },
  templateFormats: ["md", "njk", "html", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // htmlTemplateEngine: "mdoc",
};

// export const callout = {
//   render: 'div',
//   // children: ['paragraph', 'tag', 'list'],
//   // attributes: {
//   //   type: {
//   //     type: String,
//   //     default: 'note',
//   //     matches: ['caution', 'check', 'note', 'warning'],
//   //     errorLevel: 'critical'
//   //   },
//   //   title: {
//   //     type: String
//   //   }
//   // }
// };
// export const callout = {
//   render: 'div',
//   children: [],
//   // selfClosing: true,
//   // attributes: {
//   //     primary: {
//   //         type: Array,
//   //     }
//   // },
//   // transform({ attributes }) {
//   //     // const { primary, ...attr1AsObject } = attributes;

//   //     console.log(attributes);

//   //     return 'HELLO WORLD';
//   // }
// };

export const callout = {
  render: "poko-callout",
  // children: ['paragraph', 'tag', 'list'],
  // selfClosing: true,
  // attributes: {
  //     primary: {
  //         type: Array,
  //     }
  // },
  // transform(node, config) {
  //     const attributes = node.transformAttributes(config);
  //     const children = node.transformChildren(config);
  //     // const newNode = node.transform(config);
  //     // const newTag = new Markdoc.Tag(node.name, attributes, children);
  //     const newTag = new Markdoc.Tag("poko-callout", attributes, children);

  //     console.log({ attributes, children, node, newTag, "node.name": node.name });

  //     const { primary, ...attr1AsObject } = attributes;

  //     // TODO: Find a way to automatically convert paired shortcodes

  //     // const innerContent = Markdoc.parse(children)
  //     // const innerHtml = Markdoc.renderers.html(children)
  //     // console.log({ child: children[0], innerHtml })
  //     // return Array.isArray(primary) ? fn(innerHtml, ...primary) : fn(innerHtml, primary);

  //     // const innerContent = children.map(child => {
  //     //     // return new Markdoc.Tag(child.name, child.attributes, child.children)
  //     //     const html = Markdoc.renderers.html(child);
  //     //     return html
  //     // })
  //     // console.log({ node, children, innerContent })
  //     // return Array.isArray(primary) ? fn(innerContent, ...primary) : fn(innerContent, primary);
      
  //     // return Array.isArray(primary) ? fn(children, ...primary) : fn(children, primary);
  //     // return '<p>Hey there</p>'
  //     // return new Markdoc.Tag(name, attrs, children);
      
  //     return newTag
  // }
};

export default async function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/");
  eleventyConfig.addWatchTarget("./src/config-11ty/", { resetConfig: true,  }); // NOTE: watching works but changes does not properly rerender...

  eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(pluginMarkdoc, {
    transform: {
      tags: {
        callout
      }
    }
  });

  // --------------------- Layouts
  eleventyConfig.addLayoutAlias("base", "_layouts/base.html");

  eleventyConfig.addGlobalData("layout", "base");

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
