module.exports = {
  beforeconcat: {
    src: ['src/scripts/*.js', 'dist/scripts/modules/*.js'],
    options: {
      jshintrc: '.jshintrc'
    }
  }
};