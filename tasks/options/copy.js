module.exports = {
  main: {
    files: [
      // includes all js files within path src and copy them into dest
      {expand: true, src: ['./src/scripts/**/*'], dest: './dist/scripts/'}
    ]
  },
  change:{
    src: 'src/a',
    dest: 'src/a.bak',
    // All s, a,d or spaces will be replace by _ and saved as a.back
    options: {
      process: function (content, srcpath) {
        return content.replace(/[sad ]/g,"_");
      },
    },
  }
}