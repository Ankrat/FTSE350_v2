module.exports = {
  clean: {
    build: ["dist"],
    js: ["dist/script/*.js", "!dist/script/*.min.js"],
    css: ["dist/styles/*.css", "!dist/styles/*.min.css"]
  }
}