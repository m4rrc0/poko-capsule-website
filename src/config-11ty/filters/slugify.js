// export function slugify(input) {
//   if (!input) return "";

//   // make lower case and trim
//   var slug = input.toLowerCase().trim();

//   // remove accents from charaters
//   slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

//   // replace invalid chars with spaces
//   slug = slug.replace(/[^a-z0-9\s-]/g, " ").trim();

//   // replace multiple spaces or hyphens with a single hyphen
//   slug = slug.replace(/[\s-]+/g, "-");

//   return slug;
// }

export function slugifyPath(input, eleventyConfig) {
  const slugify = eleventyConfig.getFilter("slugify");

  // match one or more `/` preceded or followed by 0 or more `-`
  return slugify(input, { preserveCharacters: ["/"] }).replace(
    /[-]*\/+[-]*/g,
    "/",
  );
}
