export const imageTransformOptions = {
    // which file extensions to process
	extensions: "html", // Default

    // Only optimize images when they are requested in the browser.
		// transformOnRequest: false, // General default
    // transformOnRequest: process.env.ELEVENTY_RUN_MODE === "serve" // (default for HTML Transform and WebC component)

    // Project-relative path to the output image directory
    // outputDir: "./img/", // (default)
    outputDir: "./dist/assets/images/", // (default)
		// A path-prefix-esque directory for the <img src> attribute.
    // Not recommended with Image HTML Transform
		urlPath: "/assets/images/",

		// optional, output image formats
    // formats: ["webp", "jpeg"], // Default
		// Our guess is that we gat either a jpg or png and keep the format with auto but use webp first (as webp supports alpha.)
    // Note: Avif = +1 Build cost
    formats: ["avif", "webp", "auto"],

    // Skip raster formats if SVG
    svgShortCircuit: true,

		// optional, output image widths
		// widths: ["auto"],
		widths: [480, 768, 1280, "auto"],

		// optional, attributes assigned on <img> override these values.
		// defaultAttributes: {
		// 	loading: "lazy",
		// 	decoding: "async",
		// 	sizes: "100vw",
		// },

    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        alt : "", // required
        loading: "lazy",
        decoding: "async",
      },
  
      // HTML attributes added to `<picture>` (omitted when <img> used)
      pictureAttributes: {},
  
      // Which source to use for `<img width height src>` attributes
      fallback: "largest", // or "smallest"
    }
}