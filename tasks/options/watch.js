module.exports = {
  options: {
    livereload: true,
  },
  html:{
    files: ['src/*.html']
  },
  css:{
    files: ['src/sass/**/*.scss'],
    tasks: ['sass']
  },
  scripts: {
    files: ['src/scripts/**/*.js'],
    tasks: ['jshint']
  }
}