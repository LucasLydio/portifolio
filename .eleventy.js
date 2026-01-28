export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/styles": "css" });
  eleventyConfig.addPassthroughCopy({ "src/scripts": "js" });

  eleventyConfig.addWatchTarget("./src/styles/");
  eleventyConfig.addWatchTarget("./src/scripts/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "components",
      data: "data"
    },
    templateFormats: ["html", "md"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid"
  };
}
